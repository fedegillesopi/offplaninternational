import { getTranslations } from "next-intl/server";

const featureIcons = [
  "/images/icons/general/check-icon.svg",
  "/images/icons/general/phone-icon.svg",
  "/images/icons/general/card-icon.svg",
];

export async function FeaturesSection() {
  const t = await getTranslations("features");

  const features = [
    {
      title: t("one_title"),
      description: t("one_description"),
    },
    {
      title: t("two_title"),
      description: t("two_description"),
    },
    {
      title: t("three_title"),
      description: t("three_description"),
    },
  ];

  return (
    <section className="px-3 py-7 md:px-4 md:py-7 lg:px-6">
      <div
        className="rounded-2 bg-[--text-primary] p-2 md:p-4 lg:p-14 max-w-[1440px] mx-auto"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url('/images/miscelaneous/blog-example3.png')",
          backgroundPosition: "0 0, 50% 25%",
          backgroundRepeat: "repeat, no-repeat",
          backgroundSize: "auto, cover",
        }}
      >
        <h2 className="font-heading text-h3 mb-10 text-center font-light text-white">
          {t("title")}
        </h2>

        <div className="flex w-full flex-col items-stretch justify-between gap-4 md:flex-row md:flex-wrap md:justify-center">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex max-w-[400px] flex-col items-start gap-2 rounded-1 bg-white p-3 sm:flex-row md:p-6"
            >
              <img src={featureIcons[index]} alt="" width={40} height={40} className="shrink-0 mr-1" />
              <div>
                <h3 className="font-heading text-subtitle-1 font-bold text-[--text-primary] mb-1">
                  {feature.title}
                </h3>
                <p className="font-body text-subtitle-2 text-[--text-primary]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
