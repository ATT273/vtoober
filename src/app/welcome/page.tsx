import WelcomeLayout from "@/modules/welcome/components/WelcomeLayout";
import { getSession } from "../actions";

export default async function WelcomePage() {
  const session = await getSession();

  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
      <WelcomeLayout session={session} />
    </main>
  );
}
