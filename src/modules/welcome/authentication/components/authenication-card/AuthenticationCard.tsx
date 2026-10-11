"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "../login-form/LoginForm";
import { useState } from "react";
import SignupForm from "../sign-up-form/SignupForm";

const AuthenticationCard = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toSignup = () => {
    setShowLoginForm(false);
  };

  const toLogin = () => {
    setShowLoginForm(true);
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{showLoginForm ? "Đăng nhập" : "Đăng ký"}</CardTitle>
        <CardDescription>
          {showLoginForm ? "Đăng nhập để tiếp tục sử dụng Vtoober" : "Tạo tài khoản Vtoober mới"}
        </CardDescription>
      </CardHeader>
      <CardContent>{showLoginForm ? <LoginForm toSignup={toSignup} /> : <SignupForm toLogin={toLogin} />}</CardContent>
    </Card>
  );
};

export default AuthenticationCard;
