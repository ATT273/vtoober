import React from "react";
import {
  BadgeCheckIcon,
  CrownIcon,
  PinIcon,
  StarIcon,
  WrenchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  IChatBackground,
  ICustomChatSettings,
} from "../../types/customChat.types";
import {
  AVATAR_GAP,
  BACKGROUND_RADIUS,
  BUBBLE_RADIUS,
  type BubbleTailDirection,
  CORNER_BADGE_OFFSET,
  getAvatarSize,
  getBubbleTailSize,
  hexToRgba,
  INLINE_LINE_HEIGHT,
  PADDING_SIZES,
  paddingValue,
  TOP_LINE_HEIGHT,
} from "../../utils/customChatCss";

type PreviewBadge = "verified" | "moderator" | "member";

interface IPreviewMessage {
  author: string;
  time: string;
  message: string;
  badge?: PreviewBadge;
  /** Leaderboard rank shown before the author */
  rank?: number;
}

const PINNED_MESSAGE: IPreviewMessage = {
  author: "StreamerChannel",
  time: "8:00 PM",
  message: "Lịch stream: 8PM thứ 2, 4, 6 hằng tuần 📌",
  badge: "verified",
};

const PREVIEW_MESSAGES: IPreviewMessage[] = [
  {
    author: "StreamerChannel",
    time: "8:01 PM",
    message: "Sắp có giveaway đó, chú ý theo dõi nha 🎁",
    badge: "verified",
  },
  {
    author: "Fan",
    time: "8:02 PM",
    message: "This custom chat looks great 🔥",
  },
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
    message:
      "Mình xem stream từ đầu tới giờ luôn á, hôm nay vui quá trời. Cảm ơn streamer nhiều nha, chúc kênh ngày càng phát triển 💖",
    badge: "member",
    rank: 3,
  },
];

const BADGE_ICONS: Record<PreviewBadge, React.ReactNode> = {
  verified: <BadgeCheckIcon className="size-[1em] text-gray-500" />,
  moderator: <WrenchIcon className="size-[1em] text-[#5e84f1]" />,
  member: <StarIcon className="size-[1em] fill-[#2ba640] text-[#2ba640]" />,
};

const backgroundStyle = (
  background: IChatBackground,
  radius = BACKGROUND_RADIUS,
): React.CSSProperties =>
  background.enabled
    ? {
        backgroundColor: hexToRgba(background.color, background.opacity),
        padding: paddingValue(background.padding),
        borderRadius: radius,
      }
    : {};

/** Mirrors the `::before` tail drawn by the generated CSS */
const BubbleTail = ({
  direction,
  size,
  color,
}: {
  direction: BubbleTailDirection;
  size: number;
  color: string;
}) => (
  <span
    aria-hidden
    className="absolute size-0 border-solid"
    style={
      direction === "up"
        ? {
            left: 0,
            bottom: "100%",
            borderWidth: `0 ${size}px ${size}px 0`,
            borderColor: `transparent transparent ${color} transparent`,
          }
        : {
            top: 0,
            right: "100%",
            borderWidth: `${size}px 0 0 ${size}px`,
            borderColor: `${color} transparent transparent transparent`,
          }
    }
  />
);

interface ICustomChatPreviewProps {
  settings: ICustomChatSettings;
}

const CustomChatPreview = ({ settings }: ICustomChatPreviewProps) => {
  const isTop = settings.authorPosition === "top";
  const isCornerBadge = settings.badgePosition === "message-corner";
  const isAvatarGrouped =
    settings.grouping === "avatar-author" && settings.showAvatar;
  const isMessageGrouped = settings.grouping === "author-message";
  const isBubble = settings.messageStyle === "bubble";

  const lineHeight = isTop ? TOP_LINE_HEIGHT : INLINE_LINE_HEIGHT;
  const radius = isBubble ? BUBBLE_RADIUS : BACKGROUND_RADIUS;
  const tailSize = getBubbleTailSize(settings.fontSize);
  const hasTail = isBubble && settings.messageBackground.enabled;
  const tailColor = hexToRgba(
    settings.messageBackground.color,
    settings.messageBackground.opacity,
  );
  const avatarSize = getAvatarSize(settings.fontSize, lineHeight);
  // Height of the author chip, so a floated rank badge stays centered on the author's line
  const authorLineHeight =
    Math.round(settings.fontSize * lineHeight) +
    (settings.authorBackground.enabled
      ? PADDING_SIZES[settings.authorBackground.padding].y * 2
      : 0);

  const cornerOffset = isCornerBadge ? CORNER_BADGE_OFFSET : 0;
  const contentTail = isMessageGrouped && hasTail ? tailSize : 0;
  const messageTail = !isMessageGrouped && hasTail;

  const tailCorner: React.CSSProperties = { borderTopLeftRadius: 0 };

  const authorBg = settings.authorBackground;
  const authorPadding = PADDING_SIZES[authorBg.padding];
  const chipStyle: React.CSSProperties = isAvatarGrouped
    ? authorBg.enabled
      ? {
          backgroundColor: hexToRgba(authorBg.color, authorBg.opacity),
          padding: `${authorPadding.y}px ${authorPadding.x}px ${authorPadding.y}px ${authorPadding.y}px`,
          borderRadius: BACKGROUND_RADIUS + authorPadding.y,
        }
      : {}
    : {};

  const renderMessage = (item: IPreviewMessage) => (
    <div
      key={item.author}
      className="flex items-start gap-2"
      style={{ fontSize: settings.fontSize }}
    >
      {settings.showAvatar && !isAvatarGrouped && (
        <div className="size-6 shrink-0 rounded-full bg-gray-400" />
      )}
      <div
        className={cn(
          "box-border",
          isTop ? "block" : "flex items-baseline",
          (isCornerBadge || contentTail > 0) && "relative",
          (isCornerBadge || isMessageGrouped) && "w-fit",
        )}
        style={{
          lineHeight,
          margin: `0 ${cornerOffset}px ${cornerOffset}px ${contentTail}px`,
          ...((isCornerBadge || isMessageGrouped) && {
            maxWidth: `calc(100% - ${cornerOffset + contentTail}px)`,
          }),
          ...(isMessageGrouped &&
            backgroundStyle(settings.messageBackground, radius)),
          ...(contentTail > 0 && tailCorner),
        }}
      >
        {contentTail > 0 && (
          <BubbleTail direction="left" size={tailSize} color={tailColor} />
        )}
        {settings.showTimestamp && (
          <span className="mr-2 shrink-0 text-[0.75em] text-gray-500">
            {item.time}
          </span>
        )}
        {settings.showRankBadge && item.rank && (
          <span
            className={cn(
              "mr-1 inline-flex shrink-0 items-center leading-none",
              isTop ? "float-left" : "self-center",
            )}
            style={isTop ? { height: authorLineHeight } : undefined}
          >
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#dd98ff] px-1.5 py-0.5 text-xs font-medium text-black">
              <CrownIcon className="size-3 fill-current" />#{item.rank}
            </span>
          </span>
        )}
        <span
          className={cn(
            "items-center",
            isTop ? "flex w-fit" : "inline-flex shrink-0",
          )}
          style={{
            ...(isTop
              ? { marginBottom: settings.authorMessageGap }
              : { marginRight: settings.authorMessageGap }),
            ...chipStyle,
          }}
        >
          {isAvatarGrouped && (
            <span
              className="shrink-0 rounded-full bg-gray-400"
              style={{
                width: avatarSize,
                height: avatarSize,
                marginRight: AVATAR_GAP,
              }}
            />
          )}
          <span
            className="font-bold"
            style={{
              color: settings.authorColor,
              ...(!isAvatarGrouped &&
                backgroundStyle(settings.authorBackground)),
            }}
          >
            {item.author}
          </span>
          {item.badge && (
            <span
              className={cn(
                "inline-flex items-center leading-none",
                isCornerBadge
                  ? "absolute right-0 bottom-0 translate-x-2/5 translate-y-2/5"
                  : "ml-1",
              )}
            >
              {BADGE_ICONS[item.badge]}
            </span>
          )}
        </span>
        <span
          className={cn(
            "box-decoration-clone",
            isTop
              ? "inline-block max-w-full"
              : "block min-w-0 flex-[0_1_auto] wrap-anywhere",
            messageTail && "relative",
          )}
          style={{
            color: settings.messageColor,
            ...(!isMessageGrouped &&
              backgroundStyle(settings.messageBackground, radius)),
            ...(messageTail && {
              ...tailCorner,
              ...(isTop ? { marginTop: tailSize } : { marginLeft: tailSize }),
            }),
          }}
        >
          {messageTail && (
            <BubbleTail
              direction={isTop ? "up" : "left"}
              size={tailSize}
              color={tailColor}
            />
          )}
          {item.message}
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{ gap: settings.messageSpacing }}
      className="flex flex-col rounded-lg bg-[repeating-conic-gradient(#e5e7eb_0_25%,#f9fafb_0_50%)] bg-size-[20px_20px] p-3"
    >
      {PREVIEW_MESSAGES.map(renderMessage)}
      {settings.showPinnedMessage && (
        <div
          className="flex flex-col gap-1"
          style={backgroundStyle(settings.pinnedBackground)}
        >
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <PinIcon className="size-3" />
            Được ghim bởi {PINNED_MESSAGE.author}
          </span>
          {renderMessage(PINNED_MESSAGE)}
        </div>
      )}
    </div>
  );
};

export default CustomChatPreview;
