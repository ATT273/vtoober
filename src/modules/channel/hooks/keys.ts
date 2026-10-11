import { ChannelVideoKind } from "../types/channel.types";

export const channelKeys = {
  all: ["channels"] as const,
  list: (limit: number) => [...channelKeys.all, "list", { limit }] as const,
  ranking: (limit: number) => [...channelKeys.all, "ranking", { limit }] as const,
  detail: (id: string) => [...channelKeys.all, "detail", id] as const,
  videos: (id: string, kind: ChannelVideoKind) => [...channelKeys.all, "videos", id, kind] as const,
  liveNow: (id: string) => [...channelKeys.all, "live-now", id] as const,
  favoriteStatus: (id: string) => [...channelKeys.all, "favorite-status", id] as const,
  myFavorites: () => [...channelKeys.all, "my-favorites"] as const,
};
