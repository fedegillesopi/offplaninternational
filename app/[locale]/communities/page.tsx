import { getLocale, getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { CommunitiesGrid } from "@/components/communities/communities-grid";
import { Footer } from "@/components/site/footer";
import { getCommunities } from "@/lib/communities";

export default async function CommunitiesPage() {
  const t = await getTranslations("communities");
  const locale = await getLocale();
  const communities = await getCommunities(locale);

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-2 py-2 md:px-6 md:py-6">
        <BackToHome label={t("back_to_home")} />

        <div className="h-px w-full bg-[--grey-50]" />

        <h1 className="font-heading text-h3 text-[--text-primary]">
          {t("all_communities")}
        </h1>

        <CommunitiesGrid communities={communities} />
      </main>
      <Footer />
    </div>
  );
}
