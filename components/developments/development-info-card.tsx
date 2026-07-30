import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CurrencyPrice } from "@/components/shared/currency-price";
import { PrimaryCtaLink } from "@/components/shared/primary-cta-link";

interface DevelopmentInfoCardProps {
  startingPrice: number;
  startingPriceCurrency: string;
  propertyTypes: string[];
  totalArea: number;
  developerName: string;
  developerSlug: string;
  developmentSlug: string;
}

export async function DevelopmentInfoCard({
  startingPrice,
  startingPriceCurrency,
  propertyTypes,
  totalArea,
  developerName,
  developerSlug,
  developmentSlug,
}: DevelopmentInfoCardProps) {
  const t = await getTranslations("development_detail");

  return (
    <div className="sticky top-4 flex flex-col gap-6 rounded-2 bg-white p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("property_starting_price")}
        </span>
        <CurrencyPrice
          basePrice={startingPrice}
          baseCurrency={startingPriceCurrency}
          className="font-heading text-h3 font-bold text-[--text-primary]"
        />
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("type_of_property")}
        </span>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <span
              key={type}
              className="rounded-1 bg-[--primary-light] px-3 py-1 font-body text-sm font-medium text-[--primary-main]"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("total_development_area")}
        </span>
        <span className="font-heading text-h4 font-bold text-[--text-primary]">
          {totalArea.toLocaleString()} sqft
        </span>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("developer_label")}
        </span>
        <Link
          href={`/developer/${developerSlug}`}
          className="w-fit font-body text-base font-medium text-[--primary-main] no-underline hover:underline"
        >
          {developerName}
        </Link>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <PrimaryCtaLink href={`/properties-list?development=${developmentSlug}`}>
        {t("see_properties")}
      </PrimaryCtaLink>
    </div>
  );
}
