import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default async function MarketNewsPage() {
  const t = await getTranslations("pages");
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-h2 font-heading font-bold">{t("market_news")}</h1>
      </main>
      <Footer />
    </div>
  );
}
