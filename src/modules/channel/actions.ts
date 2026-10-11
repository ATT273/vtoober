"use server";
import { z } from "zod";
import { db } from "@/prisma/db";
import { getSession } from "@/app/actions";
import { fetchCurrentLive, fetchPlaylistPage, uploadsPlaylistId } from "@/lib/youtube";
import { FEATURES } from "@/shared/constants/features";
import { IChannelListCursor, IChannelListItem, IChannelListPage } from "./types/channel-list.types";
import {
  ChannelVideoKind,
  IChannelDetail,
  IChannelLiveNow,
  IChannelVideoPage,
} from "./types/channel.types";

// Channel data is public: these actions are callable without a session (favourites excepted).

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;
const SNAPSHOT_LIMIT = 30;
// Upload lists change slowly; share one YouTube response across visitors for this long (seconds).
const VIDEOS_REVALIDATE_SECONDS = 600;
const LIVE_REVALIDATE_SECONDS = 60;
const VIDEO_KINDS: ChannelVideoKind[] = ["videos", "shorts", "streams"];

const isUuid = (id: string) => z.uuid().safeParse(id).success;

const listFields = ["id", "name", "thumbnailUrl", "subscriberCount", "videoCount", "isVerified"] as const;

const toListItem = (row: {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: bigint;
  videoCount: bigint;
  isVerified: boolean;
}): IChannelListItem => ({
  id: row.id,
  name: row.name,
  thumbnailUrl: row.thumbnailUrl,
  subscriberCount: Number(row.subscriberCount),
  videoCount: Number(row.videoCount),
  isVerified: row.isVerified,
});

export const getChannelList = async ({
  cursor,
  limit = DEFAULT_PAGE_SIZE,
}: {
  cursor?: IChannelListCursor | null;
  limit?: number;
}): Promise<IChannelListPage> => {
  const pageSize = Math.min(Math.max(1, Math.floor(limit)), MAX_PAGE_SIZE);

  // Alphabetical by name; id breaks ties between channels with the same name.
  let query = db.orm.public.Channel.select(...listFields).orderBy([(c) => c.name.asc(), (c) => c.id.asc()]);
  if (cursor) {
    query = query.cursor({ name: cursor.name, id: cursor.id });
  }

  // Fetch one extra row to know whether another page exists.
  const rows = await query.limit(pageSize + 1).all();
  const hasMore = rows.length > pageSize;
  const pageRows = hasMore ? rows.slice(0, pageSize) : rows;

  const last = pageRows[pageRows.length - 1];
  return {
    items: pageRows.map(toListItem),
    nextCursor: hasMore && last ? { name: last.name, id: last.id } : null,
  };
};

export const getChannelDetail = async (id: string): Promise<IChannelDetail | null> => {
  // A malformed id would make Postgres reject the uuid cast; treat it as not found.
  if (!isUuid(id)) return null;

  const channel = await db.orm.public.Channel.first({ id });
  if (!channel) return null;

  const snapshots = await db.orm.public.ChannelSnapshot.select("id", "subscriberCount", "viewCount", "recordedAt")
    .where((s) => s.channelId.eq(id))
    .orderBy((s) => s.recordedAt.desc())
    .limit(SNAPSHOT_LIMIT)
    .all();

  return {
    id: channel.id,
    name: channel.name,
    thumbnailUrl: channel.thumbnailUrl,
    url: channel.url,
    subscriberCount: Number(channel.subscriberCount),
    viewCount: Number(channel.viewCount),
    videoCount: Number(channel.videoCount),
    isVerified: channel.isVerified,
    youtubeChannelId: channel.youtubeChannelId,
    description: channel.description,
    tags: Array.isArray(channel.tags) ? channel.tags.map(String) : [],
    source: channel.source,
    lastSyncedAt: channel.lastSyncedAt.toString(),
    snapshots: snapshots.map((s) => ({
      id: s.id,
      subscriberCount: Number(s.subscriberCount),
      viewCount: Number(s.viewCount),
      recordedAt: s.recordedAt.toString(),
    })),
  };
};

// Owner of a channel, used to send visitors of a linked channel to its user's profile.
export const getChannelOwnerId = async (id: string): Promise<string | null> => {
  if (!isUuid(id)) return null;
  const channel = await db.orm.public.Channel.select("ownerId").first({ id });
  return channel?.ownerId ?? null;
};

const getYoutubeChannelId = async (id: string) => {
  if (!isUuid(id)) return null;
  const channel = await db.orm.public.Channel.select("youtubeChannelId").first({ id });
  return channel?.youtubeChannelId ?? null;
};

export const getChannelVideos = async ({
  channelId,
  kind,
  pageToken,
}: {
  channelId: string;
  kind: ChannelVideoKind;
  pageToken?: string | null;
}): Promise<IChannelVideoPage> => {
  if (!VIDEO_KINDS.includes(kind)) throw new Error("Invalid video kind");
  const youtubeChannelId = await getYoutubeChannelId(channelId);
  if (!youtubeChannelId) return { items: [], nextPageToken: null };

  return fetchPlaylistPage(uploadsPlaylistId(youtubeChannelId, kind), {
    pageToken,
    revalidate: VIDEOS_REVALIDATE_SECONDS,
  });
};

export const getChannelLiveNow = async (channelId: string): Promise<IChannelLiveNow | null> => {
  const youtubeChannelId = await getYoutubeChannelId(channelId);
  if (!youtubeChannelId) return null;
  return fetchCurrentLive(youtubeChannelId, { revalidate: LIVE_REVALIDATE_SECONDS });
};

// Favourites

const FAVORITES_DISABLED_ERROR = "Tính năng yêu thích tạm thời bị tắt";

export const getFavoriteStatus = async (channelId: string): Promise<boolean> => {
  if (!FEATURES.favorites) return false;
  const session = await getSession();
  if (!session?.id || !isUuid(channelId)) return false;
  const favorite = await db.orm.public.FavoriteChannel.select("id").first({ userId: session.id, channelId });
  return Boolean(favorite);
};

// Returns the new state: true when the channel is now a favourite.
export const toggleFavorite = async (channelId: string): Promise<boolean> => {
  if (!FEATURES.favorites) throw new Error(FAVORITES_DISABLED_ERROR);
  const session = await getSession();
  if (!session?.id) throw new Error("Bạn cần đăng nhập để thêm Vtuber yêu thích");
  if (!isUuid(channelId)) throw new Error("Channel không hợp lệ");

  const userId = session.id;
  const existing = await db.orm.public.FavoriteChannel.select("id").first({ userId, channelId });
  if (existing) {
    await db.orm.public.FavoriteChannel.where({ id: existing.id }).delete();
    return false;
  }

  const channel = await db.orm.public.Channel.select("id").first({ id: channelId });
  if (!channel) throw new Error("Không tìm thấy channel");
  await db.orm.public.FavoriteChannel.create({ userId, channelId });
  return true;
};

export const getMyFavoriteChannels = async (): Promise<IChannelListItem[]> => {
  if (!FEATURES.favorites) return [];
  const session = await getSession();
  if (!session?.id) return [];

  const favorites = await db.orm.public.FavoriteChannel.select("id", "createdAt")
    .where({ userId: session.id })
    .include("channel", (channel) => channel.select(...listFields))
    .orderBy((f) => f.createdAt.desc())
    .all();

  return favorites.flatMap((favorite) => (favorite.channel ? [toListItem(favorite.channel)] : []));
};
