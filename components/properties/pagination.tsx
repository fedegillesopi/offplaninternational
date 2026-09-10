import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildQueryString, type PropertyFilters } from "@/lib/filter-options";
import { cn } from "@/lib/utils";

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

const linkClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-sm border border-transparent px-2 font-body text-sm font-regular text-[--text-primary] transition-colors hover:border-[--primary-main] hover:text-[--primary-main]";
const activeClass =
  "border-[--primary-main] bg-[--primary-light] font-medium text-[--primary-dark]";
const disabledClass = "cursor-default opacity-40";

export async function Pagination({
  filters,
  page,
  totalPages,
}: {
  filters: PropertyFilters;
  page: number;
  totalPages: number;
}) {
  const t = await getTranslations("properties");
  if (totalPages <= 1) return null;

  const href = (p: number) => `/properties?${buildQueryString(filters, p)}`;

  return (
    <nav className="mt-2 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass} aria-label={t("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, disabledClass)} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        typeof p === "number" ? (
          <Link
            key={i}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(linkClass, p === page && activeClass)}
          >
            {p}
          </Link>
        ) : (
          <span key={i} className="px-1 font-body text-sm text-[--grey-300]">
            {p}
          </span>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkClass} aria-label={t("next")}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, disabledClass)} aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}