// Plain, serializable shapes returned by the home server actions.
// BigInt counters are converted to number and timestamps to ISO strings.

export interface IChannelRankingItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  isVerified: boolean;
}

export interface IChannelCursor {
  // Stored as string so large int8 values survive the round trip unchanged.
  subscriberCount: string;
  id: string;
}

export interface IChannelRankingPage {
  items: IChannelRankingItem[];
  nextCursor: IChannelCursor | null;
}
