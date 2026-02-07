
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { Button, Link } from "@heroui/react";
import { useLazyCurrentQuery, useLoginMutation } from "../../app/services/userApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ErrorMessage } from "../../components/error-message";
import { hasErrorField } from "../../utils/has-error-field";

type Login = {
  email: string
  password: string
}

type Props = {
  setSelected: (value: string) => void;
}

type LoginFormValues = { email: string; password: string };

export const Login = ({ setSelected }: Props) => {

  const { handleSubmit, control, formState: { errors } } = useForm<Login>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");

   // TODO
  const navigate = useNavigate();
  const [triggerCurrentQuery] = useLazyCurrentQuery();

  const onSubmit = async (data: Login) => {
    try {
      await login(data).unwrap();
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error);
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Input<LoginFormValues>
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Required field"
      />
      <Input<LoginFormValues>
        control={control}
        name="password"
        label="Password"
        type="password"
        required="Required field"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        No account?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => { setSelected("sign-up") }}>
          Register
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Login
        </Button>
      </div>
    </form>
  )
}
