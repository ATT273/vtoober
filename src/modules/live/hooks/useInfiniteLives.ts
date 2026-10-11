"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLiveStreams } from "../actions";
import { ILiveStreamParams } from "../types/live.types";
import { liveKeys } from "./keys";

// Matches the server-side revalidate window in getLiveStreams.
const LIVE_STALE_MS = 60_000;

export const useInfiniteLives = ({ limit = 50, ...params }: Omit<ILiveStreamParams, "offset"> = {}) =>
  useInfiniteQuery({
    queryKey: liveKeys.infinite({ limit, ...params }),
    queryFn: ({ pageParam }) => getLiveStreams({ ...params, limit, offset: pageParam }),
    initialPageParam: 0,
    // Holodex paginates by offset: the next page starts after everything loaded so far.
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((count, page) => count + page.items.length, 0);
      return lastPage.items.length > 0 && loaded < lastPage.total ? loaded : undefined;
    },
    staleTime: LIVE_STALE_MS,
  });
