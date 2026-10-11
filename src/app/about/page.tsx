import AboutFaq from "@/modules/about/components/AboutFaq";
import AboutIntro from "@/modules/about/components/AboutIntro";

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10">
      <AboutIntro />
      <AboutFaq />
    </main>
  );
}
