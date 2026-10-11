"use client";
import { LayoutGridIcon, LayoutListIcon, SearchIcon, XIcon } from "lucide-react";
import { SearchField, ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveLayout } from "../types/live.types";

interface ILiveToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  layout: LiveLayout;
  onLayoutChange: (layout: LiveLayout) => void;
}

const LAYOUT_OPTIONS = [
  { id: "list", label: "Dạng danh sách", icon: LayoutListIcon },
  { id: "grid", label: "Dạng lưới", icon: LayoutGridIcon },
] as const;

const LiveToolbar = ({ search, onSearchChange, layout, onLayoutChange }: ILiveToolbarProps) => (
  <div className="flex items-center gap-3">
    <SearchField
      value={search}
      onChange={onSearchChange}
      aria-label="Tìm stream"
      className="group relative flex flex-1 items-center"
    >
      <SearchIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
      <Input
        placeholder="Tìm theo tiêu đề, channel, org..."
        className="h-10 rounded-full pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Xoá tìm kiếm"
        className="absolute right-1.5 rounded-full group-data-empty:hidden"
      >
        <XIcon />
      </Button>
    </SearchField>
    <ToggleButtonGroup
      aria-label="Kiểu hiển thị"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[layout]}
      onSelectionChange={(keys) => {
        const [next] = keys;
        if (next === "list" || next === "grid") onLayoutChange(next);
      }}
      className="flex shrink-0 rounded-full p-1 ring-1 ring-foreground/10"
    >
      {LAYOUT_OPTIONS.map(({ id, label, icon: Icon }) => (
        <ToggleButton
          key={id}
          id={id}
          aria-label={label}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-selected:bg-muted data-selected:text-foreground"
        >
          <Icon className="size-4" />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </div>
);

export default LiveToolbar;
