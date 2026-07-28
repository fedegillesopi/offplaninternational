import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer id="footer" className="bg-[--text-primary]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-6 py-10">
        <div className="flex w-full flex-col justify-between gap-5 text-[--grey-100] md:flex-row">
          <div className="flex w-full flex-col gap-5">
            <Image
              src="/images/brand/IsoLogotype-White&Color.png"
              alt="Off Plan International"
              width={200}
              height={50}
              className="h-auto w-[200px]"
            />
            <div className="flex items-center gap-5">
              <div className="flex flex-col gap-2">
                <p className="font-body text-base font-light text-white">
                  {t("live_support")}
                </p>
                <a
                  href="mailto:sales@offplaninternational.com?subject=Off%20Plan%20Site%20Contact"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  sales@offplaninternational.com
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-body text-base font-light text-[--grey-100]">
                {t("follow_us")}
              </p>
              <div className="flex items-center gap-3 text-white">
                <a
                  href="https://www.instagram.com/offplaninternational/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[--primary-main]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248a4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008a3.004 3.004 0 0 1 0 6.008z" />
                    <circle cx="16.806" cy="7.207" r="1.078" />
                    <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42a4.6 4.6 0 0 0-2.633 2.632a6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71c0 2.442 0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632a6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419a4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186c.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688a2.987 2.987 0 0 1-1.712 1.711a4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055c-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311a2.985 2.985 0 0 1-1.719-1.711a5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654c0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311a2.991 2.991 0 0 1 1.712 1.712a5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655c0 2.436 0 2.698-.043 3.654h-.011z" />
                  </svg>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[--primary-main]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="4.983" cy="5.009" r="2.188" />
                    <path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118c1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783c-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between gap-6 md:justify-end">
            <div className="flex flex-col gap-2">
              <p className="font-body text-base font-light text-[--primary-main]">
                {t("quick_search")}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("home")}
                </Link>
                <Link
                  href="/properties/properties-list"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("properties")}
                </Link>
                <Link
                  href="/developments/developments-list"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("developments")}
                </Link>
                <Link
                  href="/developers/developers-list"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("developers")}
                </Link>
                <Link
                  href="/communities/communities-list"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("communities")}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-body text-base font-light text-[--primary-main]">
                {t("legal")}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/legal/terms-conditions"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/legal/privacy-policy"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("privacy")}
                </Link>
                <Link
                  href="/contact"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("contact")}
                </Link>
                <Link
                  href="#"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("faq")}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-body text-base font-light text-[--primary-main]">
                {t("other_links")}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="font-heading text-base font-light text-white no-underline hover:text-[--primary-main] hover:underline"
                >
                  {t("market_news")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[--grey-100]" />

        <p className="font-body text-base font-light text-white">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
