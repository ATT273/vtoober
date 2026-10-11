"use client";
import { useQuery } from "@tanstack/react-query";
import { getChannelLiveNow } from "../actions";
import { channelKeys } from "./keys";

const LIVE_STALE_MS = 60_000;

export const useChannelLiveNow = (channelId: string) =>
  useQuery({
    queryKey: channelKeys.liveNow(channelId),
    queryFn: () => getChannelLiveNow(channelId),
    staleTime: LIVE_STALE_MS,
    // Pick up a stream starting or ending while the page is open.
    refetchInterval: LIVE_STALE_MS,
  });
