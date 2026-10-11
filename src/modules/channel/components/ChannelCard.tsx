import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCompact } from "@/modules/home/utils/format";
import { resizeYoutubeAvatar } from "@/modules/home/utils/image";
import { IChannelListItem } from "../types/channel-list.types";

const ChannelCard = ({ channel }: { channel: IChannelListItem }) => (
  <Link
    href={`/channel/${channel.id}`}
    className="flex h-full items-center gap-3 rounded-xl p-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
  >
    <Image
      src={resizeYoutubeAvatar(channel.thumbnailUrl, 96)}
      alt=""
      width={48}
      height={48}
      className="size-12 shrink-0 rounded-full object-cover"
    />
    <div className="flex min-w-0 flex-col">
      <span className="flex items-center gap-2 font-medium">
        <span className="truncate">{channel.name}</span>
        {channel.isVerified && <Badge variant="secondary">Verified</Badge>}
      </span>
      <span className="text-sm text-muted-foreground">
        {formatCompact(channel.subscriberCount)} subscribers · {formatCompact(channel.videoCount)} video
      </span>
    </div>
  </Link>
);

export default ChannelCard;
