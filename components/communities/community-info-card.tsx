import { getTranslations } from "next-intl/server";
import { PrimaryCtaLink } from "@/components/shared/primary-cta-link";

interface CommunityInfoCardProps {
  averagePriceRange: string | null;
  communitySlug: string;
}

export async function CommunityInfoCard({
  averagePriceRange,
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

      <PrimaryCtaLink href={`/properties-list?community=${communitySlug}`}>
        {t("see_properties")}
      </PrimaryCtaLink>
    </div>
  );
}
