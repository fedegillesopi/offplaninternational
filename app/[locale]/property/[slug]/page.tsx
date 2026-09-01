import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertySidebar } from "@/components/properties/property-sidebar";
import { PropertyDetailsTable } from "@/components/properties/property-details-table";
import { PropertyAmenitiesGrid } from "@/components/properties/property-amenities-grid";
import { PropertyPaymentPlan } from "@/components/properties/property-payment-plan";
import { PropertyTags } from "@/components/properties/property-tags";
import { PropertyDescription } from "@/components/properties/property-description";
import { RelatedProperties } from "@/components/properties/related-properties";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/properties";
import { Link } from "@/i18n/navigation";
import { Bed, Bath, MapPin, User } from "lucide-react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const td = await getTranslations("property_detail");
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const related = await getRelatedProperties(property.id);

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-2 py-2 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between">
              <BackToHome
                href="/properties"
                label={td("back_to_list")}
              />
            </div>

            <Breadcrumb
              items={[
                { label: "Off Plan International", href: "/" },
                { label: td("all_properties"), href: "/properties" },
                { label: property.title },
              ]}
            />

          </div>
          <div className="h-px w-full bg-[--grey-50]" />
        </div>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="flex flex-col gap-8 md:flex-row mt-6">
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-1 flex-col gap-2">

              <div className="flex flex-wrap items-center gap-2 font-body text-sm font-light text-[--text-primary]">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-[--primary-main]" />
                  <span>{property.country}</span>
                  <span>,</span>
                  <span>{property.city}</span>
                  <span>,</span>
                  <span>{property.community}</span>
                </div>

                <span className="text-[--grey-200]">|</span>

                <span className="font-medium text-[--primary-main]">
                  {property.category}
                </span>

                <span className="text-[--grey-200]">|</span>

                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.beds}</span>
                  <Bath className="h-4 w-4" />
                  <span>{property.baths}</span>
                </div>

                <span className="text-[--grey-200]">|</span>
                <span>{td("area_sqft")} {property.area} sqft</span>

                <span className="text-[--grey-200]">|</span>

                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-[--primary-main]" />
                  <span>{td("uploaded_by")}</span>
                  {property.listed_by_type === "private_seller" ? (
                    <span className="font-medium">{property.private_seller_name}</span>
                  ) : property.listed_by_type === "broker" ? (
                    <Link
                      href={`/broker/${property.broker_slug}`}
                      className="font-medium text-[--primary-main] no-underline hover:underline"
                    >
                      {property.broker_name}
                    </Link>
                  ) : (
                    <Link
                      href={`/developer/${property.developer_slug}`}
                      className="font-medium text-[--primary-main] no-underline hover:underline"
                    >
                      {property.developer_name}
                    </Link>
                  )}
                </div>
              </div>

              <h1 className="font-heading text-h2 font-bold text-[--text-primary]">
                {property.title}
              </h1>

              <PropertyDescription text={property.descriptionFull} />
            </div>

            <div className="h-px w-full bg-[--grey-50]" />

            <div className="w-full max-w-lg">
              <PropertyDetailsTable
                subcategory={property.subcategory}
                addedOn={property.addedOn}
                status={property.status}
                handoverDate={property.handoverDate}
              />
            </div>

            <PropertyAmenitiesGrid
              amenities={property.amenities}
              title={td("property_amenities")}
            />

            <div className="h-px w-full bg-[--grey-50]" />

            <div>
              <h3 className="mb-4 font-heading text-h4 font-bold text-[--text-primary]">
                {td("development_details")}
              </h3>
              <div className="divide-y divide-[--grey-50] rounded-2 border border-[--grey-50] w-full max-w-lg">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-body text-sm font-light text-[--grey-300]">
                    {td("development_name")}
                  </span>
                  <span className="font-body text-sm font-medium text-[--text-primary]">
                    {property.development_name}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-body text-sm font-light text-[--grey-300]">
                    {td("total_development_area")}
                  </span>
                  <span className="font-body text-sm font-medium text-[--text-primary]">
                    {property.development_total_area.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-body text-sm font-light text-[--grey-300]">
                    {td("developer_label")}
                  </span>
                  <Link
                    href={`/developer/${property.developer_slug}`}
                    className="font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
                  >
                    {property.developer_name}
                  </Link>
                </div>
              </div>
            </div>

            <PropertyAmenitiesGrid
              amenities={property.development_amenities}
              title={td("development_amenities")}
            />

            <div className="h-px w-full bg-[--grey-50]" />

            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex flex-col">
                <h3 className="mb-4 font-heading text-h4 font-bold text-[--text-primary]">
                  {td("community_details")}
                </h3>

                <div className="divide-y divide-[--grey-50] rounded-2 border border-[--grey-50] w-full max-w-lg">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-body text-sm font-light text-[--grey-300]">
                      {td("development_name")}
                    </span>
                    <span className="font-body text-sm font-medium text-[--text-primary]">
                      {property.community_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-body text-sm font-light text-[--grey-300]">
                      {td("total_development_area")}
                    </span>
                    <span className="font-body text-sm font-medium text-[--text-primary]">
                      {property.community_total_area.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="px-3 py-2">
                    <span className="font-body text-sm font-light text-[--grey-300]">
                      {td("description_label")}
                    </span>
                    <p className="mt-1 font-body text-sm font-regular text-[--text-primary]">
                      {property.community_description}
                    </p>
                  </div>
                </div>
              </div>

              <PropertyTags tags={property.tags} />
            </div>

            <div className="h-px w-full bg-[--grey-50]" />

            <div className="w-full max-w-lg">
              <PropertyPaymentPlan paymentPlan={property.paymentPlan} />
            </div>
          </div>

          <aside className="w-full shrink-0 md:w-[340px]">
            <PropertySidebar
              price={property.price}
              currency={property.currency}
              developmentName={property.development_name}
              developmentSlug={property.development_slug}
              sellerName={
                property.listed_by_type === "private_seller"
                  ? property.private_seller_name
                  : property.listed_by_type === "broker"
                    ? property.broker_name
                    : property.developer_name
              }
              sellerSlug={
                property.listed_by_type === "private_seller"
                  ? ""
                  : property.listed_by_type === "broker"
                    ? property.broker_slug
                    : property.developer_slug
              }
              listedByType={property.listed_by_type}
              phone={property.phone}
              whatsapp={property.whatsapp}
            />
          </aside>
        </div>

        <div className="h-px w-full bg-[--grey-50]" />

        <RelatedProperties properties={related} />
      </main>
      <Footer />
    </div>
  );
}
