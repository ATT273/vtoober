import { ILiveStream } from "../types/live.types";

const relativeFormatter = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

// "12 phút trước" / "sau 3 giờ" style label relative to now.
export const formatRelativeTime = (iso: string, now = Date.now()) => {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60_000);
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, "hour");
  return relativeFormatter.format(Math.round(hours / 24), "day");
};

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

// mqdefault is 320x180, enough for both card sizes.
export const youtubeThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

const normalize = (value: string) => value.normalize("NFKC").toLowerCase();

// Holodex /live has no text search, so filtering happens on the loaded streams.
export const matchesSearch = (stream: ILiveStream, query: string) => {
  const needle = normalize(query.trim());
  if (!needle) return true;
  return [stream.title, stream.channel.name, stream.channel.englishName, stream.channel.org, stream.topic].some(
    (field) => field && normalize(field).includes(needle),
  );
};

// Offset pagination over live data can repeat a stream when the list shifts between pages.
export const uniqueStreams = (streams: ILiveStream[]) => {
  const seen = new Set<string>();
  return streams.filter((stream) => {
    if (seen.has(stream.videoId)) return false;
    seen.add(stream.videoId);
    return true;
  });
};
