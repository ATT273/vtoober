// Plain, serializable shapes returned by the profile server actions.

export interface IChannelClaim {
  youtubeChannelId: string;
  channelName: string | null;
  thumbnailUrl: string | null;
  code: string;
  expiresAt: string;
}

export interface IMyProfile {
  name: string;
  email: string | null;
  linkedChannelId: string | null;
  pendingClaim: IChannelClaim | null;
}

export type ChannelLinkResult = { ok: true } | { ok: false; error: string };
