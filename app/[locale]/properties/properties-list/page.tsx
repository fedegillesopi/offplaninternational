import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyCard } from "@/components/properties/property-card";
import { Footer } from "@/components/site/footer";
import { mockProperties } from "@/lib/mock-properties";

export default async function PropertiesListPage() {
  const t = await getTranslations("properties");

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-2 py-2 md:px-6 md:py-2">
        <BackToHome label={t("back_to_home")} />
        <div className="h-px w-full bg-[--grey-50]" />
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-h3 text-[--text-primary]">
            {t("all_properties")}
          </h1>
        </div>
        <PropertyFilters />
        <div className="flex flex-col gap-4 mb-10">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
