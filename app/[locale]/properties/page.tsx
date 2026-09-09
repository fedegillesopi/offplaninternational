import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { BackToHome } from "@/components/site/back-to-home";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyCard } from "@/components/properties/property-card";
import { Pagination } from "@/components/properties/pagination";
import { Footer } from "@/components/site/footer";
import {
  getProperties,
  PROPERTIES_PER_PAGE,
  getPropertyCities,
  getPropertyStatuses,
  getPropertyPriceBounds,
} from "@/lib/properties";
import { getPropertySubcategories } from "@/lib/property-subcategories";
import { getPropertyAmenities } from "@/lib/property-amenities";
import { getDeveloperFilterOptions } from "@/lib/developers";
import {
  parseSearchParams,
  priceBands,
  getBedOptions,
  getBathOptions,
  cleanStatusLabel,
  type FilterOptions,
} from "@/lib/filter-options";

interface PropertiesListPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PropertiesListPage({
  searchParams,
}: PropertiesListPageProps) {
  const t = await getTranslations("properties");
  const raw = await searchParams;
  const filters = parseSearchParams(raw);

  const [cities, subcategories, developers, amenities, statuses, priceBounds] =
    await Promise.all([
      getPropertyCities(),
      getPropertySubcategories(),
      getDeveloperFilterOptions(),
      getPropertyAmenities(),
      getPropertyStatuses(),
      getPropertyPriceBounds(),
    ]);

  const options: FilterOptions = {
    locations: cities.map((c) => ({ value: c, label: c })),
    categories: subcategories.map((s) => ({ value: s.slug, label: s.name })),
    prices: priceBands(priceBounds.min, priceBounds.max),
    statuses: statuses.map((s) => ({ value: s, label: cleanStatusLabel(s) })),
    beds: getBedOptions(),
    baths: getBathOptions(),
    developers: developers.map((d) => ({ value: d.id, label: d.name })),
    amenities: amenities.map((a) => ({ value: a.slug, label: a.name })),
  };

  const parsedPage = Number(raw.page) || 1;
  const { properties, total } = await getProperties(filters, parsedPage, PROPERTIES_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(total / PROPERTIES_PER_PAGE));
  const page = Math.min(parsedPage, totalPages);

  const hasFilters = [
    filters.location,
    filters.price,
    filters.status,
    filters.beds,
    filters.baths,
    filters.developer,
  ].some(Boolean) ||
    filters.categories.length > 0 ||
    filters.amenities.length > 0;

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-2 py-2 md:px-6 md:py-6">
        <BackToHome label={t("back_to_home")} />

        <div className="h-px w-full bg-[--grey-50]" />

        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-h3 text-[--text-primary]">
            {t("all_properties")}
          </h1>
          {total > 0 && (
            <p className="font-body text-sm font-light text-[--grey-300]">
              {t("results", { count: total })}
            </p>
          )}
        </div>

        <PropertyFilters options={options} filters={filters} />

        <div className="mb-6 flex flex-col gap-4">
          {total === 0 ? (
            <p className="py-10 text-center font-body text-base font-light text-[--grey-300]">
              {hasFilters ? t("no_matching_properties") : t("no_properties")}
            </p>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>

        {properties.length > 0 && (
          <Pagination filters={filters} page={page} totalPages={totalPages} />
        )}
      </main>
      <Footer />
    </div>
  );
}