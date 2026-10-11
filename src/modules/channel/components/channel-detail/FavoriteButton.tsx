"use client";
import { HeartIcon } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useFavoriteStatus, useToggleFavorite } from "../../hooks/useFavoriteChannel";

const FavoriteButton = ({ channelId }: { channelId: string }) => {
  const { authSession } = useAuth();
  const isLoggedIn = Boolean(authSession);
  const { data: isFavorite = false, isPending } = useFavoriteStatus(channelId, isLoggedIn);
  const toggle = useToggleFavorite(channelId);

  if (!isLoggedIn) {
    return (
      <LinkButton href="/authentication" variant="outline" size="sm">
        <HeartIcon />
        Đăng nhập để yêu thích
      </LinkButton>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant={isFavorite ? "secondary" : "outline"}
        size="sm"
        isDisabled={isPending || toggle.isPending}
        aria-pressed={isFavorite}
        onPress={() => toggle.mutate()}
      >
        <HeartIcon className={cn(isFavorite && "fill-red-500 text-red-500")} />
        {isFavorite ? "Đã yêu thích" : "Yêu thích"}
      </Button>
      {toggle.isError && <span className="text-xs text-destructive">{toggle.error.message}</span>}
    </div>
  );
};

export default FavoriteButton;
