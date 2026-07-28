import { Link } from "@/i18n/navigation";

export function ContactBanner() {
  return (
    <section className="px-3 py-6 md:px-4 md:py-7 lg:px-6 lg:py-10">
      <div
        className="max-w-[1000px] mx-auto flex flex-col items-start justify-between gap-3 rounded-2 bg-[--text-primary] p-2 md:p-4 lg:flex-row lg:items-center lg:p-6"
        style={{
          backgroundImage:
            "url('/images/brand/iso-black-stroke.svg')",
          backgroundPosition: "120% center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "700px",
        }}
      >
        <div className="banner-title flex w-full flex-col gap-2">
          <h4 className="font-heading text-6xl text-white">
            Contact us
          </h4>
          <p className="font-body text-md text-white/80">
            Get in touch with our team if you have any questions or want to
            be a part of our mission.
          </p>
        </div>
        <Link
          href="/contact"
          className="font-heading inline-flex items-center justify-center whitespace-nowrap rounded-1 bg-others-white px-8 py-2 text-center text-base text-text-primary no-underline transition-colors hover:bg-others-white/90"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
