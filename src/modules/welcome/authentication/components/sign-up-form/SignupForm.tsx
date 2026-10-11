"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { signup } from "@/app/actions";
import { SignupInput, signupSchema } from "../../schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

interface SignupFormProps {
  toLogin: () => void;
}

const initalForm: SignupInput = {
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
};

const fields: {
  name: keyof SignupInput;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}[] = [
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "your@email.com" },
  { name: "userName", label: "Username", type: "text", autoComplete: "nickname", placeholder: "" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password", placeholder: "••••••" },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "••••••",
  },
];

const SignupForm = ({ toLogin }: SignupFormProps) => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: initalForm,
    mode: "onSubmit",
  });

  const onSubmit = (values: SignupInput) => {
    setError("");
    setMessage("");
    startTransition(async () => {
      // On success with an active session the action redirects to /home.
      const result = await signup(values);
      if (result?.error) setError(result.error);
      if (result?.message) {
        setMessage(result.message);
        form.reset();
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {fields.map(({ name, label, ...inputProps }) => (
        <Controller
          key={name}
          name={name}
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={`signup-${name}`}>{label}</Label>
              <Input {...field} {...inputProps} id={`signup-${name}`} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" className="w-full" isDisabled={isPending}>
        {isPending && <Spinner />}
        Đăng ký
      </Button>
      <Button type="button" variant="link" onPress={toLogin} className="text-sky-500">
        Bạn đã có tài khoản? Hãy đăng nhập
      </Button>
    </form>
  );
};

export default SignupForm;
