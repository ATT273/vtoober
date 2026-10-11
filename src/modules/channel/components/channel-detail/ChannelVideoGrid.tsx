"use client";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useChannelVideos } from "../../hooks/useChannelVideos";
import { ChannelVideoKind } from "../../types/channel.types";
import { formatVideoDate, youtubeHqThumbnailUrl, youtubeVideoUrl } from "../../utils/video";

const EMPTY_TEXT: Record<ChannelVideoKind, string> = {
  videos: "Channel chưa có video nào.",
  shorts: "Channel chưa có shorts nào.",
  streams: "Channel chưa có livestream nào.",
};

const ChannelVideoGrid = ({ channelId, kind }: { channelId: string; kind: ChannelVideoKind }) => {
  const { data, error, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useChannelVideos(
    channelId,
    kind,
  );
  const sentinelRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });
  const isShorts = kind === "shorts";

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return <p className="py-10 text-center text-destructive">Không tải được video: {error.message}</p>;
  }

  const videos = data.pages.flatMap((page) => page.items);
  if (videos.length === 0) {
    return <p className="py-10 text-center text-muted-foreground">{EMPTY_TEXT[kind]}</p>;
  }

  return (
    <div className="flex flex-col">
      <ul
        className={cn(
          "grid gap-x-3 gap-y-5",
          isShorts ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        )}
      >
        {videos.map((video) => (
          <li key={video.videoId}>
            <a
              href={youtubeVideoUrl(video.videoId, kind)}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-lg bg-muted",
                  isShorts ? "aspect-[9/16]" : "aspect-video",
                )}
              >
                <Image
                  src={isShorts ? youtubeHqThumbnailUrl(video.videoId) : (video.thumbnailUrl ?? youtubeHqThumbnailUrl(video.videoId))}
                  alt=""
                  fill
                  sizes={isShorts ? "(min-width: 768px) 20vw, 50vw" : "(min-width: 768px) 30vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="line-clamp-2 text-sm font-medium" title={video.title}>
                {video.title}
              </span>
              {video.publishedAt && (
                <span className="-mt-1 text-xs text-muted-foreground">{formatVideoDate(video.publishedAt)}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && <Spinner className="size-5" />}
      </div>
    </div>
  );
};

export default ChannelVideoGrid;
