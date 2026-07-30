import { getTranslations, getLocale } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getPrivacyContent } from "@/lib/content/privacy";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages");
  const sections = getPrivacyContent(locale);
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto max-w-[800px] px-4 py-16 md:px-8">
        <h1 className="text-h2 font-heading font-bold mb-10">{t("privacy")}</h1>
        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              {section.title && (
                <h2 className="text-h4 font-heading font-semibold mb-2">
                  {section.title}
                </h2>
              )}
              {section.content && (
                <p className="text-body-1 font-body text-[--grey-500] leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
              {section.items && (
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {section.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-body-1 font-body text-[--grey-500] leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
