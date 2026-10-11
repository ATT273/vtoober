import { db } from "@/prisma/db";
import { fetchYoutubeChannels, YOUTUBE_MAX_IDS_PER_REQUEST } from "./youtube";

// Batches processed in parallel; each holds one DB connection while it writes.
const BATCH_CONCURRENCY = 4;

export interface SyncChannelsResult {
  total: number;
  updated: number;
  // Channels YouTube did not return (deleted, terminated, or wrong id).
  notFound: string[];
  failedBatches: { index: number; error: string }[];
  durationMs: number;
}

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
};

const runWithConcurrency = async <T>(items: T[], limit: number, worker: (item: T, index: number) => Promise<void>) => {
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await worker(items[index]!, index);
    }
  });
  await Promise.all(runners);
};

type ChannelRef = { id: string; youtubeChannelId: string };

const syncBatch = async (channels: ChannelRef[]) => {
  const stats = await fetchYoutubeChannels(channels.map((c) => c.youtubeChannelId));
  const statsById = new Map(stats.map((s) => [s.youtubeChannelId, s]));
  const syncedAt = Temporal.Now.instant();

  const found = channels.flatMap((channel) => {
    const stat = statsById.get(channel.youtubeChannelId);
    return stat ? [{ channel, stat }] : [];
  });
  const notFound = channels.filter((c) => !statsById.has(c.youtubeChannelId)).map((c) => c.youtubeChannelId);

  if (found.length > 0) {
    // One transaction per batch: the channel rows and their snapshots land together.
    await db.transaction(async (tx) => {
      for (const { channel, stat } of found) {
        await tx.orm.public.Channel.where({ id: channel.id }).update({
          name: stat.name,
          description: stat.description,
          viewCount: stat.viewCount,
          videoCount: stat.videoCount,
          lastSyncedAt: syncedAt,
          // Keep the previous value when the channel hides its subscriber count.
          ...(stat.subscriberCount !== null && { subscriberCount: stat.subscriberCount }),
          ...(stat.thumbnailUrl && { thumbnailUrl: stat.thumbnailUrl }),
        });
      }

      const snapshots = found
        .filter(({ stat }) => stat.subscriberCount !== null)
        .map(({ channel, stat }) => ({
          channelId: channel.id,
          subscriberCount: stat.subscriberCount!,
          viewCount: stat.viewCount,
        }));
      if (snapshots.length > 0) {
        await tx.orm.public.ChannelSnapshot.createAndCount(snapshots);
      }
    });
  }

  return { updated: found.length, notFound };
};

export const syncChannels = async (): Promise<SyncChannelsResult> => {
  const startedAt = Date.now();
  const channels = await db.orm.public.Channel.select("id", "youtubeChannelId").all();
  const batches = chunk(channels, YOUTUBE_MAX_IDS_PER_REQUEST);

  const result: SyncChannelsResult = {
    total: channels.length,
    updated: 0,
    notFound: [],
    failedBatches: [],
    durationMs: 0,
  };

  // A failing batch (API error, DB error) is recorded and the rest keep going.
  await runWithConcurrency(batches, BATCH_CONCURRENCY, async (batch, index) => {
    try {
      const { updated, notFound } = await syncBatch(batch);
      result.updated += updated;
      result.notFound.push(...notFound);
    } catch (error) {
      result.failedBatches.push({ index, error: error instanceof Error ? error.message : String(error) });
    }
  });

  result.durationMs = Date.now() - startedAt;
  return result;
};
