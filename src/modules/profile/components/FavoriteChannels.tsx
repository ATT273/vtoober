"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import ChannelCard from "@/modules/channel/components/ChannelCard";
import { useMyFavoriteChannels } from "@/modules/channel/hooks/useFavoriteChannel";

const FavoriteChannels = () => {
  const { data: channels, error, isPending, isError } = useMyFavoriteChannels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Các Vtuber yêu thích</CardTitle>
        {channels && channels.length > 0 && <CardDescription>{channels.length} channel</CardDescription>}
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Không tải được danh sách: {error.message}</p>
        ) : channels.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Bạn chưa có Vtuber yêu thích nào. Bấm &quot;Yêu thích&quot; ở trang của một channel để thêm vào đây.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {channels.map((channel) => (
              <li key={channel.id}>
                <ChannelCard channel={channel} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteChannels;
