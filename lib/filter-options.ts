export interface FilterOption {
  value: string;
  label: string;
}

export const locationOptions: FilterOption[] = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
];

export const categoryOptionDefs = [
  "apartment", "villa", "townhouse", "penthouse",
  "studio", "commercial", "land",
] as const;

export const priceOptionDefs = [
  "under_500k", "500k_1m", "1m_2m", "2m_5m", "above_5m",
] as const;

export const statusOptionDefs = [
  "planned", "construction", "ready",
] as const;

export const amenityOptionDefs = [
  "pool", "gym", "parking", "security", "concierge",
  "garden", "balcony", "spa", "kids_play", "pet_friendly",
  "smart_home", "sea_view",
] as const;

export const developerOptions: FilterOption[] = [
  { value: "arada", label: "Arada Developments" },
  { value: "saas", label: "Saas Properties" },
  { value: "rijas", label: "Rijas Dubai" },
  { value: "acube", label: "Acube Developers" },
  { value: "mered", label: "Mered Developments" },
  { value: "wadan", label: "Wadan Developments" },
  { value: "opi", label: "Off Plan International" },
];

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

export function resolveOptions(
  defs: readonly string[],
  t: (key: string) => string,
  prefix = "filter_options",
): FilterOption[] {
  return defs.map((key) => ({
    value: key,
    label: t(`${prefix}.${key}`),
  }));
}
