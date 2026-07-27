import { Link } from "@/i18n/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-1 font-body text-sm font-light text-[--grey-300]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-[--grey-200]">/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-[--primary-main] no-underline hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[--text-primary]" : ""}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
