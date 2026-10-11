import React from "react";
import { LinkButton } from "@/components/ui/button";
import { ISession } from "@/types/auth.types";
import { FEATURES } from "@/shared/constants/features";

interface WelcomeLayoutProps {
  session: ISession | null;
}

const WelcomeLayout = ({ session }: WelcomeLayoutProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-10 items-center justify-center">
      <h1 className="text-3xl font-semibold text-center">Welcome to Vtoober 😘</h1>
      <p className="text-xl text-center">
        Xin chào, <span className="font-semibold">{session ? session.name : "Guest"}</span>!
      </p>
      {session || !FEATURES.auth ? (
        <LinkButton href="/home" size="lg" className="px-6">
          Đến trang chủ
        </LinkButton>
      ) : (
        <LinkButton href="/authentication" size="lg" className="px-6">
          Đăng nhập / Đăng ký
        </LinkButton>
      )}
    </div>
  );
};

export default WelcomeLayout;
