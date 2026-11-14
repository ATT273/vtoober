"use client";

import React, { useMemo, useState } from "react";
import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  AuthorPosition,
  BadgePosition,
  ChatGrouping,
  ICustomChatSettings,
  MessageStyle,
} from "../../types/customChat.types";
import { buildCustomChatCss, DEFAULT_CUSTOM_CHAT_SETTINGS } from "../../utils/customChatCss";
import CustomChatPreview from "./CustomChatPreview";
import { BackgroundField, ColorField, RangeField, SegmentedField, ToggleField } from "./SettingFields";
import SettingsSection from "./SettingsSection";

const AUTHOR_POSITION_OPTIONS: { value: AuthorPosition; label: string }[] = [
  { value: "top", label: "Trên tin nhắn" },
  { value: "inline", label: "Cùng hàng" },
];

const BADGE_POSITION_OPTIONS: { value: BadgePosition; label: string }[] = [
  { value: "after-author", label: "Sau tên" },
  { value: "message-corner", label: "Góc dưới tin nhắn" },
];

const GROUPING_OPTIONS: { value: ChatGrouping; label: string }[] = [
  { value: "none", label: "Không" },
  { value: "avatar-author", label: "Avatar + Tên" },
  { value: "author-message", label: "Tên + Tin nhắn" },
];

const MESSAGE_STYLE_OPTIONS: { value: MessageStyle; label: string }[] = [
  { value: "normal", label: "Thường" },
  { value: "bubble", label: "Bong bóng hội thoại" },
];

const CustomChatSettings = () => {
  const [settings, setSettings] = useState<ICustomChatSettings>(DEFAULT_CUSTOM_CHAT_SETTINGS);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => buildCustomChatCss(settings), [settings]);

  const update = <K extends keyof ICustomChatSettings>(key: K, value: ICustomChatSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:h-full lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Cài đặt</h4>
          <Button variant="outline" size="sm" onPress={() => setSettings(DEFAULT_CUSTOM_CHAT_SETTINGS)}>
            <RotateCcwIcon />
            Đặt lại
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SettingsSection title="Bố cục" description="Chỉnh vị trí tên viewer và tin nhắn">
            <SegmentedField
              label="Vị trí tên"
              value={settings.authorPosition}
              options={AUTHOR_POSITION_OPTIONS}
              onChange={(value) => update("authorPosition", value)}
            />
            <RangeField
              id="chat-gap"
              label="Khoảng cách Tên - tin nhắn"
              valueLabel={settings.authorMessageGap === 0 ? "Liền nhau" : `${settings.authorMessageGap}px`}
              value={settings.authorMessageGap}
              min={0}
              max={24}
              onChange={(value) => update("authorMessageGap", value)}
            />
            <RangeField
              id="chat-message-spacing"
              label="Khoảng cách giữa các tin nhắn"
              valueLabel={settings.messageSpacing === 0 ? "Liền nhau" : `${settings.messageSpacing}px`}
              value={settings.messageSpacing}
              min={0}
              max={32}
              onChange={(value) => update("messageSpacing", value)}
            />
            <SegmentedField
              label="Vị trí icon thành viên"
              value={settings.badgePosition}
              options={BADGE_POSITION_OPTIONS}
              onChange={(value) => update("badgePosition", value)}
            />
            <SegmentedField
              label="Gộp nhóm"
              value={settings.grouping}
              options={GROUPING_OPTIONS}
              onChange={(value) =>
                // Grouping the avatar with the author only makes sense when the avatar is shown
                setSettings((prev) => ({
                  ...prev,
                  grouping: value,
                  showAvatar: value === "avatar-author" ? true : prev.showAvatar,
                }))
              }
            />
          </SettingsSection>

          <SettingsSection title="Chữ" description="Kích thước">
            <div className="flex flex-col gap-2">
              <Label htmlFor="chat-font-size">Kích thước (px)</Label>
              <Input
                id="chat-font-size"
                type="number"
                min={10}
                max={40}
                value={settings.fontSize}
                onChange={(e) => update("fontSize", Number(e.target.value) || DEFAULT_CUSTOM_CHAT_SETTINGS.fontSize)}
              />
            </div>
          </SettingsSection>

          <SettingsSection title="Tên viewer" description="Chỉnh tên viewer">
            <ColorField
              id="chat-author-color"
              label="Màu chữ"
              value={settings.authorColor}
              onChange={(value) => update("authorColor", value)}
            />
            <BackgroundField
              id="chat-author-bg"
              label="Màu nền"
              value={settings.authorBackground}
              onChange={(value) => update("authorBackground", value)}
            />
          </SettingsSection>

          <SettingsSection title="Tin nhắn" description="Chỉnh tin nhắn">
            <SegmentedField
              label="Kiểu"
              value={settings.messageStyle}
              options={MESSAGE_STYLE_OPTIONS}
              onChange={(value) => update("messageStyle", value)}
            />
            <ColorField
              id="chat-message-color"
              label="Màu chữ"
              value={settings.messageColor}
              onChange={(value) => update("messageColor", value)}
            />
            <BackgroundField
              id="chat-message-bg"
              label="Màu nền"
              value={settings.messageBackground}
              onChange={(value) => update("messageBackground", value)}
            />
          </SettingsSection>

          <SettingsSection title="Thông tin thêm" description="Hiển thị một số thông tin phụ">
            <ToggleField
              label="Hiện ảnh đại diện"
              checked={settings.showAvatar}
              onChange={(v) =>
                setSettings((prev) => ({
                  ...prev,
                  showAvatar: v,
                  grouping: !v && prev.grouping === "avatar-author" ? "none" : prev.grouping,
                }))
              }
            />
            <ToggleField
              label="Hiện thời gian"
              checked={settings.showTimestamp}
              onChange={(v) => update("showTimestamp", v)}
            />
            <ToggleField
              label="Hiện xếp hạng chat"
              checked={settings.showRankBadge}
              onChange={(v) => update("showRankBadge", v)}
            />
          </SettingsSection>

          <SettingsSection title="Ghim tin nhắn" description="Chỉnh tin nhắn được ghim">
            <ToggleField
              label="Hiện tin nhắn được ghim"
              checked={settings.showPinnedMessage}
              onChange={(v) => update("showPinnedMessage", v)}
            />
            {settings.showPinnedMessage && (
              <BackgroundField
                id="chat-pinned-bg"
                label="Màu nền"
                value={settings.pinnedBackground}
                onChange={(value) => update("pinnedBackground", value)}
              />
            )}
          </SettingsSection>

          <SettingsSection title="OBS overlay" description="Làm gọn trang chat khi stream">
            <ToggleField
              label="Ẩn phần đầu và ô chat"
              checked={settings.hideHeader}
              onChange={(v) => update("hideHeader", v)}
            />
            <ToggleField
              label="Ẩn nền chat"
              checked={settings.transparentPage}
              onChange={(v) => update("transparentPage", v)}
            />
          </SettingsSection>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <h4 className="font-semibold">Xem trước</h4>
        <CustomChatPreview settings={settings} />

        <div className="flex items-center justify-between">
          <h4 className="font-semibold">CSS đã tạo</h4>
          <Button size="sm" onPress={handleCopy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Đã sao chép" : "Sao chép CSS"}
          </Button>
        </div>
        <pre className="max-h-72 shrink-0 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{css}</pre>
        <p className="text-xs text-gray-400">
          Dán đoạn này vào ô Custom CSS của Browser Source trong OBS, trỏ tới URL popout live chat YouTube của bạn.
        </p>
      </div>
    </div>
  );
};

export default CustomChatSettings;
