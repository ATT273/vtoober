import { ChannelVideoKind } from "../types/channel.types";

export const youtubeVideoUrl = (videoId: string, kind: ChannelVideoKind = "videos") =>
  kind === "shorts" ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`;

// hqdefault (480x360) keeps enough pixels when a shorts thumbnail is cropped to 9:16.
export const youtubeHqThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

// Privacy-enhanced embed; autoplay muted so browsers allow it.
export const youtubeEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1`;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" });

export const formatVideoDate = (iso: string) => dateFormatter.format(new Date(iso));
