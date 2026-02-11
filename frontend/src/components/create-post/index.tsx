import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useCreatePostMutation, useLazyGetAllPostsQuery } from "../../app/services/postsApi"
import { Button, Textarea } from "@heroui/react";
import { ErrorMessage } from "../error-message";
import { IoMdCreate } from "react-icons/io";

type FormValues = { post: string };

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();

    const { handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>();
    const error = errors.post?.message ?? "";
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await createPost({ content: data.post }).unwrap();
            setValue("post", "");
            await triggerAllPosts(undefined).unwrap();
        } catch (err) {
            console.log("Post submit error:", err);
        }
    };

    return (
        <form className="grow" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <Controller name="post" control={control} defaultValue=""
                rules={{ required: "Required field" }}
                render={({ field }) => (
                    <Textarea {...field} labelPlacement="outside" placeholder="What are you thinking about?" className="mb-5" />
                )} />
            {error && <ErrorMessage error={error} />}

            <Button color="success" className="flex-end" endContent={<IoMdCreate />} type="submit">Add post</Button>
        </form>
    )
}