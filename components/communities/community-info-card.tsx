import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface CommunityInfoCardProps {
  averagePriceRange: string;
  developerName: string;
  developerSlug: string;
  communitySlug: string;
}

export async function CommunityInfoCard({
  averagePriceRange,
  developerName,
  developerSlug,
  communitySlug,
}: CommunityInfoCardProps) {
  const t = await getTranslations("community_detail");

  return (
    <div className="sticky top-4 flex flex-col gap-6 rounded-2 bg-white p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("average_price_range")}
        </span>
        <span className="font-heading text-h3 font-bold text-[--text-primary]">
          {averagePriceRange}
        </span>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("main_developer")}
        </span>
        <Link
          href={`/developer/${developerSlug}`}
          className="w-fit font-body text-base font-medium text-[--primary-main] no-underline hover:underline"
        >
          {developerName}
        </Link>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <Link
        href={`/properties-list?community=${communitySlug}`}
        className="inline-flex items-center justify-center gap-2 rounded-1 bg-[--primary-main] px-4 py-3 font-body text-base font-medium no-underline transition-colors hover:bg-[--primary-dark] text-white"
      >
        {t("see_properties")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
