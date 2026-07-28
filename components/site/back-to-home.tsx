import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface BackToHomeProps {
  href?: string;
  label?: string;
}

export function BackToHome({
  href = "/",
  label = "Back to Home",
}: BackToHomeProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-body text-base font-regular text-[--text-primary] no-underline transition-colors hover:text-[--primary-main]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
