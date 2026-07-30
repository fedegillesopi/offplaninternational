import { getTranslations, getLocale } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getTermsContent } from "@/lib/content/terms";

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages");
  const sections = getTermsContent(locale);
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto max-w-[800px] px-4 py-16 md:px-8">
        <h1 className="text-h2 font-heading font-bold mb-10">{t("terms")}</h1>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-h4 font-heading font-semibold mb-2">{section.title}</h2>
              <p className="text-body-1 font-body text-[--grey-500] leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
