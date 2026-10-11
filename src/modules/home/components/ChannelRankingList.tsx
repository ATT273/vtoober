"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useChannelRanking } from "@/modules/channel/hooks/useChannelRanking";
import { formatCompact } from "../utils/format";
import { resizeYoutubeAvatar } from "../utils/image";

const ChannelRankingList = () => {
  const { data, error, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useChannelRanking();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load the next page when the sentinel below the list scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return <p className="py-10 text-center text-destructive">Không tải được danh sách: {error.message}</p>;
  }

  const channels = data.pages.flatMap((page) => page.items);

  if (channels.length === 0) {
    return <p className="py-10 text-center text-muted-foreground">Chưa có channel nào.</p>;
  }

  return (
    <div className="w-full">
      <ol className="flex flex-col divide-y rounded-xl ring-1 ring-foreground/10">
        {channels.map((channel, index) => (
          <li key={channel.id}>
            <Link
              href={`/channel/${channel.id}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <span className="w-8 text-right text-lg font-semibold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <Image
                src={resizeYoutubeAvatar(channel.thumbnailUrl, 96)}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2 truncate font-medium">
                  {channel.name}
                  {channel.isVerified && <Badge variant="secondary">Verified</Badge>}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatCompact(channel.videoCount)} video · {formatCompact(channel.viewCount)} lượt xem
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold tabular-nums">{formatCompact(channel.subscriberCount)}</div>
                <div className="text-xs text-muted-foreground">subscribers</div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && <Spinner className="size-5" />}
        {!hasNextPage && <span className="text-sm text-muted-foreground">Đã hiển thị tất cả channel</span>}
      </div>
    </div>
  );
};

export default ChannelRankingList;
