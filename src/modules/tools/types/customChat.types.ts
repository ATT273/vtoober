export type AuthorPosition = "inline" | "top";

export type BadgePosition = "after-author" | "message-corner";

export type PaddingSize = "sm" | "md" | "lg";

export interface IChatBackground {
  enabled: boolean;
  color: string;
  opacity: number;
  padding: PaddingSize;
}

export interface ICustomChatSettings {
  fontSize: number;
  authorPosition: AuthorPosition;
  authorMessageGap: number;
  messageSpacing: number;
  badgePosition: BadgePosition;
  authorColor: string;
  authorBackground: IChatBackground;
  messageColor: string;
  messageBackground: IChatBackground;
  showAvatar: boolean;
  showTimestamp: boolean;
  hideHeader: boolean;
  transparentPage: boolean;
}
