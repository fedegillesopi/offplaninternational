import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ContactFormEmbed } from "@/components/site/contact-form-embed";

export default async function ContactPage() {
  const t = await getTranslations("pages");
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 py-16 md:flex-row md:px-8">
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-8xl font-heading font-bold mb-4">{t("contact_title")}</h1>
          <p className="text-body-1 font-body text-[--grey-500] leading-relaxed max-w-md">
            {t("contact_subtitle")}
          </p>
        </div>
        <div className="flex-1">
          <ContactFormEmbed />
        </div>
      </main>
      <Footer />
    </div>
  );
}
