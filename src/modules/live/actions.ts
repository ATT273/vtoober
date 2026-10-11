"use server";
import { IHolodexPaginated, IHolodexVideo, ILiveStream, ILiveStreamPage, ILiveStreamParams } from "./types/live.types";

// Holodex caps /live at 50 items per request.
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 25;
// Share one Holodex response across all visitors for this long (seconds).
const REVALIDATE_SECONDS = 60;

const toLiveStream = (video: IHolodexVideo): ILiveStream => ({
  videoId: video.id,
  title: video.title,
  status: video.status,
  topic: video.topic_id ?? null,
  scheduledAt: video.start_scheduled ?? null,
  startedAt: video.start_actual ?? null,
  viewers: video.live_viewers ?? null,
  channel: {
    youtubeChannelId: video.channel.id,
    name: video.channel.name,
    // Holodex sometimes pads names with whitespace.
    englishName: video.channel.english_name?.trim() || null,
    photoUrl: video.channel.photo ?? null,
    org: video.channel.org ?? null,
  },
});

// Public data: callable without a session. Runs on the server so HOLODEX_API_KEY never reaches the browser.
export const getLiveStreams = async ({
  status = "live",
  type = "stream",
  org,
  channelId,
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
}: ILiveStreamParams = {}): Promise<ILiveStreamPage> => {
  const baseUrl = process.env.HOLODEX_API_URL;
  const apiKey = process.env.HOLODEX_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("HOLODEX_API_URL or HOLODEX_API_KEY is not set");

  const url = new URL(`${baseUrl}/live`);
  url.searchParams.set("status", status === "upcoming" ? "upcoming" : "live");
  url.searchParams.set("type", type ?? "stream");
  url.searchParams.set("limit", String(Math.min(Math.max(1, Math.floor(limit)), MAX_PAGE_SIZE)));
  url.searchParams.set("offset", String(Math.max(0, Math.floor(offset))));
  url.searchParams.set("paginated", "true");
  if (org) url.searchParams.set("org", org);
  if (channelId) url.searchParams.set("channel_id", channelId);

  const response = await fetch(url, {
    headers: { "X-APIKEY": apiKey },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Holodex API ${response.status}: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as IHolodexPaginated<IHolodexVideo>;
  return {
    items: json.items.map(toLiveStream),
    total: Number(json.total),
  };
};
