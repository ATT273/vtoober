import React from "react";
import { BadgeCheckIcon, StarIcon, WrenchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { IChatBackground, ICustomChatSettings } from "../../types/customChat.types";
import {
  BACKGROUND_RADIUS,
  CORNER_BADGE_OFFSET,
  hexToRgba,
  INLINE_LINE_HEIGHT,
  PADDING_SIZES,
  TOP_LINE_HEIGHT,
} from "../../utils/customChatCss";

type PreviewBadge = "verified" | "moderator" | "member";

const PREVIEW_MESSAGES: { author: string; time: string; message: string; badge?: PreviewBadge }[] = [
  { author: "StreamerChannel", time: "8:01 PM", message: "Sắp có giveaway đó, chú ý theo dõi nha 🎁", badge: "verified" },
  { author: "Fan", time: "8:02 PM", message: "This custom chat looks great 🔥" },
  {
    author: "Moderator",
    time: "8:02 PM",
    message:
      "Remember to follow the chat rules: be kind to each other, no spam, no self-promotion links, and have fun together tonight!",
    badge: "moderator",
  },
  {
    author: "MemberViewer",
    time: "8:03 PM",
    message: "Mình xem stream từ đầu tới giờ luôn á, hôm nay vui quá trời. Cảm ơn streamer nhiều nha, chúc kênh ngày càng phát triển 💖",
    badge: "member",
  },
];

const BADGE_ICONS: Record<PreviewBadge, React.ReactNode> = {
  verified: <BadgeCheckIcon className="size-[1em] text-gray-500" />,
  moderator: <WrenchIcon className="size-[1em] text-[#5e84f1]" />,
  member: <StarIcon className="size-[1em] fill-[#2ba640] text-[#2ba640]" />,
};

const backgroundStyle = (background: IChatBackground): React.CSSProperties =>
  background.enabled
    ? {
        backgroundColor: hexToRgba(background.color, background.opacity),
        padding: PADDING_SIZES[background.padding],
        borderRadius: BACKGROUND_RADIUS,
      }
    : {};

interface ICustomChatPreviewProps {
  settings: ICustomChatSettings;
}

const CustomChatPreview = ({ settings }: ICustomChatPreviewProps) => {
  const isTop = settings.authorPosition === "top";
  const isCornerBadge = settings.badgePosition === "message-corner";

  return (
    <div
      style={{ gap: settings.messageSpacing }}
      className="flex flex-col rounded-lg bg-[repeating-conic-gradient(#e5e7eb_0_25%,#f9fafb_0_50%)] bg-size-[20px_20px] p-3">
      {PREVIEW_MESSAGES.map((item) => (
        <div key={item.author} className="flex items-start gap-2" style={{ fontSize: settings.fontSize }}>
          {settings.showAvatar && <div className="mt-1 size-6 shrink-0 rounded-full bg-gray-400" />}
          <div
            className={cn("block", isCornerBadge && "relative w-fit")}
            style={{
              lineHeight: isTop ? TOP_LINE_HEIGHT : INLINE_LINE_HEIGHT,
              ...(isCornerBadge && {
                maxWidth: `calc(100% - ${CORNER_BADGE_OFFSET}px)`,
                margin: `0 ${CORNER_BADGE_OFFSET}px ${CORNER_BADGE_OFFSET}px 0`,
              }),
            }}
          >
            {settings.showTimestamp && <span className="mr-2 text-[0.75em] text-gray-500">{item.time}</span>}
            <span
              className={cn("items-center", isTop ? "flex w-fit" : "inline-flex")}
              style={isTop ? { marginBottom: settings.authorMessageGap } : { marginRight: settings.authorMessageGap }}
            >
              <span
                className="font-bold"
                style={{ color: settings.authorColor, ...backgroundStyle(settings.authorBackground) }}
              >
                {item.author}
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "inline-flex items-center leading-none",
                    isCornerBadge ? "absolute right-0 bottom-0 translate-x-2/5 translate-y-2/5" : "ml-1",
                  )}
                >
                  {BADGE_ICONS[item.badge]}
                </span>
              )}
            </span>
            <span
              className={cn("box-decoration-clone", isTop && "inline-block max-w-full")}
              style={{ color: settings.messageColor, ...backgroundStyle(settings.messageBackground) }}
            >
              {item.message}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomChatPreview;
