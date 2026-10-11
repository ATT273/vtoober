import ChannelRankingList from "@/modules/home/components/ChannelRankingList";
import ProfileSection from "@/modules/home/components/profile-section/ProfileSection";
import { getSession } from "../actions";

export default async function HomePage() {
  // Public page: guests can browse the leaderboard, the session only drives the profile corner.
  const session = await getSession();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex justify-center">
        <h1 className="text-center text-3xl font-semibold">👑 Leaderboard 👑</h1>
      </header>
      <ChannelRankingList />
      <ProfileSection session={session} />
    </main>
  );
}
