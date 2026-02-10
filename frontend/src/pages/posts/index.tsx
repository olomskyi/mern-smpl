
import { useGetAllPostsQuery } from "../../app/services/postsApi"
import { Card } from "../../components/card";
import { CreatePost } from "../../components/create-post";

export const Posts = () => {
    const { data } = useGetAllPostsQuery(undefined);

    console.log("Posts data:", data);

    return (
        <>
            <div className="mb-10 w-full" >
                <CreatePost />
            </div>
            {data && data.length > 0 ? data.map(
                ({ content, author, id, authorId, comments, likes, likesByUser, createdAt }) => (
                    <Card key={id}
                        avatarUrl={author.avatarUrl ?? ''}
                        content={content}
                        name={author.name ?? ''}
                        authorId={authorId}
                        likesCount={likes.length}
                        commentsCount={comments.length}
                        likedByUser={likesByUser}
                        createdAt={createdAt}
                        id={id}
                        cardFor='post' >
                    </Card>
                )) : null
            }
        </>
    )
}