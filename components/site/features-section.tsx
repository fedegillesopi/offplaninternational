const features = [
  {
    title: "Verified developers only",
    description:
      "Every unit comes directly from approved, licensed developers, no third-party agents.",
    icon: "/images/icons/general/check-icon.svg",
  },
  {
    title: "Direct inquiries, no pressure",
    description:
      "Contact the developer instantly without brokers, pushy sales calls, or misinformation.",
    icon: "/images/icons/general/phone-icon.svg",
  },
  {
    title: "Full transparency, zero hassle",
    description:
      "See complete financial details upfront, with no hidden fees, no missing information.",
    icon: "/images/icons/general/card-icon.svg",
  },
];

export function FeaturesSection() {
  return (
    <section className="home-bannersection px-3 py-7 md:px-4 md:py-7 lg:px-6">
      <div
        className="banner-confidence rounded-2 bg-[--text-primary] p-2 md:p-4 lg:p-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url('/images/miscelaneous/blog-example3.png')",
          backgroundPosition: "0 0, 50% 25%",
          backgroundRepeat: "repeat, no-repeat",
          backgroundSize: "auto, cover",
        }}
      >
        <h2 className="font-heading text-h3 mb-3 text-center font-light text-white">
          Find your place with confidence
        </h2>
        <div className="bannerconfidence-cardcontainer flex w-full flex-col items-start justify-between gap-4 md:flex-row md:flex-wrap md:justify-center">
          {features.map((feature) => (
              <div
                key={feature.title}
                className="confidence-card flex max-w-[400px] flex-col items-start gap-2 rounded-1 bg-white p-3 sm:flex-row md:p-3"
              >
                <img src={feature.icon} alt="" width={40} height={40} className="shrink-0" />
                <div>
                  <h3 className="font-heading text-subtitle-1 font-bold text-[--text-primary]">
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
