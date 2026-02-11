
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useLazyGetPostByIdQuery } from "../../app/services/postsApi"
import { Button, Textarea } from "@heroui/react";
import { ErrorMessage } from "../error-message";
import { IoMdCreate } from "react-icons/io";
import { useCreateCommentMutation } from "../../app/services/commentsApi";
import { useParams } from "react-router-dom";

type FormValues = { comment: string };

export const CreateComment = () => {
    const { id } = useParams<{ id: string }>();
    const [createComment] = useCreateCommentMutation();
    const [getPostById] = useLazyGetPostByIdQuery();

    const { handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>();
    const error = errors.comment?.message ?? "";
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (id) {
                await createComment({ content: data.comment, postId: id }).unwrap();
                setValue("comment", "");
                await getPostById(id).unwrap();
            } else {
                console.log("No ID to create comment!");
            }
        } catch (err) {
            console.log("Comment submit error:", err);
        }
    };

    return (
        <form className="grow" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <Controller name="comment" control={control} defaultValue=""
                rules={{ required: "Required field" }}
                render={({ field }) => (
                    <Textarea {...field} labelPlacement="outside" placeholder="Add your comment" className="mb-5" />
                )} />
            {error && <ErrorMessage error={error} />}

            <Button color="primary" className="flex-end" endContent={<IoMdCreate />} type="submit">Comment</Button>
        </form>
    )
}