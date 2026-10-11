"use client";
import { EyeIcon, MoonIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatCompact } from "@/modules/home/utils/format";
import { useChannelLiveNow } from "../../hooks/useChannelLiveNow";
import { youtubeEmbedUrl, youtubeVideoUrl } from "../../utils/video";

const ChannelLiveSection = ({ channelId }: { channelId: string }) => {
  const { data: live, isPending, isError } = useChannelLiveNow(channelId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {live && <span className="size-2.5 animate-pulse rounded-full bg-red-600" />}
          Đang live
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Không kiểm tra được trạng thái live.</p>
        ) : live ? (
          <div className="flex flex-col gap-3">
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={youtubeEmbedUrl(live.videoId)}
                title={live.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="size-full"
              />
            </div>
            <div className="flex items-start justify-between gap-3">
              <a
                href={youtubeVideoUrl(live.videoId)}
                target="_blank"
                rel="noreferrer"
                className="line-clamp-2 font-medium hover:underline"
              >
                {live.title}
              </a>
              {live.viewers !== null && (
                <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground tabular-nums">
                  <EyeIcon className="size-4" />
                  {formatCompact(live.viewers)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <MoonIcon className="size-4" />
            Streamer đang nghỉ ngơi
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChannelLiveSection;
