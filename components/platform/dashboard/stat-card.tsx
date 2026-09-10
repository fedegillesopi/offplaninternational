import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
}

export function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
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