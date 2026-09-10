import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { Footer } from "@/components/site/footer";
import { DevelopmentsGrid } from "@/components/developments/developments-grid";
import { getDevelopments } from "@/lib/developments";

export default async function DevelopmentsPage() {
  const t = await getTranslations("developments");
  const developments = await getDevelopments();

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-2 py-2 md:px-6 md:py-6">
        <BackToHome label={t("back_to_home")} />

        <div className="h-px w-full bg-[--grey-50]" />

        <h1 className="font-heading text-h3 text-[--text-primary]">
          {t("all_developments")}
        </h1>

        <DevelopmentsGrid developments={developments} />
      </main>
      <Footer />
    </div>
  );
}