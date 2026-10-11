"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/app/actions";
import { LoginInput, loginSchema } from "../../schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

interface LoginFormProps {
  toSignup: () => void;
}

const initalForm: LoginInput = {
  email: "",
  password: "",
};

const LoginForm = ({ toSignup }: LoginFormProps) => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: initalForm,
    mode: "onSubmit",
  });

  const onSubmit = (values: LoginInput) => {
    setError("");
    startTransition(async () => {
      // On success the action redirects to /home.
      const result = await login(values);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              {...field}
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              {...field}
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" isDisabled={isPending}>
        {isPending && <Spinner />}
        Đăng nhập
      </Button>
      <Button type="button" variant="link" onPress={toSignup} className="text-sky-500">
        Bạn chưa có tài khoản? Hãy đăng ký tại đây
      </Button>
    </form>
  );
};

export default LoginForm;
