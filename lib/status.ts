export const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-gray-100 text-gray-600",
  off_market: "bg-red-100 text-red-800",
};

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}