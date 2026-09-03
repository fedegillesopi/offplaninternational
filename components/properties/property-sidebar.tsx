import { getTranslations } from "next-intl/server";
import { CurrencyPrice } from "@/components/shared/currency-price";
import { Link } from "@/i18n/navigation";
import { Phone, MessageCircle } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface PropertySidebarProps {
  price: number;
  currency: string;
  developmentName: string;
  developmentSlug: string;
  sellerName: string;
  sellerSlug: string;
  listedByType: UserRole;
  phone: string;
  whatsapp: string;
}

export async function PropertySidebar({
  price,
  currency,
  developmentName,
  developmentSlug,
  sellerName,
  sellerSlug,
  listedByType,
  phone,
  whatsapp,
}: PropertySidebarProps) {
  const t = await getTranslations("property_detail");
  const sellerHref =
    listedByType === "broker" ? `/broker/${sellerSlug}` : `/developer/${sellerSlug}`;

  return (
    <div className="sticky top-4 flex flex-col gap-4 rounded-2 bg-white p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("off_plan_property_for_sale")}
        </span>
        <CurrencyPrice
          basePrice={price}
          baseCurrency={currency}
          className="font-heading text-h3 font-bold text-[--text-primary]"
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <div className="min-w-0 flex flex-col gap-1">
          <span className="font-body text-xs font-medium text-[--text-primary] tracking-wide">
            {t("development_label")}
          </span>
          {developmentSlug ? (
            <Link
              href={`/development/${developmentSlug}`}
              className="w-full truncate font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
            >
              {developmentName}
            </Link>
          ) : (
            <span className="w-full truncate font-body text-sm font-medium text-[--text-primary]">
              {developmentName || "—"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex flex-col gap-1">
          <span className="font-body text-xs font-medium text-[--text-primary] tracking-wide">
            {t("uploaded_by")}
          </span>
          {listedByType === "private_seller" ? (
            <span className="w-full truncate font-body text-sm font-medium text-[--text-primary]">
              {sellerName}
            </span>
          ) : (
            <Link
              href={sellerHref}
              className="w-full truncate font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
            >
              {sellerName}
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <a
          href={`tel:${phone}`}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
        >
          <Phone className="h-3 w-3" />
          {t("contact")}
        </a>
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
        >
          <MessageCircle className="h-3 w-3" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
