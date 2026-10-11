// Plain, serializable shapes returned by the channel server actions.
// BigInt counters are converted to number and timestamps to ISO strings.

export interface IChannelSnapshot {
  id: string;
  subscriberCount: number;
  viewCount: number;
  recordedAt: string;
}

export interface IChannelDetail {
  id: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  isVerified: boolean;
  youtubeChannelId: string;
  description: string;
  tags: string[];
  source: string;
  lastSyncedAt: string;
  snapshots: IChannelSnapshot[];
}

export type ChannelVideoKind = "videos" | "shorts" | "streams";

export interface IChannelVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
}

export interface IChannelVideoPage {
  items: IChannelVideo[];
  nextPageToken: string | null;
}

export interface IChannelLiveNow {
  videoId: string;
  title: string;
  viewers: number | null;
  startedAt: string | null;
}
