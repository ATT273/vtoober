import ChannelList from "@/modules/channel/components/ChannelList";

export default function ChannelListPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex justify-center">
        <h1 className="text-center text-3xl font-semibold">Channels</h1>
      </header>
      <ChannelList />
    </main>
  );
}
