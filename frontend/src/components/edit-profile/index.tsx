
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, } from "@heroui/react";
import { useContext, useState } from "react";
import type React from "react";
import { ThemeContext } from "../theme-provider";
import { Controller, useForm } from "react-hook-form";
import { type User } from "../../app/types";
import { Input } from "../input";
import { useUpdateUserMutation } from "../../app/services/userApi";
import { useParams } from "react-router-dom";
import { hasErrorField } from "../../utils/has-error-field";
import { ErrorMessage } from "../error-message";
import { MdOutlineEmail } from "react-icons/md";

type Props = {
    isOpen: boolean
    onClose: () => void
    user?: User;
}

export const EditProfile: React.FC<Props> = ({ isOpen, onClose, user }) => {
    const { theme } = useContext(ThemeContext)
    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [error, setError] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { id } = useParams<{ id: string }>()

    const { handleSubmit, control } = useForm<User>({
        mode: "onChange",
        reValidateMode: "onBlur",
        defaultValues: {
            email: user?.email,
            name: user?.name,
            dateOfBirth: user?.dateOfBirth,
            bio: user?.bio,
            location: user?.location,
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            setSelectedFile(event.target.files[0]);
        }
    }

    const onSubmit = async (data: User) => {
        if (id) {
            try {
                const formData = new FormData();
                if (data.name) formData.append("name", data.name);
                if (data.email && data.email !== user?.email) formData.append("email", data.email);
                if (data.dateOfBirth) {
                    formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString());
                }
                if (data.bio) formData.append("bio", data.bio);
                if (data.location) formData.append("location", data.location);
                if (selectedFile) formData.append("avatar", selectedFile);

                await updateUser({ userData: formData, id }).unwrap();
                onClose();
            } catch (err) {
                console.log("EditProfile error:", err);
                if (hasErrorField(err)) {
                    setError(err.data.error);
                }
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`${theme} text-foreground`}
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Change profile
                        </ModalHeader>
                        <ModalBody>
                            <form className="flex flex-col gap-4" onSubmit={() => { void handleSubmit(onSubmit) }} >
                                <Input
                                    control={control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    endContent={<MdOutlineEmail />}
                                />
                                <Input control={control} name="name" label="Name" type="text" />
                                <input
                                    name="avatarUrl"
                                    placeholder="Select file"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <Input
                                    control={control}
                                    name="dateOfBirth"
                                    label="Birthday"
                                    type="date"
                                    placeholder="Birthday"
                                />
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            rows={4}
                                            placeholder="Bio"
                                        />
                                    )}
                                />
                                <Input
                                    control={control}
                                    name="location"
                                    label="Location"
                                    type="text"
                                />
                                <ErrorMessage error={error} />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        fullWidth
                                        color="primary"
                                        type="submit"
                                        isLoading={isLoading}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
