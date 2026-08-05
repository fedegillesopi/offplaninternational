import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { DevelopersGrid } from "@/components/developers/developers-grid";
import { Footer } from "@/components/site/footer";
import { getDevelopers } from "@/lib/developers";

export default async function DevelopersPage() {
  const t = await getTranslations("developers");
  const developers = await getDevelopers();

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-2 py-2 md:px-6 md:py-6">
        <BackToHome label={t("back_to_home")} />

        <div className="h-px w-full bg-[--grey-50]" />

        <h1 className="font-heading text-h3 text-[--text-primary]">
          {t("all_developers")}
        </h1>

        <DevelopersGrid developers={developers} />
      </main>
      <Footer />
    </div>
  );
}
