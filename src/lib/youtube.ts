// Server-only YouTube Data API helpers (the API key must never reach the browser).

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

type FetchOptions = { revalidate?: number };

const youtubeFetch = async <T>(path: string, params: Record<string, string>, { revalidate }: FetchOptions = {}) => {
  const apiKey = process.env.YOUTUBE_API_DATA_API;
  if (!apiKey) throw new Error("YOUTUBE_API_DATA_API is not set");

  const url = new URL(`${YOUTUBE_API}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, revalidate === undefined ? { cache: "no-store" } : { next: { revalidate } });
  // A channel without shorts/streams has no such playlist: YouTube answers 404.
  if (response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${response.status}: ${body.slice(0, 300)}`);
  }
  return (await response.json()) as T;
};

interface YoutubeThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
}

const CHANNEL_ID_PATTERN = /^UC[\w-]{22}$/;

// Accepts a channel URL (/channel/UC…, /@handle), a bare @handle or a UC… id.
export const parseChannelInput = (input: string): { id: string } | { handle: string } | null => {
  const value = input.trim();
  if (CHANNEL_ID_PATTERN.test(value)) return { id: value };
  if (/^@[\w.-]{3,30}$/.test(value)) return { handle: value };

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;

  const [first, second] = url.pathname.split("/").filter(Boolean);
  if (first === "channel" && second && CHANNEL_ID_PATTERN.test(second)) return { id: second };
  if (first?.startsWith("@")) return { handle: decodeURIComponent(first) };
  return null;
};

export interface YoutubeChannelInfo {
  youtubeChannelId: string;
  name: string;
  description: string;
  customUrl: string | null;
  thumbnailUrl: string | null;
  subscriberCount: bigint;
  viewCount: bigint;
  videoCount: bigint;
}

interface YoutubeChannelsResponse {
  items?: {
    id: string;
    snippet: { title: string; description: string; customUrl?: string; thumbnails?: YoutubeThumbnails };
    statistics?: { subscriberCount?: string; viewCount?: string; videoCount?: string };
  }[];
}

// Always fresh: used to verify the claim code the user just put in the description.
export const fetchYoutubeChannel = async (
  ref: { id: string } | { handle: string },
): Promise<YoutubeChannelInfo | null> => {
  const json = await youtubeFetch<YoutubeChannelsResponse>("channels", {
    part: "snippet,statistics",
    ...("id" in ref ? { id: ref.id } : { forHandle: ref.handle }),
  });
  const item = json?.items?.[0];
  if (!item) return null;

  const thumbnails = item.snippet.thumbnails;
  return {
    youtubeChannelId: item.id,
    name: item.snippet.title,
    description: item.snippet.description,
    customUrl: item.snippet.customUrl ?? null,
    thumbnailUrl: thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url ?? null,
    subscriberCount: BigInt(item.statistics?.subscriberCount ?? "0"),
    viewCount: BigInt(item.statistics?.viewCount ?? "0"),
    videoCount: BigInt(item.statistics?.videoCount ?? "0"),
  };
};

// Auto-generated upload playlists: UULF = long videos, UUSH = shorts, UULV = live streams.
export const YOUTUBE_PLAYLIST_PREFIX = { videos: "UULF", shorts: "UUSH", streams: "UULV" } as const;

export const uploadsPlaylistId = (youtubeChannelId: string, kind: keyof typeof YOUTUBE_PLAYLIST_PREFIX) =>
  `${YOUTUBE_PLAYLIST_PREFIX[kind]}${youtubeChannelId.slice(2)}`;

export interface YoutubePlaylistPage {
  items: { videoId: string; title: string; thumbnailUrl: string | null; publishedAt: string | null }[];
  nextPageToken: string | null;
}

interface YoutubePlaylistItemsResponse {
  nextPageToken?: string;
  items?: {
    snippet: { title: string; thumbnails?: YoutubeThumbnails };
    contentDetails: { videoId: string; videoPublishedAt?: string };
  }[];
}

export const fetchPlaylistPage = async (
  playlistId: string,
  { pageToken, maxResults = 24, revalidate }: { pageToken?: string | null; maxResults?: number } & FetchOptions,
): Promise<YoutubePlaylistPage> => {
  const json = await youtubeFetch<YoutubePlaylistItemsResponse>(
    "playlistItems",
    {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: String(maxResults),
      ...(pageToken && { pageToken }),
    },
    { revalidate },
  );
  if (!json) return { items: [], nextPageToken: null };

  return {
    items: (json.items ?? [])
      // Private/deleted videos stay in the playlist with a placeholder title.
      .filter((item) => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
      .map((item) => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? null,
        publishedAt: item.contentDetails.videoPublishedAt ?? null,
      })),
    nextPageToken: json.nextPageToken ?? null,
  };
};

export interface YoutubeLiveVideo {
  videoId: string;
  title: string;
  viewers: number | null;
  startedAt: string | null;
}

interface YoutubeVideosResponse {
  items?: {
    id: string;
    snippet: { title: string; liveBroadcastContent: "live" | "upcoming" | "none" };
    liveStreamingDetails?: { actualStartTime?: string; concurrentViewers?: string };
  }[];
}

// Checks the newest entries of the live-streams playlist; a running stream is always among them.
export const fetchCurrentLive = async (
  youtubeChannelId: string,
  { revalidate }: FetchOptions = {},
): Promise<YoutubeLiveVideo | null> => {
  const recent = await fetchPlaylistPage(uploadsPlaylistId(youtubeChannelId, "streams"), {
    maxResults: 5,
    revalidate,
  });
  if (recent.items.length === 0) return null;

  const json = await youtubeFetch<YoutubeVideosResponse>(
    "videos",
    { part: "snippet,liveStreamingDetails", id: recent.items.map((item) => item.videoId).join(",") },
    { revalidate },
  );
  const live = json?.items?.find((item) => item.snippet.liveBroadcastContent === "live");
  if (!live) return null;

  return {
    videoId: live.id,
    title: live.snippet.title,
    viewers: live.liveStreamingDetails?.concurrentViewers ? Number(live.liveStreamingDetails.concurrentViewers) : null,
    startedAt: live.liveStreamingDetails?.actualStartTime ?? null,
  };
};
