"use client";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelVideoKind } from "../../types/channel.types";
import ChannelVideoGrid from "./ChannelVideoGrid";

const TABS: { id: ChannelVideoKind; label: string }[] = [
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "streams", label: "Livestream" },
];

// Panels mount lazily, so each tab only calls YouTube once it is opened.
const ChannelVideosTabs = ({ channelId }: { channelId: string }) => (
  <Card>
    <CardContent>
      <Tabs defaultSelectedKey="videos" className="flex flex-col gap-4">
        <TabList aria-label="Nội dung channel" className="flex gap-1 border-b">
          {TABS.map(({ id, label }) => (
            <Tab
              key={id}
              id={id}
              className="-mb-px cursor-default border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-selected:border-foreground data-selected:text-foreground"
            >
              {label}
            </Tab>
          ))}
        </TabList>
        {TABS.map(({ id }) => (
          <TabPanel key={id} id={id} className="outline-none">
            <ChannelVideoGrid channelId={channelId} kind={id} />
          </TabPanel>
        ))}
      </Tabs>
    </CardContent>
  </Card>
);

export default ChannelVideosTabs;
