import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

interface PrimaryCtaLinkProps {
  href: string;
  children: ReactNode;
}

export function PrimaryCtaLink({ href, children }: PrimaryCtaLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-1 bg-[--primary-main] px-4 py-3 font-body text-base font-medium text-white no-underline transition-colors hover:bg-[--primary-dark]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
