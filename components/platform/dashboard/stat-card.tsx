import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  footnote?: string;
  disabled?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  footnote,
  disabled,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
      {href && (
        <Link
          href={href}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}