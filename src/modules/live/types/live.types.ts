// Raw shapes returned by Holodex GET /live (only the fields we use).

export interface IHolodexChannel {
  id: string;
  name: string;
  english_name?: string | null;
  type: string;
  photo?: string | null;
  org?: string | null;
  suborg?: string | null;
}

export interface IHolodexVideo {
  id: string;
  title: string;
  type: string;
  topic_id?: string | null;
  status: string;
  available_at: string;
  start_scheduled?: string | null;
  start_actual?: string | null;
  live_viewers?: number | null;
  channel: IHolodexChannel;
}

export interface IHolodexPaginated<T> {
  // Holodex may return the total as a string.
  total: number | string;
  items: T[];
}

// Plain, serializable shapes returned by the live server actions.

export type LiveStatus = "live" | "upcoming";

export type LiveLayout = "list" | "grid";

export interface ILiveStream {
  videoId: string;
  title: string;
  status: string;
  topic: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  viewers: number | null;
  channel: {
    youtubeChannelId: string;
    name: string;
    englishName: string | null;
    photoUrl: string | null;
    org: string | null;
  };
}

export interface ILiveStreamParams {
  status?: LiveStatus;
  type?: string;
  org?: string;
  channelId?: string;
  limit?: number;
  offset?: number;
}

export interface ILiveStreamPage {
  items: ILiveStream[];
  total: number;
}
