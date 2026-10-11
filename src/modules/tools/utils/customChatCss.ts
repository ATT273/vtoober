import type { IChatBackground, ICustomChatSettings, PaddingSize } from "../types/customChat.types";

export const DEFAULT_CUSTOM_CHAT_SETTINGS: ICustomChatSettings = {
  fontSize: 16,
  authorPosition: "top",
  authorMessageGap: 0,
  messageSpacing: 8,
  badgePosition: "after-author",
  authorColor: "#ffffff",
  authorBackground: { enabled: true, color: "#2e7d32", opacity: 100, padding: "sm" },
  messageColor: "#111111",
  messageBackground: { enabled: true, color: "#f8e1e1", opacity: 95, padding: "md" },
  showAvatar: false,
  showTimestamp: false,
  hideHeader: true,
  transparentPage: true,
};

export const PADDING_SIZES: Record<PaddingSize, string> = {
  sm: "2px 6px",
  md: "4px 10px",
  lg: "8px 14px",
};

export const BACKGROUND_RADIUS = 6;

export const TOP_LINE_HEIGHT = 1.5;
export const INLINE_LINE_HEIGHT = 1.8;

/** Space kept around the message box so a corner badge is not clipped */
export const CORNER_BADGE_OFFSET = 8;

export const hexToRgba = (hex: string, opacity: number) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const backgroundDeclarations = (background: IChatBackground) =>
  background.enabled
    ? `  background-color: ${hexToRgba(background.color, background.opacity)} !important;
  padding: ${PADDING_SIZES[background.padding]} !important;
  border-radius: ${BACKGROUND_RADIUS}px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;`
    : `  background-color: transparent !important;
  padding: 0 !important;`;

/** Builds CSS for the YouTube live chat popout, to paste into an OBS browser source. */
export const buildCustomChatCss = (settings: ICustomChatSettings) => {
  const isTop = settings.authorPosition === "top";
  const isCornerBadge = settings.badgePosition === "message-corner";

  const lineHeight = isTop ? TOP_LINE_HEIGHT : INLINE_LINE_HEIGHT;

  // #content holds `&ZeroWidthSpace;` text nodes between the author chip and #message-container.
  // In a flex container each one becomes an anonymous item one line tall, so #content stays a block:
  // the chip is block-level when the author sits on top, and the text nodes share the message's line.
  const rules = [
    `yt-live-chat-text-message-renderer {
  font-size: ${settings.fontSize}px !important;
  padding-top: ${settings.messageSpacing / 2}px !important;
  padding-bottom: ${settings.messageSpacing / 2}px !important;
}`,
    `yt-live-chat-text-message-renderer #before-content-buttons,
yt-live-chat-text-message-renderer #hover-message,
yt-live-chat-text-message-renderer #deleted-state,
yt-live-chat-text-message-renderer #show-original,
yt-live-chat-text-message-renderer #menu,
yt-live-chat-text-message-renderer #inline-action-button-container {
  display: none !important;
}`,
    `yt-live-chat-text-message-renderer #content {
  display: block !important;
  line-height: ${lineHeight} !important;
}`,
    isTop
      ? `yt-live-chat-text-message-renderer yt-live-chat-author-chip {
  display: flex !important;
  width: fit-content;
  align-items: center;
  margin: 0 0 ${settings.authorMessageGap}px 0 !important;
  padding: 0 !important;
  line-height: inherit !important;
}`
      : `yt-live-chat-text-message-renderer yt-live-chat-author-chip {
  display: inline-flex !important;
  align-items: center;
  margin: 0 ${settings.authorMessageGap}px 0 0 !important;
  padding: 0 !important;
  line-height: inherit !important;
}`,
    `yt-live-chat-text-message-renderer #author-name {
  color: ${settings.authorColor} !important;
  font-size: ${settings.fontSize}px !important;
  font-weight: 700;
  margin: 0 !important;
  line-height: inherit !important;
${backgroundDeclarations(settings.authorBackground)}
}`,
    `yt-live-chat-text-message-renderer #message {
  color: ${settings.messageColor} !important;
  font-size: ${settings.fontSize}px !important;
  margin: 0 !important;
  line-height: inherit !important;${
    isTop
      ? `
  display: inline-block !important;
  max-width: 100%;`
      : ""
  }
${backgroundDeclarations(settings.messageBackground)}
}`,
    `yt-live-chat-text-message-renderer #chat-badges {
  display: inline-flex !important;
  align-items: center;
  line-height: 0 !important;
}`,
    isCornerBadge
      ? `yt-live-chat-text-message-renderer #content {
  position: relative;
  width: fit-content;
  max-width: calc(100% - ${CORNER_BADGE_OFFSET}px);
  margin: 0 ${CORNER_BADGE_OFFSET}px ${CORNER_BADGE_OFFSET}px 0;
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

  if (!settings.showAvatar) {
    rules.push(`yt-live-chat-text-message-renderer #author-photo {
  display: none !important;
}`);
  }

  if (!settings.showTimestamp) {
    rules.push(`yt-live-chat-text-message-renderer #timestamp {
  display: none !important;
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
