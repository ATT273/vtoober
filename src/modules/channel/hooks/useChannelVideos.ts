"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getChannelVideos } from "../actions";
import { ChannelVideoKind } from "../types/channel.types";
import { channelKeys } from "./keys";

export const useChannelVideos = (channelId: string, kind: ChannelVideoKind) =>
  useInfiniteQuery({
    queryKey: channelKeys.videos(channelId, kind),
    queryFn: ({ pageParam }) => getChannelVideos({ channelId, kind, pageToken: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    // Matches the server-side revalidate window.
    staleTime: 10 * 60_000,
  });
