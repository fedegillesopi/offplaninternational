import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export async function AboutSection() {
  const t = await getTranslations("about");

  return (
    <section className="home-aboutus flex flex-col items-stretch justify-between gap-3 px-3 py-6 md:flex-row md:items-center md:px-4 md:py-7 lg:px-6 lg:py-10 max-w-[1440px] mx-auto">
      <Image
        src="/images/miscelaneous/blog-example3.png"
        alt=""
        width={900}
        height={600}
        className="aboutus-img w-full rounded-2 md:w-1/2"
        sizes="(max-width: 1000px) 100%"
      />
      <div className="flex w-full flex-col items-start gap-3 md:w-1/2">
        <h3 className="font-heading text-h3 text-text-primary">
          <strong>{t("title")}</strong>
        </h3>
        <p className="font-body text-body-1 text-text-primary">
          {t.rich("body", {
            strong: (chunks) => <strong>{chunks}</strong>,
            br: () => <br />,
          })}
        </p>
        <Link
          href="#"
          className="ghost-button-icon flex items-center gap-1 text-primary-main no-underline"
        >
          <span className="font-heading text-base">
            {t("read_more")}
          </span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
