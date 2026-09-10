import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { DevelopmentHeader } from "@/components/developments/development-header";
import { DevelopmentInfoCard } from "@/components/developments/development-info-card";
import { DevelopmentDescription } from "@/components/developments/development-description";
import { PropertyAmenitiesGrid } from "@/components/properties/property-amenities-grid";
import { CommunityGallery } from "@/components/communities/community-gallery";
import { getDevelopmentBySlug } from "@/lib/developments";
import { resolveAmenityNames } from "@/lib/properties";
import { createClient } from "@/lib/supabase/server";

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("development_detail");
  const development = await getDevelopmentBySlug(slug);

  if (!development) notFound();

  const supabase = await createClient();
  const amenityNames = await resolveAmenityNames(supabase, development.amenities);

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-2 py-2 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BackToHome
              href="/developments"
              label={t("back_to_list")}
            />
            <Breadcrumb
              items={[
                { label: "Off Plan International", href: "/" },
                { label: t("all_developments"), href: "/developments" },
                { label: development.name },
              ]}
            />
          </div>
          <div className="h-px w-full bg-[--grey-50]" />
        </div>

        <DevelopmentHeader
          name={development.name}
          image={development.image}
          logo={development.developerLogo}
        />

        <div className="flex flex-col gap-8 md:flex-row mt-6">
          <div className="flex w-full flex-col gap-8 md:w-[65%] lg:w-[70%]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-body text-sm font-light text-[--text-primary]">
                <MapPin className="h-4 w-4 text-[--primary-main]" />
                <span>{development.location}</span>
              </div>

              <h1 className="font-heading text-h2 font-bold text-[--text-primary]">
                {development.name}
              </h1>

              <h2 className="font-heading text-h4 font-bold text-[--text-primary]">
                {t("about_development")}
              </h2>

              <DevelopmentDescription text={development.description} />
            </div>

            <div className="h-px w-full bg-[--grey-50]" />

            {development.amenities.length > 0 && (
              <>
                <PropertyAmenitiesGrid
                  amenities={development.amenities}
                  amenityNames={amenityNames}
                  title={t("development_amenities")}
                />
                <div className="h-px w-full bg-[--grey-50]" />
              </>
            )}

            {development.images.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
                  {t("gallery")}
                </h2>
                <CommunityGallery images={development.images} name={development.name} />
              </section>
            )}
          </div>

          <aside className="w-full md:w-[35%] lg:w-[30%]">
            <DevelopmentInfoCard
              startingPrice={development.startingPrice}
              startingPriceCurrency={development.startingPriceCurrency}
              propertyTypes={development.propertyTypes}
              totalArea={development.totalArea}
              developerName={development.developerName}
              developerSlug={development.developerSlug}
              developmentSlug={development.slug}
              community={development.community}
              handoverDate={development.handoverDate}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}