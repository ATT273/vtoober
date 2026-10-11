import LiveStreamFeed from "@/modules/live/components/LiveStreamFeed";

export default function LivePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2 px-4 py-6">
      <h1 className="text-center text-2xl font-semibold">🔴 Đang live</h1>
      <LiveStreamFeed />
    </main>
  );
}
