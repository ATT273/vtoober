"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getChannelList } from "../actions";
import { IChannelListCursor } from "../types/channel-list.types";
import { channelKeys } from "./keys";

export const useChannelList = (limit = 24) =>
  useInfiniteQuery({
    queryKey: channelKeys.list(limit),
    queryFn: ({ pageParam }) => getChannelList({ cursor: pageParam, limit }),
    initialPageParam: null as IChannelListCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
