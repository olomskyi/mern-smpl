import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { Button, Link } from "@heroui/react";
import { useRegisterMutation } from "../../app/services/userApi";
import { ErrorMessage } from "../../components/error-message";
import { hasErrorField } from "../../utils/has-error-field";
import { useState } from "react";
import {type  SubmitHandler } from "react-hook-form";

type Register = {
  email: string
  name: string
  password: string
}

type Props = { setSelected: (value: string) => void };
type RegisterFormValues = { email: string; password: string; name: string };

export const Register = ({ setSelected }: Props) => {
    const { handleSubmit, control, formState: { errors }, } = useForm<Register>({
      mode: "onChange",
      reValidateMode: "onBlur",
      defaultValues: {
        email: "",
        password: "",
        name: "",
      },
    })

  const [register] = useRegisterMutation();
  const [error, setError] = useState("");

const onSubmit: SubmitHandler<Register> = async (data) => {
  try {
    await register(data).unwrap();
    setSelected("login");
  } catch (err) {
    if (hasErrorField(err)) {
      setError(err.data.error);
    }
  }
};

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Input<RegisterFormValues>
        control={control}
        required="Required field"
        label="Name"
        name="name"
        type="text"
      />
      <Input<RegisterFormValues>
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Required field"
      />
      <Input<RegisterFormValues>
        control={control}
        name="password"
        label="Password"
        type="password"
        required="Required field"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        Already have an account?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => {setSelected("login")}}>
          Login
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit">
          Register
        </Button>
      </div>
    </form>
  )
}
