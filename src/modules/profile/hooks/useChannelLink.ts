"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { channelKeys } from "@/modules/channel/hooks/keys";
import { cancelChannelLink, startChannelLink, verifyChannelLink } from "../actions";
import { ChannelLinkResult } from "../types/profile.types";
import { profileKeys } from "./keys";

// Expected failures come back as { ok: false }; surface them as mutation errors.
const unwrap = (result: ChannelLinkResult) => {
  if (!result.ok) throw new Error(result.error);
};

export const useStartChannelLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: string) => unwrap(await startChannelLink(input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
  });
};

export const useVerifyChannelLink = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => unwrap(await verifyChannelLink()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      // The linked channel may be new to the channel lists.
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      // Server-rendered session data (avatar) now comes from the linked channel.
      router.refresh();
    },
  });
};

export const useCancelChannelLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelChannelLink(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
  });
};
