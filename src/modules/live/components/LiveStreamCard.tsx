import Image from "next/image";
import { EyeIcon } from "lucide-react";
import ProfileAvatar from "@/components/customs/ProfileAvatar";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/modules/home/utils/format";
import { ILiveStream, LiveLayout } from "../types/live.types";
import { formatRelativeTime, youtubeThumbnailUrl, youtubeWatchUrl } from "../utils/stream";

const LiveThumbnail = ({ stream, sizes }: { stream: ILiveStream; sizes: string }) => (
  <div className="relative aspect-video shrink-0 overflow-hidden rounded-lg bg-muted">
    <Image
      src={youtubeThumbnailUrl(stream.videoId)}
      alt=""
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-200 group-hover:scale-105"
    />
    {stream.status === "live" ? (
      <span className="absolute top-1.5 left-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
        LIVE
      </span>
    ) : (
      <span className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
        SẮP LIVE
      </span>
    )}
    {/* Upcoming streams report 0 viewers, so the count only means something while live. */}
    {stream.status === "live" && stream.viewers !== null && (
      <span className="absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white tabular-nums">
        <EyeIcon className="size-3" />
        {formatCompact(stream.viewers)}
      </span>
    )}
  </div>
);

const LiveMeta = ({ stream }: { stream: ILiveStream }) => {
  const time =
    stream.status === "live"
      ? stream.startedAt && `Bắt đầu ${formatRelativeTime(stream.startedAt)}`
      : stream.scheduledAt && `Dự kiến ${formatRelativeTime(stream.scheduledAt)}`;
  const parts = [stream.channel.org, time];
  return <span className="truncate text-xs text-muted-foreground">{parts.filter(Boolean).join(" · ")}</span>;
};

const LiveStreamCard = ({ stream, layout }: { stream: ILiveStream; layout: LiveLayout }) => {
  const channelName = stream.channel.englishName ?? stream.channel.name;

  return (
    <a
      href={youtubeWatchUrl(stream.videoId)}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group flex rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        layout === "grid" ? "flex-col gap-3" : "items-center gap-4 p-2 transition-colors hover:bg-muted/50",
      )}
    >
      {layout === "grid" ? (
        <>
          <LiveThumbnail stream={stream} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <div className="flex min-w-0 gap-3">
            <ProfileAvatar name={channelName} avatarUrl={stream.channel.photoUrl} className="size-9 text-sm" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="line-clamp-2 text-sm font-medium" title={stream.title}>
                {stream.title}
              </span>
              <span className="truncate text-sm text-muted-foreground">{channelName}</span>
              <LiveMeta stream={stream} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-40 sm:w-48">
            <LiveThumbnail stream={stream} sizes="192px" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="line-clamp-2 font-medium" title={stream.title}>
              {stream.title}
            </span>
            <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <ProfileAvatar name={channelName} avatarUrl={stream.channel.photoUrl} className="size-6 text-xs" />
              <span className="truncate">{channelName}</span>
            </span>
            <LiveMeta stream={stream} />
          </div>
        </>
      )}
    </a>
  );
};

export default LiveStreamCard;
