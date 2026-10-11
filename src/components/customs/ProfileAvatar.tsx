import Image from "next/image";
import { cn } from "@/lib/utils";
import { resizeYoutubeAvatar } from "@/modules/home/utils/image";

const AVATAR_SIZE = 40;

interface IProfileAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

// Shows the linked YouTube avatar, or the first letter of the name when none is linked.
const ProfileAvatar = ({ name, avatarUrl, className }: IProfileAvatarProps) => {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-base font-semibold text-primary-foreground",
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={resizeYoutubeAvatar(avatarUrl, AVATAR_SIZE * 2)}
          alt={name}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className="size-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
};

export default ProfileAvatar;
