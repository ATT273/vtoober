"use client";
import { useQuery } from "@tanstack/react-query";
import { getChannelDetail } from "../actions";
import { channelKeys } from "./keys";

export const useChannelDetail = (id: string) =>
  useQuery({
    queryKey: channelKeys.detail(id),
    queryFn: () => getChannelDetail(id),
    enabled: Boolean(id),
  });
