import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Bed, Bath, MapPin, Phone, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CurrencyPrice } from "@/components/currency-price";
import type { PropertyData } from "@/lib/types";

export async function PropertyCard({ property }: { property: PropertyData }) {
  const t = await getTranslations("properties");

  return (
    <div className="flex w-full max-w-[1000px] flex-col overflow-hidden rounded-2 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] md:flex-row">
      <Link
        href={`/property/${property.slug}`}
        className="relative block h-[200px] w-full shrink-0 md:h-auto md:w-[320px] lg:w-[360px]"
      >
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 360px"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-2">
          <div className="flex items-center gap-1 font-body text-sm font-light text-[--text-primary]">
            <span className="font-medium text-[--primary-main]">{property.category}</span>
            <span className="text-[--grey-200]">|</span>
            <Bed className="h-2 w-2" />
            <span className="text-sm font-medium">{property.beds}</span>
            <Bath className="h-2 w-2" />
            <span className="text-sm font-medium">{property.baths}</span>
            <span className="hidden text-[--grey-200] md:inline">|</span>
            <span className="hidden text-[--text-primary] md:inline">
              {t("area_label")} {property.area} sqft
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-1">
            <div className="flex items-baseline gap-1">
              <CurrencyPrice
                basePrice={property.price}
                baseCurrency={property.currency}
                className="font-heading text-h4 font-bold text-[--text-primary]"
              />
            </div>
            <div className="flex items-center gap-1 font-body text-sm font-light text-[--grey-300]">
              <MapPin className="h-4 w-4 text-[--primary-main]" />
              <span>{property.city}</span>
              <span>{property.community}</span>
            </div>
            <Image
              src={property.developer_logo}
              alt={property.developer_name}
              width={60}
              height={30}
              className="h-auto w-[80px] rounded-1 p-2 shadow-lg"
            />
        </div>

        <p className="font-body text-base font-regular text-[--text-primary]">
          {property.description}
        </p>

        <div className="flex gap-2">
          <a
            href={`tel:${property.phone}`}
            className="inline-flex items-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
          >
            <Phone className="h-3 w-3" />
            {t("contact")}
          </a>
          <a
            href={`https://wa.me/${property.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
