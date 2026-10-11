"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLiveStreams } from "../actions";
import { ILiveStreamParams } from "../types/live.types";
import { liveKeys } from "./keys";

// Matches the server-side revalidate window in getLiveStreams.
const LIVE_STALE_MS = 60_000;

export const useGetLives = (params: ILiveStreamParams = {}) =>
  useQuery({
    queryKey: liveKeys.list(params),
    queryFn: () => getLiveStreams(params),
    staleTime: LIVE_STALE_MS,
    // Live status and viewer counts change constantly; poll while the page is open.
    refetchInterval: LIVE_STALE_MS,
    // Keep the current page on screen while the next offset/filter loads.
    placeholderData: keepPreviousData,
  });
