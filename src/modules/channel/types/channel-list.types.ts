// Plain, serializable shapes returned by the channel list server action.

export interface IChannelListItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  isVerified: boolean;
}

export interface IChannelListCursor {
  name: string;
  id: string;
}

export interface IChannelListPage {
  items: IChannelListItem[];
  nextCursor: IChannelListCursor | null;
}
