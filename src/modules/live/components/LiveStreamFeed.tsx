"use client";
import { useDeferredValue, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { LiveLayout, LiveStatus } from "../types/live.types";
import LiveStreamList from "./LiveStreamList";
import LiveToolbar from "./LiveToolbar";

const TABS: { id: LiveStatus; label: string }[] = [
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
];

const LiveStreamFeed = () => {
  const [tab, setTab] = useState<LiveStatus>("live");
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<LiveLayout>("grid");
  // Filtering runs on every loaded stream; defer it so typing stays responsive.
  const deferredSearch = useDeferredValue(search);

  return (
    <Tabs
      selectedKey={tab}
      onSelectionChange={(key) => setTab(key === "upcoming" ? "upcoming" : "live")}
      className="flex w-full flex-col gap-4"
    >
      <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-2 bg-background/90 px-4 pt-3 backdrop-blur">
        <LiveToolbar search={search} onSearchChange={setSearch} layout={layout} onLayoutChange={setLayout} />
        <TabList aria-label="Trạng thái stream" className="flex gap-1 border-b">
          {TABS.map(({ id, label }) => (
            <Tab
              key={id}
              id={id}
              className="relative -mb-px flex cursor-default items-center gap-2 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-selected:border-foreground data-selected:text-foreground"
            >
              {id === "live" && <span className="size-2 rounded-full bg-red-600" />}
              {label}
            </Tab>
          ))}
        </TabList>
      </div>

      {TABS.map(({ id }) => (
        <TabPanel key={id} id={id} className="outline-none">
          <LiveStreamList status={id} search={deferredSearch} layout={layout} />
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default LiveStreamFeed;
