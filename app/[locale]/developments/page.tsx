import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { DevelopmentCard } from "@/components/site/development-card";
import { Footer } from "@/components/site/footer";

const developments = [
  {
    name: "Dubai Creek Harbour",
    description:
      "A master-planned community by Emaar and Dubai Holding, featuring waterfront living, retail, and green spaces along Dubai Creek.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
    logo: "/images/brand/Iso-Color.png",
    location: "UAE, Dubai, Dubai Creek",
    slug: "dubai-creek-harbour",
  },
  {
    name: "Palm Jumeirah",
    description:
      "The iconic man-made island by Nakheel, home to luxury villas, hotels, and beachfront residences.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    logo: "/images/brand/Iso-Color.png",
    location: "UAE, Dubai, Palm Jumeirah",
    slug: "palm-jumeirah",
  },
];

export default async function DevelopmentsPage() {
  const t = await getTranslations("developments");

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-2 py-2 md:px-6 md:py-6">
        <BackToHome label={t("back_to_home")} />

        <div className="h-px w-full bg-[--grey-50]" />

        <h1 className="font-heading text-h3 text-[--text-primary]">
          {t("all_developments")}
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[--grey-300]" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            disabled
            className="w-full max-w-md rounded-1 border border-[--grey-200] bg-white py-3 pl-12 pr-4 font-body text-base text-[--text-primary] outline-none placeholder:text-[--grey-300] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {developments.map((dev) => (
            <DevelopmentCard key={dev.slug} {...dev} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
