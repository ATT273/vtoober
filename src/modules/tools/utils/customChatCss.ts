import type { IChatBackground, ICustomChatSettings, PaddingSize } from "../types/customChat.types";

export const DEFAULT_CUSTOM_CHAT_SETTINGS: ICustomChatSettings = {
  fontSize: 16,
  authorPosition: "top",
  authorMessageGap: 0,
  messageSpacing: 8,
  badgePosition: "after-author",
  grouping: "none",
  messageStyle: "normal",
  authorColor: "#ffffff",
  authorBackground: { enabled: true, color: "#2e7d32", opacity: 100, padding: "sm" },
  messageColor: "#111111",
  messageBackground: { enabled: true, color: "#f8e1e1", opacity: 95, padding: "md" },
  showAvatar: false,
  showTimestamp: false,
  showRankBadge: true,
  showPinnedMessage: true,
  pinnedBackground: { enabled: true, color: "#ffffff", opacity: 90, padding: "md" },
  hideHeader: true,
  transparentPage: true,
};

/** Vertical (y) and horizontal (x) padding in px */
export const PADDING_SIZES: Record<PaddingSize, { y: number; x: number }> = {
  sm: { y: 2, x: 6 },
  md: { y: 4, x: 10 },
  lg: { y: 8, x: 14 },
};

export const paddingValue = (size: PaddingSize) => `${PADDING_SIZES[size].y}px ${PADDING_SIZES[size].x}px`;

export const BACKGROUND_RADIUS = 6;
export const BUBBLE_RADIUS = 14;

export const TOP_LINE_HEIGHT = 1.5;
export const INLINE_LINE_HEIGHT = 1.8;

/** Space kept around the message box so a corner badge is not clipped */
export const CORNER_BADGE_OFFSET = 8;

/** Space between the avatar and the author name when they share one background */
export const AVATAR_GAP = 4;

/** Avatar is as tall as one line of text, so it fits inside the author background */
export const getAvatarSize = (fontSize: number, lineHeight: number) => Math.round(fontSize * lineHeight);

/** Length of the speech bubble tail */
export const getBubbleTailSize = (fontSize: number) => Math.round(fontSize * 0.6);

export type BubbleTailDirection = "up" | "left";

export const hexToRgba = (hex: string, opacity: number) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const backgroundDeclarations = (background: IChatBackground, radius = BACKGROUND_RADIUS) =>
  background.enabled
    ? `  background-color: ${hexToRgba(background.color, background.opacity)} !important;
  padding: ${paddingValue(background.padding)} !important;
  border-radius: ${radius}px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;`
    : `  background-color: transparent !important;
  padding: 0 !important;`;

const transparentDeclarations = `  background-color: transparent !important;
  padding: 0 !important;`;

/**
 * A right triangle flush with the box's top-left corner (that corner is squared off),
 * pointing up at an author above the box or left at an author/avatar beside it.
 */
const bubbleTailRule = (selector: string, direction: BubbleTailDirection, size: number, color: string) => `${selector} {
  position: relative;
  border-top-left-radius: 0 !important;
}

${selector}::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
${
  direction === "up"
    ? `  left: 0;
  bottom: 100%;
  border-width: 0 ${size}px ${size}px 0;
  border-color: transparent transparent ${color} transparent;`
    : `  top: 0;
  right: 100%;
  border-width: ${size}px 0 0 ${size}px;
  border-color: ${color} transparent transparent transparent;`
}
}`;

/** Builds CSS for the YouTube live chat popout, to paste into an OBS browser source. */
export const buildCustomChatCss = (settings: ICustomChatSettings) => {
  const isTop = settings.authorPosition === "top";
  const isCornerBadge = settings.badgePosition === "message-corner";
  const isAvatarGrouped = settings.grouping === "avatar-author" && settings.showAvatar;
  const isMessageGrouped = settings.grouping === "author-message";
  const isBubble = settings.messageStyle === "bubble";

  const lineHeight = isTop ? TOP_LINE_HEIGHT : INLINE_LINE_HEIGHT;
  const radius = isBubble ? BUBBLE_RADIUS : BACKGROUND_RADIUS;
  const tailSize = getBubbleTailSize(settings.fontSize);
  // With "author + message" the whole #content is the message box, otherwise #message is.
  const hasTail = isBubble && settings.messageBackground.enabled;
  const tailColor = hexToRgba(settings.messageBackground.color, settings.messageBackground.opacity);

  const contentMargin = [
    0,
    isCornerBadge ? CORNER_BADGE_OFFSET : 0,
    isCornerBadge ? CORNER_BADGE_OFFSET : 0,
    isMessageGrouped && hasTail ? tailSize : 0,
  ];
  const contentSideSpace = contentMargin[1] + contentMargin[3];

  const messageMargin = !isMessageGrouped && hasTail ? (isTop ? `${tailSize}px 0 0 0` : `0 0 0 ${tailSize}px`) : "0";

  // #content holds `&ZeroWidthSpace;` text nodes between the author chip and #message-container.
  // In a flex container each one becomes an anonymous item one line tall, so with the author on top
  // #content stays a block: the chip is block-level and the text nodes share the message's line.
  // On the same line #content is a flex row instead: those anonymous items are zero-width there, and
  // #message becomes one block beside the chip, so a wrapped message keeps a single background box.
  const rules = [
    `yt-live-chat-text-message-renderer {
  font-size: ${settings.fontSize}px !important;
  padding-top: ${settings.messageSpacing / 2}px !important;
  padding-bottom: ${settings.messageSpacing / 2}px !important;
}`,
    `yt-live-chat-text-message-renderer #hover-message,
yt-live-chat-text-message-renderer #deleted-state,
yt-live-chat-text-message-renderer #show-original,
yt-live-chat-text-message-renderer #menu,
yt-live-chat-text-message-renderer #inline-action-button-container {
  display: none !important;
}`,
    `yt-live-chat-text-message-renderer #content {
  display: ${isTop ? "block" : "flex"} !important;${isTop ? "" : "\n  align-items: baseline;"}
  line-height: ${lineHeight} !important;
  margin: ${contentMargin.map((v) => `${v}px`).join(" ")} !important;${
    isMessageGrouped || isCornerBadge
      ? `
  width: fit-content;
  max-width: calc(100% - ${contentSideSpace}px);
  box-sizing: border-box;`
      : ""
  }${isMessageGrouped ? `\n${backgroundDeclarations(settings.messageBackground, radius)}` : ""}
}`,
    `yt-live-chat-text-message-renderer #timestamp {
  flex-shrink: 0;
}`,
    `yt-live-chat-text-message-renderer yt-live-chat-author-chip {
  display: ${isTop ? "flex" : "inline-flex"} !important;${isTop ? "\n  width: fit-content;" : "\n  flex-shrink: 0;"}
  align-items: center;
  margin: ${isTop ? `0 0 ${settings.authorMessageGap}px 0` : `0 ${settings.authorMessageGap}px 0 0`} !important;
  line-height: inherit !important;
${isAvatarGrouped ? avatarChipDeclarations(settings, lineHeight) : "  padding: 0 !important;"}
}`,
    `yt-live-chat-text-message-renderer #author-name {
  color: ${settings.authorColor} !important;
  font-size: ${settings.fontSize}px !important;
  font-weight: 700;
  margin: 0 !important;
  line-height: inherit !important;
${isAvatarGrouped ? transparentDeclarations : backgroundDeclarations(settings.authorBackground)}
}`,
    `yt-live-chat-text-message-renderer #message {
  color: ${settings.messageColor} !important;
  font-size: ${settings.fontSize}px !important;
  margin: ${messageMargin} !important;
  line-height: inherit !important;${
    isTop
      ? `
  display: inline-block !important;
  max-width: 100%;`
      : `
  display: block !important;
  flex: 0 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;`
  }
${isMessageGrouped ? transparentDeclarations : backgroundDeclarations(settings.messageBackground, radius)}
}`,
    `yt-live-chat-text-message-renderer #chat-badges {
  display: inline-flex !important;
  align-items: center;
  line-height: 0 !important;
}`,
    isCornerBadge
      ? `yt-live-chat-text-message-renderer #content {
  position: relative;
}

yt-live-chat-text-message-renderer yt-live-chat-author-chip {
  position: static !important;
}

yt-live-chat-text-message-renderer #chat-badges {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(40%, 40%);
  margin: 0 !important;
}`
      : `yt-live-chat-text-message-renderer #chat-badges {
  margin-left: 4px !important;
}`,
  ];

  if (hasTail) {
    rules.push(
      bubbleTailRule(
        `yt-live-chat-text-message-renderer ${isMessageGrouped ? "#content" : "#message"}`,
        !isMessageGrouped && isTop ? "up" : "left",
        tailSize,
        tailColor,
      ),
    );
  }

  if (!settings.showAvatar) {
    rules.push(`yt-live-chat-text-message-renderer #author-photo {
  display: none !important;
}`);
  } else if (isAvatarGrouped) {
    // The avatar stays a flex item of the renderer but takes no width (negative right margin),
    // so it overlaps the start of the author chip, whose left padding leaves room for it.
    const avatarSize = getAvatarSize(settings.fontSize, lineHeight);
    const inset = settings.authorBackground.enabled ? PADDING_SIZES[settings.authorBackground.padding].y : 0;
    rules.push(`yt-live-chat-text-message-renderer #author-photo {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  align-self: flex-start;
  width: ${avatarSize}px !important;
  height: ${avatarSize}px !important;
  margin: ${inset}px ${-(avatarSize + inset)}px 0 ${inset}px !important;
}

yt-live-chat-text-message-renderer #author-photo img {
  width: 100% !important;
  height: 100% !important;
}`);
  }

  if (settings.showRankBadge) {
    const authorPaddingY = settings.authorBackground.enabled ? PADDING_SIZES[settings.authorBackground.padding].y : 0;
    const authorLineHeight = Math.round(settings.fontSize * lineHeight) + authorPaddingY * 2;
    // Leaderboard rank (crown + "#3") sits right before the author chip. With the author on top the
    // chip is block-level, so the badge floats left to stay on the author's line.
    rules.push(`yt-live-chat-text-message-renderer #before-content-buttons {
  display: inline-flex !important;
  align-items: center;
  flex-shrink: 0;
  margin: 0 4px 0 0 !important;
  line-height: 0 !important;
  pointer-events: none;${isTop ? `\n  float: left;\n  height: ${authorLineHeight}px;` : "\n  align-self: center;"}
}

yt-live-chat-text-message-renderer #before-content-buttons yt-touch-feedback-shape {
  display: none !important;
}`);
  } else {
    rules.push(`yt-live-chat-text-message-renderer #before-content-buttons {
  display: none !important;
}`);
  }

  if (!settings.showTimestamp) {
    rules.push(`yt-live-chat-text-message-renderer #timestamp {
  display: none !important;
}`);
  }

  if (!settings.showPinnedMessage) {
    rules.push(`yt-live-chat-banner-manager {
  display: none !important;
}`);
  } else {
    // The pinned message is a text message renderer inside the banner, so it keeps the styles above;
    // only the banner card around it gets its own background (or none).
    rules.push(`yt-live-chat-banner-renderer {
${backgroundDeclarations(settings.pinnedBackground)}
  box-shadow: none !important;
}

yt-live-chat-banner-renderer #header,
yt-live-chat-banner-renderer #contents,
yt-live-chat-banner-renderer yt-live-chat-text-message-renderer {
  background-color: transparent !important;
}`);
  }

  if (settings.hideHeader) {
    rules.push(`yt-live-chat-header-renderer,
yt-live-chat-message-input-renderer,
yt-live-chat-ticker-renderer {
  display: none !important;
}`);
  }

  if (settings.transparentPage) {
    rules.push(`html, body, yt-live-chat-app, yt-live-chat-renderer,
yt-live-chat-item-list-renderer, #item-scroller, #items {
  background-color: transparent !important;
}`);
  }

  return rules.join("\n\n");
};

/** Author background moves from the name to the whole chip, with room on the left for the avatar */
const avatarChipDeclarations = (settings: ICustomChatSettings, lineHeight: number) => {
  const avatarSize = getAvatarSize(settings.fontSize, lineHeight);
  const background = settings.authorBackground;
  if (!background.enabled) {
    return `  padding: 0 0 0 ${avatarSize + AVATAR_GAP}px !important;`;
  }
  const { y, x } = PADDING_SIZES[background.padding];
  return `  background-color: ${hexToRgba(background.color, background.opacity)} !important;
  padding: ${y}px ${x}px ${y}px ${y + avatarSize + AVATAR_GAP}px !important;
  border-radius: ${BACKGROUND_RADIUS + y}px;`;
};
