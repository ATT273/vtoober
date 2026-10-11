"use client";
import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useChannelDetail } from "../../hooks/useChannelDetails";
import ChannelInfoCard from "./ChannelInfoCard";
import ChannelLiveSection from "./ChannelLiveSection";
import ChannelStatsHistory from "./ChannelStatsHistory";
import ChannelVideosTabs from "./ChannelVideosTabs";

// Shared by /channel/[id] and the profile pages of users who linked a channel.
const ChannelDetail = ({ id, badge }: { id: string; badge?: ReactNode }) => {
  const { data: channel, error, isPending, isError } = useChannelDetail(id);

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return <p className="py-10 text-center text-destructive">Không tải được channel: {error.message}</p>;
  }

  if (!channel) {
    return <p className="py-10 text-center text-muted-foreground">Không tìm thấy channel.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ChannelInfoCard channel={channel} badge={badge} />
      <ChannelLiveSection channelId={channel.id} />
      <ChannelVideosTabs channelId={channel.id} />
      <ChannelStatsHistory snapshots={channel.snapshots} />
    </div>
  );
};

export default ChannelDetail;
