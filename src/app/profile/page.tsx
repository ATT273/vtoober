import { redirect } from "next/navigation";
import MyProfile from "@/modules/profile/components/MyProfile";
import { getSession } from "../actions";

export default async function MyProfilePage() {
  const session = await getSession();
  if (!session) redirect("/authentication");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
      <MyProfile />
    </main>
  );
}
