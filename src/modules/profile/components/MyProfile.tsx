"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import ProfileAvatar from "@/components/customs/ProfileAvatar";
import ChannelDetail from "@/modules/channel/components/channel-detail/ChannelDetail";
import { FEATURES } from "@/shared/constants/features";
import { useMyProfile } from "../hooks/useMyProfile";
import FavoriteChannels from "./FavoriteChannels";
import LinkChannelPanel from "./link-channel/LinkChannelPanel";

const MyProfile = () => {
  const { data: profile, error, isPending, isError } = useMyProfile();

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return <p className="py-10 text-center text-destructive">Không tải được trang cá nhân: {error.message}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {profile.linkedChannelId ? (
        <ChannelDetail id={profile.linkedChannelId} badge={<Badge>Kênh của bạn</Badge>} />
      ) : (
        // Same slot as the channel info card on the channel detail page.
        <Card>
          <CardHeader className="flex items-center gap-4">
            <ProfileAvatar name={profile.name} className="size-20 text-3xl" />
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              {profile.email && <CardDescription>{profile.email}</CardDescription>}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Bạn chưa liên kết kênh YouTube. Liên kết để hiển thị thông tin kênh, video và buổi live trên trang cá nhân.
            </p>
            <LinkChannelPanel pendingClaim={profile.pendingClaim} />
          </CardContent>
        </Card>
      )}
      {FEATURES.favorites && <FavoriteChannels />}
    </div>
  );
};

export default MyProfile;
