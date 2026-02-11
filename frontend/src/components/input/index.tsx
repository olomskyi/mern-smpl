
import type { ReactNode } from "react";
import { type FieldValues, useController, type Control, type Path } from "react-hook-form";
import { Input as HeroInput } from "@heroui/react";

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    control: Control<T>;
    required?: string;
    endContent?: ReactNode;
}

export const Input = <T extends FieldValues>({
    name, label, placeholder, type, control, required = '', endContent }: Props<T>) => {

    const { field, fieldState: { invalid }, formState: { errors } } = useController({
        name,
        control,
        rules: { required }
    });

    return (
        <HeroInput
            id={name}
            label={label}
            type={type}
            placeholder={placeholder}
            value={field.value}
            name={field.name}
            isInvalid={invalid}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={typeof errors[name]?.message === "string" ? errors[name].message : ""}
            endContent={endContent}
        />
    )
}