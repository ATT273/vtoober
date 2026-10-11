import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompact, formatDateTime } from "@/modules/home/utils/format";
import { IChannelSnapshot } from "../../types/channel.types";

const ChannelStatsHistory = ({ snapshots }: { snapshots: IChannelSnapshot[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Lịch sử thống kê</CardTitle>
      <CardDescription>{snapshots.length} bản ghi gần nhất</CardDescription>
    </CardHeader>
    <CardContent>
      {snapshots.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 font-medium">Thời điểm</th>
              <th className="py-2 text-right font-medium">Subscribers</th>
              <th className="py-2 text-right font-medium">Lượt xem</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id} className="border-b last:border-0">
                <td className="py-2">{formatDateTime(snapshot.recordedAt)}</td>
                <td className="py-2 text-right tabular-nums">{formatCompact(snapshot.subscriberCount)}</td>
                <td className="py-2 text-right tabular-nums">{formatCompact(snapshot.viewCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CardContent>
  </Card>
);

export default ChannelStatsHistory;
