import { getTranslations } from "next-intl/server";
import { PrimaryCtaLink } from "@/components/shared/primary-cta-link";

interface DeveloperInfoCardProps {
  onTimeCompletion: number;
  email: string;
  phone: string;
  website: string;
  developerSlug: string;
}

function safeWebsite(url: string): string {
  if (!/^https?:\/\//i.test(url)) return "";
  try {
    return new URL(url).hostname ? url : "";
  } catch {
    return "";
  }
}

export async function DeveloperInfoCard({
  onTimeCompletion,
  email,
  phone,
  website,
  developerSlug,
}: DeveloperInfoCardProps) {
  const t = await getTranslations("developer_detail");
  const websiteUrl = safeWebsite(website);

  return (
    <div className="sticky top-4 flex flex-col gap-6 rounded-2 bg-white p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("on_time_completion")}
        </span>
        <span className="font-heading text-h3 font-bold text-[--text-primary]">
          {onTimeCompletion}%
        </span>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-row gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-body text-sm font-light text-[--grey-300]">
            {t("email")}
          </span>
          <span className="font-body text-sm font-medium text-[--text-primary] break-all">
            {email}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body text-sm font-light text-[--grey-300]">
            {t("phone")}
          </span>
          <span className="font-body text-sm font-medium text-[--text-primary]">
            {phone}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <div className="flex flex-col gap-1">
        <span className="font-body text-sm font-light text-[--grey-300]">
          {t("website")}
        </span>
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit font-body text-sm font-medium text-[--primary-main] no-underline hover:underline break-all"
          >
            {website}
          </a>
        ) : (
          <span className="w-fit font-body text-sm font-medium text-[--text-primary] break-all">
            {website}
          </span>
        )}
      </div>

      <div className="h-px w-full bg-[--grey-50]" />

      <PrimaryCtaLink href={`/properties-list?developer=${developerSlug}`}>
        {t("see_properties")}
      </PrimaryCtaLink>
    </div>
  );
}
