"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getChannelRanking } from "@/modules/home/actions";
import { IChannelCursor } from "@/modules/home/types/channel.types";
import { channelKeys } from "./keys";

export const useChannelRanking = (limit = 20) =>
  useInfiniteQuery({
    queryKey: channelKeys.ranking(limit),
    queryFn: ({ pageParam }) => getChannelRanking({ cursor: pageParam, limit }),
    initialPageParam: null as IChannelCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
