import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Development } from "@/lib/types";
import { stripHtmlToText } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentDevelopments({
  developments,
}: {
  developments: Development[];
}) {
  if (developments.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold">Recent developments</h2>
        <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No developments yet</p>
          <Link href="/app/developments/new" className="mt-4">
            <Button>Create your first development</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Recent developments</h2>
      <div className="mt-3 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Development</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Starting Price</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Property Types</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {developments.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    {d.description && (
                      <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                        {stripHtmlToText(d.description)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      d.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {d.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {d.starting_price !== null && d.starting_price !== undefined
                    ? `${d.starting_price_currency ?? "AED"} ${d.starting_price.toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {[d.country, d.city, d.community].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {d.property_types?.length ? d.property_types.join(", ") : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(d.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}