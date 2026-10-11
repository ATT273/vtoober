"use client";
import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useInfiniteLives } from "../hooks/useInfiniteLives";
import { LiveLayout, LiveStatus } from "../types/live.types";
import { matchesSearch, uniqueStreams } from "../utils/stream";
import LiveStreamCard from "./LiveStreamCard";

const COPY: Record<LiveStatus, { total: string; empty: string }> = {
  live: { total: "stream đang live", empty: "Hiện không có ai đang live" },
  upcoming: { total: "stream sắp diễn ra", empty: "Chưa có stream nào được lên lịch" },
};

interface ILiveStreamListProps {
  status: LiveStatus;
  search: string;
  layout: LiveLayout;
}

const LiveStreamList = ({ status, search, layout }: ILiveStreamListProps) => {
  const { data, error, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteLives({
    status,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load the next page when the sentinel below the list scrolls into view. While a search hides most
  // rows the sentinel stays visible, so this keeps paging until every stream has been searched.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "400px" },
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

  const allStreams = uniqueStreams(data.pages.flatMap((page) => page.items));
  const streams = allStreams.filter((stream) => matchesSearch(stream, search));
  const total = data.pages[0]?.total ?? 0;
  const isSearching = search.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {isSearching
          ? `${streams.length} kết quả trong ${allStreams.length}/${total} stream đã tải`
          : `${total} ${COPY[status].total}`}
      </p>

      {streams.length > 0 && (
        <ul
          className={cn(
            layout === "grid"
              ? "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-1",
          )}
        >
          {streams.map((stream) => (
            <li key={stream.videoId}>
              <LiveStreamCard stream={stream} layout={layout} />
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage ? (
          <Spinner className="size-5" />
        ) : (
          !hasNextPage && (
            <span className="text-sm text-muted-foreground">
              {streams.length === 0
                ? isSearching
                  ? "Không tìm thấy stream phù hợp"
                  : COPY[status].empty
                : "Đã hiển thị tất cả stream"}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default LiveStreamList;
