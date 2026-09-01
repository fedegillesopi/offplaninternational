import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PropertyData } from "@/lib/types";

interface PropertyListProps {
  properties: PropertyData[];
}

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  reserved: "bg-yellow-100 text-yellow-800",
  off_market: "bg-gray-100 text-gray-600",
};

function formatPrice(price: number, currency: string): string {
  return `${currency} ${price.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No properties yet</p>
        <Link href="/app/properties/new">
          <Button className="mt-4">Create your first property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Specs</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-muted/30">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.subcategory || p.city}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status] ?? ""}`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">
                {formatPrice(p.price, p.currency)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {p.city}{p.community ? ` · ${p.community}` : ""}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {p.beds} bed · {p.baths} bath · {p.area.toLocaleString()} sqft
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(p.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/app/properties/${p.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
