"use client";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useChannelList } from "../hooks/useChannelList";
import ChannelCard from "./ChannelCard";

const ChannelList = () => {
  const { data, error, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useChannelList();
  const sentinelRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

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
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <li key={channel.id}>
            <ChannelCard channel={channel} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && <Spinner className="size-5" />}
        {!hasNextPage && <span className="text-sm text-muted-foreground">Đã hiển thị tất cả channel</span>}
      </div>
    </div>
  );
};

export default ChannelList;
