import { syncChannels } from "@/modules/channel/sync/syncChannels";

// ~1000 channels = 20 YouTube requests + 1000 row updates; leave generous headroom.
export const maxDuration = 300;

// Called by Supabase pg_cron through pg_net (see supabase/cron/sync-channels.sql).
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncChannels();
  console.log("[cron] sync-channels", JSON.stringify(result));

  return Response.json(result, { status: result.failedBatches.length > 0 ? 500 : 200 });
}
