import { redirect } from "next/navigation";
import ChannelDetail from "@/modules/channel/components/channel-detail/ChannelDetail";
import { getLinkedChannelId } from "@/modules/profile/actions";
import { getSession } from "../../actions";

export default async function UserProfilePage({ params }: PageProps<"/profile/[userId]">) {
  const { userId } = await params;
  const session = await getSession();
  if (session?.id === userId) redirect("/profile");

  const linkedChannelId = await getLinkedChannelId(userId);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
      {linkedChannelId ? (
        <ChannelDetail id={linkedChannelId} />
      ) : (
        <p className="py-10 text-center text-muted-foreground">Người dùng này chưa liên kết kênh YouTube.</p>
      )}
    </main>
  );
}
