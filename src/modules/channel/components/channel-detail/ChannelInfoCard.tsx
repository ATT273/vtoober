import Image from "next/image";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompact, formatDateTime } from "@/modules/home/utils/format";
import { resizeYoutubeAvatar } from "@/modules/home/utils/image";
import { FEATURES } from "@/shared/constants/features";
import { IChannelDetail } from "../../types/channel.types";
import FavoriteButton from "./FavoriteButton";

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col rounded-lg bg-muted/50 p-3">
    <span className="text-xl font-semibold tabular-nums">{formatCompact(value)}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const ChannelInfoCard = ({ channel, badge }: { channel: IChannelDetail; badge?: ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-wrap items-center gap-4">
      <Image
        src={resizeYoutubeAvatar(channel.thumbnailUrl, 160)}
        alt=""
        width={80}
        height={80}
        className="size-20 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
          {channel.name}
          {channel.isVerified && <Badge variant="secondary">Verified</Badge>}
          {badge}
        </CardTitle>
        <CardDescription>
          <a href={channel.url} target="_blank" rel="noreferrer" className="break-all hover:underline">
            {channel.url}
          </a>
        </CardDescription>
      </div>
      {FEATURES.favorites && <FavoriteButton channelId={channel.id} />}
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Subscribers" value={channel.subscriberCount} />
        <Stat label="Lượt xem" value={channel.viewCount} />
        <Stat label="Video" value={channel.videoCount} />
      </div>
      {channel.description && <p className="text-sm whitespace-pre-line">{channel.description}</p>}
      {channel.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {channel.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Cập nhật lần cuối: {formatDateTime(channel.lastSyncedAt)}</p>
    </CardContent>
  </Card>
);

export default ChannelInfoCard;
