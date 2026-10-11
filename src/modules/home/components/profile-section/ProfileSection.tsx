"use client";
import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProfileAvatar from "@/components/customs/ProfileAvatar";
import { logout } from "@/app/actions";
import { ISession } from "@/types/auth.types";
import { FEATURES } from "@/shared/constants/features";

const ProfileSection = ({ session }: { session: ISession | null }) => {
  const router = useRouter();

  if (!session) {
    if (!FEATURES.auth) return null;
    return (
      <LinkButton href="/authentication" size="lg" className="fixed right-4 bottom-4 z-40 rounded-full px-5 shadow-md">
        Đăng nhập / Đăng ký
      </LinkButton>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-background/90 py-1.5 pr-1.5 pl-4 shadow-md ring-1 ring-foreground/10 backdrop-blur">
      <span className="max-w-40 truncate text-sm font-medium">{session.name}</span>
      <DropdownMenuTrigger>
        <Button variant="ghost" aria-label="Mở menu tài khoản" className="size-10 rounded-full p-0">
          <ProfileAvatar name={session.name} avatarUrl={session.avatarUrl} />
        </Button>
        <DropdownMenu placement="top end" className="w-44">
          <DropdownMenuItem textValue="Trang cá nhân" onAction={() => router.push("/profile")}>
            <UserIcon />
            Trang cá nhân
          </DropdownMenuItem>
          <DropdownMenuItem textValue="Đăng xuất" variant="destructive" onAction={() => logout()}>
            <LogOutIcon />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </div>
  );
};

export default ProfileSection;
