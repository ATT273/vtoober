"use client";

import React, { useMemo, useState } from "react";
import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { AuthorPosition, BadgePosition, ICustomChatSettings } from "../../types/customChat.types";
import { buildCustomChatCss, DEFAULT_CUSTOM_CHAT_SETTINGS } from "../../utils/customChatCss";
import CustomChatPreview from "./CustomChatPreview";
import { BackgroundField, ColorField, RangeField, SegmentedField, ToggleField } from "./SettingFields";
import SettingsSection from "./SettingsSection";

const AUTHOR_POSITION_OPTIONS: { value: AuthorPosition; label: string }[] = [
  { value: "top", label: "Above message" },
  { value: "inline", label: "Same line" },
];

const BADGE_POSITION_OPTIONS: { value: BadgePosition; label: string }[] = [
  { value: "after-author", label: "After author name" },
  { value: "message-corner", label: "Message corner" },
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
          <h4 className="font-semibold">Settings</h4>
          <Button variant="outline" size="sm" onPress={() => setSettings(DEFAULT_CUSTOM_CHAT_SETTINGS)}>
            <RotateCcwIcon />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SettingsSection title="Layout" description="Where the author sits and how far it is from the message">
            <SegmentedField
              label="Author position"
              value={settings.authorPosition}
              options={AUTHOR_POSITION_OPTIONS}
              onChange={(value) => update("authorPosition", value)}
            />
            <RangeField
              id="chat-gap"
              label="Author – message spacing"
              valueLabel={settings.authorMessageGap === 0 ? "No gap" : `${settings.authorMessageGap}px`}
              value={settings.authorMessageGap}
              min={0}
              max={24}
              onChange={(value) => update("authorMessageGap", value)}
            />
            <RangeField
              id="chat-message-spacing"
              label="Spacing between messages"
              valueLabel={settings.messageSpacing === 0 ? "No gap" : `${settings.messageSpacing}px`}
              value={settings.messageSpacing}
              min={0}
              max={32}
              onChange={(value) => update("messageSpacing", value)}
            />
            <SegmentedField
              label="Badge position"
              value={settings.badgePosition}
              options={BADGE_POSITION_OPTIONS}
              onChange={(value) => update("badgePosition", value)}
            />
          </SettingsSection>

          <SettingsSection title="Text" description="Font size for the whole chat">
            <div className="flex flex-col gap-2">
              <Label htmlFor="chat-font-size">Font size (px)</Label>
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

          <SettingsSection title="Author" description="Viewer name style">
            <ColorField
              id="chat-author-color"
              label="Text color"
              value={settings.authorColor}
              onChange={(value) => update("authorColor", value)}
            />
            <BackgroundField
              id="chat-author-bg"
              label="Author background"
              value={settings.authorBackground}
              onChange={(value) => update("authorBackground", value)}
            />
          </SettingsSection>

          <SettingsSection title="Message" description="Chat message style">
            <ColorField
              id="chat-message-color"
              label="Text color"
              value={settings.messageColor}
              onChange={(value) => update("messageColor", value)}
            />
            <BackgroundField
              id="chat-message-bg"
              label="Message background"
              value={settings.messageBackground}
              onChange={(value) => update("messageBackground", value)}
            />
          </SettingsSection>

          <SettingsSection title="Display" description="Extra parts of each chat line">
            <ToggleField label="Show avatar" checked={settings.showAvatar} onChange={(v) => update("showAvatar", v)} />
            <ToggleField
              label="Show timestamp"
              checked={settings.showTimestamp}
              onChange={(v) => update("showTimestamp", v)}
            />
          </SettingsSection>

          <SettingsSection title="OBS overlay" description="Clean up the chat page for streaming">
            <ToggleField
              label="Hide header & input box"
              checked={settings.hideHeader}
              onChange={(v) => update("hideHeader", v)}
            />
            <ToggleField
              label="Transparent page background"
              checked={settings.transparentPage}
              onChange={(v) => update("transparentPage", v)}
            />
          </SettingsSection>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <h4 className="font-semibold">Preview</h4>
        <CustomChatPreview settings={settings} />

        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Generated CSS</h4>
          <Button size="sm" onPress={handleCopy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy CSS"}
          </Button>
        </div>
        <pre className="max-h-72 shrink-0 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{css}</pre>
        <p className="text-xs text-gray-400">
          Paste this into the Custom CSS field of an OBS browser source pointing to your YouTube live chat popout URL.
        </p>
      </div>
    </div>
  );
};

export default CustomChatSettings;
