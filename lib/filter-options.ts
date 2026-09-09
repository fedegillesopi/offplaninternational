export interface FilterOption {
  value: string;
  label: string;
}

export const EMPTY_FILTERS: PropertyFilters = {
  location: "",
  categories: [],
  price: "",
  status: "",
  beds: "",
  baths: "",
  developer: "",
  amenities: [],
};

export interface PropertyFilters {
  location: string;
  categories: string[];
  price: string;
  status: string;
  beds: string;
  baths: string;
  developer: string;
  amenities: string[];
}

export interface FilterOptions {
  locations: FilterOption[];
  categories: FilterOption[];
  prices: FilterOption[];
  statuses: FilterOption[];
  beds: FilterOption[];
  baths: FilterOption[];
  developers: FilterOption[];
  amenities: FilterOption[];
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): PropertyFilters {
  const single = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const multi = (key: string) => {
    const value = params[key];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value) return value.split(",");
    return [];
  };

  return {
    location: single("location"),
    categories: multi("category"),
    price: single("price"),
    status: single("status"),
    beds: single("beds"),
    baths: single("baths"),
    developer: single("developer"),
    amenities: multi("amenities"),
  };
}

export function buildQueryString(filters: PropertyFilters, page = 1): string {
  const q = new URLSearchParams();
  if (filters.location) q.set("location", filters.location);
  if (filters.categories.length > 0) q.set("category", filters.categories.join(","));
  if (filters.price) q.set("price", filters.price);
  if (filters.status) q.set("status", filters.status);
  if (filters.beds) q.set("beds", filters.beds);
  if (filters.baths) q.set("baths", filters.baths);
  if (filters.developer) q.set("developer", filters.developer);
  if (filters.amenities.length > 0) q.set("amenities", filters.amenities.join(","));
  if (page > 1) q.set("page", String(page));
  return q.toString();
}

export function getBedOptions(): FilterOption[] {
  return Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
}

export function getBathOptions(): FilterOption[] {
  return Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
}

export function cleanStatusLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
});

function niceStep(range: number): number {
  if (range <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
  const normalized = range / magnitude;
  const step = normalized < 1.5 ? 1 : normalized < 3.5 ? 2 : normalized < 7.5 ? 5 : 10;
  return step * magnitude;
}

export function priceBands(min: number, max: number): FilterOption[] {
  if (max <= min) return [];

  const span = max - min;
  const step = niceStep(span / 4);
  const start = Math.floor(min / step) * step;

  const bands: FilterOption[] = [];
  for (let i = 0; i < 4; i++) {
    const low = start + i * step;
    const high = start + (i + 1) * step;
    const label =
      i === 0
        ? `Under ${compactFmt.format(high)}`
        : `${compactFmt.format(low)} - ${compactFmt.format(high)}`;
    bands.push({ value: `${low}-${high}`, label });
  }

  const above = start + 4 * step;
  bands.push({
    value: `${above}-`,
    label: `Above ${compactFmt.format(above)}`,
  });

  return bands;
}