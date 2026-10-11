import Link from "next/link";
import { redirect } from "next/navigation";
import ChannelDetail from "@/modules/channel/components/channel-detail/ChannelDetail";
import { getChannelOwnerId } from "@/modules/channel/actions";

export default async function ChannelDetailPage({ params }: PageProps<"/channel/[id]">) {
  const { id } = await params;

  // A channel linked to a user lives on that user's profile.
  const ownerId = await getChannelOwnerId(id);
  if (ownerId) redirect(`/profile/${ownerId}`);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
      <Link href="/channel/list" className="text-sm text-sky-500 hover:underline">
        ← Danh sách channel
      </Link>
      <ChannelDetail id={id} />
    </main>
  );
}
