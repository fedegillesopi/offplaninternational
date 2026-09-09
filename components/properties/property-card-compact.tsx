import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Bed, Bath, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CurrencyPrice } from "@/components/shared/currency-price";
import { stripHtmlToText } from "@/lib/utils";
import type { PropertyData } from "@/lib/types";

export async function PropertyCardCompact({
  property,
}: {
  property: PropertyData;
}) {
  const t = await getTranslations("properties");
  const coverSrc = property.cover_image ?? property.images[0];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] lg:w-[350px]">
      <Link
        href={`/property/${property.slug}`}
        className="relative block h-44 w-full shrink-0"
      >
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[--grey-50] font-body text-sm text-[--grey-300]">
            {property.title}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-1 font-body text-sm font-light text-[--text-primary]">
          <span className="font-medium text-[--primary-main]">
            {property.subcategory}
          </span>
          <span className="text-[--grey-200]">|</span>
          <Bed className="h-4 w-4" />
          <span className="text-sm font-medium">{property.beds}</span>
          <Bath className="h-4 w-4" />
          <span className="text-sm font-medium">{property.baths}</span>
          <span className="text-[--grey-200]">|</span>
          <span className="text-[--text-primary]">
            {t("area_label")} {property.area} sqft
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-baseline gap-1">
            <CurrencyPrice
              basePrice={property.price}
              baseCurrency={property.currency}
              className="font-heading text-4xl font-bold text-[--text-primary]"
            />
          </div>
          <div className="flex items-center gap-1 font-body text-sm font-light text-[--grey-300]">
            <MapPin className="h-4 w-4 text-[--primary-main]" />
            {property.country && (
              <>
                <span>{property.country}</span>
                <span>,</span>
              </>
            )}
            <span>{property.city}</span>
          </div>
          {property.developer_logo && (
            <Image
              src={property.developer_logo}
              alt={property.developer_name}
              width={60}
              height={30}
              className="hidden h-auto w-[64px] rounded-1 p-1.5 shadow-lg lg:block"
            />
          )}
        </div>

        <p className="line-clamp-2 font-body text-sm font-regular text-[--text-primary]">
          {stripHtmlToText(property.description)}
        </p>
      </div>
    </div>
  );
}