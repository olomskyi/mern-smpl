import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postsApi";
import { Card } from "../../components/card";
import { GoBack } from "../../components/go-back";
import { CreateComment } from "../../components/create-comment";

export const CurrentPost = () => {

    const params = useParams<{id: string}>();
    const { data } = useGetPostByIdQuery(params.id ?? '');

    if (!data) {
        return <h2>Post not found</h2>
    } else {
        console.log("Current posts data:", data);
    }

    const {content, id, authorId, comments, likes,
            author, likesByUser, createdAt} = data;

    return (
        <>
        <GoBack />
        <Card
            cardFor="current-post"
            avatarUrl={author.avatarUrl ?? ''}
            name={author.name ?? ''}
            content={content}
            likesCount={likes.length}
            commentsCount={comments.length}
            authorId={authorId}
            id={id}
            likedByUser={likesByUser}
            createdAt={createdAt}
        />
        <div className="mt-10">
            <CreateComment />
        </div>
        <div className="mt-10" >
            {data.comments.length ? data.comments.map((comment) => (
                <Card
                    key={comment.id}
                    cardFor="comment"
                    avatarUrl={comment.user.avatarUrl ?? ''}
                    name={comment.user.name ?? ''}
                    content={comment.content}
                    authorId={comment.userId}
                    id={comment.id}
                />
            )) : null
            }
        </div>
        </>
    )
}