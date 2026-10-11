const YOUTUBE_CHANNELS_ENDPOINT = "https://www.googleapis.com/youtube/v3/channels";

// channels.list accepts at most 50 ids per request (1 quota unit per call).
export const YOUTUBE_MAX_IDS_PER_REQUEST = 50;

interface YoutubeThumbnail {
  url: string;
}

interface YoutubeChannelResource {
  id: string;
  snippet?: {
    title: string;
    description: string;
    thumbnails?: {
      default?: YoutubeThumbnail;
      medium?: YoutubeThumbnail;
      high?: YoutubeThumbnail;
    };
  };
  statistics?: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount: boolean;
    videoCount?: string;
  };
}

export interface YoutubeChannelStats {
  youtubeChannelId: string;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  // null when the channel hides its subscriber count.
  subscriberCount: bigint | null;
  viewCount: bigint;
  videoCount: bigint;
}

export const fetchYoutubeChannels = async (ids: string[]): Promise<YoutubeChannelStats[]> => {
  if (ids.length === 0) return [];
  if (ids.length > YOUTUBE_MAX_IDS_PER_REQUEST) {
    throw new Error(`fetchYoutubeChannels accepts at most ${YOUTUBE_MAX_IDS_PER_REQUEST} ids`);
  }

  const apiKey = process.env.YOUTUBE_API_DATA_API;
  if (!apiKey) throw new Error("YOUTUBE_API_DATA_API is not set");

  const url = new URL(YOUTUBE_CHANNELS_ENDPOINT);
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("maxResults", String(YOUTUBE_MAX_IDS_PER_REQUEST));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${response.status}: ${body.slice(0, 500)}`);
  }

  const json = (await response.json()) as { items?: YoutubeChannelResource[] };

  return (json.items ?? []).map((item) => {
    const thumbnails = item.snippet?.thumbnails;
    const stats = item.statistics;
    return {
      youtubeChannelId: item.id,
      name: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      thumbnailUrl: thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url ?? null,
      subscriberCount:
        stats?.hiddenSubscriberCount || stats?.subscriberCount === undefined ? null : BigInt(stats.subscriberCount),
      viewCount: BigInt(stats?.viewCount ?? "0"),
      videoCount: BigInt(stats?.videoCount ?? "0"),
    };
  });
};
