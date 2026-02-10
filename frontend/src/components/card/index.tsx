
import { CardHeader, Card as HeroCard, Spinner, CardBody, CardFooter } from '@heroui/react';
import type React from 'react';
import { useState } from 'react';
import { useLikePostMutation, useUnlikePostMutation } from '../../app/services/likesApi';
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi';
import { useDeleteCommentMutation } from '../../app/services/commentsApi';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCurrent } from '../../features/user/userSlice';
import { User } from "../user"
import { RiDeleteBinLine } from 'react-icons/ri';
import { ErrorMessage } from '../error-message';
import { hasErrorField } from '../../utils/has-error-field';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { FcDislike } from 'react-icons/fc';
import { FaHeart, FaRegComment } from 'react-icons/fa';
import { Typography } from '../typography';
import { MetaInfo } from '../meta-info';

type Props = {
    avatarUrl: string;
    name: string;
    authorId: string;
    content: string;
    commentId?: string;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: Date;
    id?: string;
    cardFor: 'comment' | 'post' | 'current-post';
    likedByUser?: boolean;
}

export const Card: React.FC<Props> = ({
    avatarUrl, name, authorId, content, commentId = '', likesCount = 0, commentsCount = 0,
    createdAt, id = '', cardFor, likedByUser
}) => {
    const [likePost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
    const [triggerGetPostById] = useLazyGetPostByIdQuery();
    const [deletePost, deletePostStatus] = useDeletePostMutation();
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrent);
    const [liked, setLiked] = useState(likedByUser ?? false);

    console.log("Card create, likedByUser:", likedByUser);

    const refetchPosts = async () => {
        switch (cardFor) {
            case "post":
                await triggerGetAllPosts(undefined).unwrap();
                break
            case "current-post":
                await triggerGetAllPosts(undefined).unwrap();
                break
            case "comment":
                await triggerGetPostById(id).unwrap();
                break
            default:
                throw new Error("Wrong cardFor")
        }
    }

    const handleClick = async () => {
        console.log("Handle click, likedByUser:", liked);
        try {
            if (liked) {
                await unlikePost(id).unwrap();
                setLiked(false);
            } else {
                await likePost({ postId: id }).unwrap();
                setLiked(true);
            }
            await refetchPosts();
        } catch (err) {
            if (hasErrorField(err)) {
                setError(err.data.error);
            } else {
                setError(err as string);
            }
        }
    }

    const handleDelete = async () => {
        console.log("Handle delete:", cardFor);
        try {
            switch (cardFor) {
                case "post":
                    await deletePost(id).unwrap()
                    await refetchPosts()
                    break
                case "current-post":
                    await deletePost(id).unwrap()
                    void navigate('/')
                    break
                case "comment":
                    await deleteComment(commentId).unwrap()
                    await refetchPosts()
                    break
                default:
                    throw new Error("Wrong cardFor")
            }

        } catch (err) {
            console.log(err)
            if (hasErrorField(err)) {
                setError(err.data.error)
            } else {
                setError(err as string)
            }
        }
    }

    return (
        <HeroCard className='mb-5'>
            <CardHeader className='justify-between items-center bg-transparent'>
                <Link to={`/users/${authorId}`}>
                    <User
                        name={name}
                        className="text-small font-semibold leading-none text-default-600"
                        avatarUrl={avatarUrl}
                        description={createdAt && formatToClientDate(createdAt)}
                    />
                </Link>
                {authorId === currentUser?.id && (
                    <div className="cursor-pointer" onClick={() => void handleDelete()}>
                        {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (<Spinner />) : (<RiDeleteBinLine />)}</div>)}
            </CardHeader>
            <CardBody className="px-3 py-2 mb-5">
                <Typography>{content}</Typography>
            </CardBody>
            {cardFor !== "comment" && (
                <CardFooter className="gap-3">
                    <div className="flex gap-5 items-center">
                        <div onClick={() => void handleClick()}>
                            <MetaInfo
                                count={likesCount}
                                Icon={likedByUser ? FcDislike : FaHeart }
                            />
                        </div>
                        <Link to={`/posts/${id}`}>
                            <MetaInfo count={commentsCount} Icon={FaRegComment} />
                        </Link>
                    </div>
                    <ErrorMessage error={error} />
                </CardFooter>)}
        </HeroCard>
    )
}
