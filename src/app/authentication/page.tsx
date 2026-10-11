import { redirect } from "next/navigation";
import AuthenticationCard from "@/modules/welcome/authentication/components/authenication-card/AuthenticationCard";
import { FEATURES } from "@/shared/constants/features";
import { getSession } from "../actions";

export default async function AuthenticationPage() {
  if (!FEATURES.auth) redirect("/home");
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-4 bg-white dark:bg-black">
      <AuthenticationCard />
    </main>
  );
}
