"use server";
import { db } from "@/prisma/db";
import {
  IChannelCursor,
  IChannelRankingItem,
  IChannelRankingPage,
} from "./types/channel.types";

// Channel data is public: these actions are callable without a session.

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const rankingFields = [
  "id",
  "name",
  "thumbnailUrl",
  "url",
  "subscriberCount",
  "viewCount",
  "videoCount",
  "isVerified",
] as const;

export const getChannelRanking = async ({
  cursor,
  limit = DEFAULT_PAGE_SIZE,
}: {
  cursor?: IChannelCursor | null;
  limit?: number;
}): Promise<IChannelRankingPage> => {
  const pageSize = Math.min(Math.max(1, Math.floor(limit)), MAX_PAGE_SIZE);

  // id is the tie-breaker so channels with equal subscriber counts page deterministically.
  let query = db.orm.public.Channel.select(...rankingFields).orderBy([
    (c) => c.subscriberCount.desc(),
    (c) => c.id.desc(),
  ]);
  if (cursor) {
    query = query.cursor({ subscriberCount: BigInt(cursor.subscriberCount), id: cursor.id });
  }

  // Fetch one extra row to know whether another page exists.
  const rows = await query.limit(pageSize + 1).all();
  const hasMore = rows.length > pageSize;
  const pageRows = hasMore ? rows.slice(0, pageSize) : rows;

  const items: IChannelRankingItem[] = pageRows.map((row) => ({
    id: row.id,
    name: row.name,
    thumbnailUrl: row.thumbnailUrl,
    url: row.url,
    subscriberCount: Number(row.subscriberCount),
    viewCount: Number(row.viewCount),
    videoCount: Number(row.videoCount),
    isVerified: row.isVerified,
  }));

  const last = pageRows[pageRows.length - 1];
  return {
    items,
    nextCursor: hasMore && last ? { subscriberCount: String(last.subscriberCount), id: last.id } : null,
  };
};
