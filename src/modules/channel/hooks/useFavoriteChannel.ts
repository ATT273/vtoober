"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoriteStatus, getMyFavoriteChannels, toggleFavorite } from "../actions";
import { channelKeys } from "./keys";

export const useFavoriteStatus = (channelId: string, enabled: boolean) =>
  useQuery({
    queryKey: channelKeys.favoriteStatus(channelId),
    queryFn: () => getFavoriteStatus(channelId),
    enabled,
  });

export const useToggleFavorite = (channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFavorite(channelId),
    onSuccess: (isFavorite) => {
      queryClient.setQueryData(channelKeys.favoriteStatus(channelId), isFavorite);
      queryClient.invalidateQueries({ queryKey: channelKeys.myFavorites() });
    },
  });
};

export const useMyFavoriteChannels = () =>
  useQuery({
    queryKey: channelKeys.myFavorites(),
    queryFn: () => getMyFavoriteChannels(),
  });
