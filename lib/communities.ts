import { createClient } from "@/lib/supabase/server";

const DEFAULT_LOCALE = "en";

const ALLOWED_MAP_HOSTS = new Set(["www.google.com", "maps.google.com", "google.com"]);

function isAllowedMapUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_MAP_HOSTS.has(parsed.hostname.toLowerCase())) return null;
    if (parsed.pathname !== "/maps" && !parsed.pathname.startsWith("/maps/")) return null;
    return url;
  } catch {
    return null;
  }
}

interface CommunityTranslationRow {
  id: string;
  community_id: string;
  locale: string;
  name: string;
  short_description: string | null;
  description: string | null;
}

interface CommunityRow {
  id: string;
  slug: string;
  country: string | null;
  city: string | null;
  location: string | null;
  average_price_range: string | null;
  highlight_image: string | null;
  images: string[] | null;
  tags: string[] | null;
  google_map_url: string | null;
  developer_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  community_translations: CommunityTranslationRow[] | null;
}

export interface Community {
  id: string;
  slug: string;
  country: string | null;
  city: string | null;
  location: string | null;
  average_price_range: string | null;
  highlight_image: string | null;
  images: string[];
  tags: string[];
  google_map_url: string | null;
  developer_id: string | null;
  name: string;
  short_description: string | null;
  description: string | null;
}

function toCommunity(row: CommunityRow, locale: string): Community {
  const translations = row.community_translations ?? [];
  const tx =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LOCALE) ??
    translations[0];

  return {
    id: row.id,
    slug: row.slug,
    country: row.country,
    city: row.city,
    location: row.location,
    average_price_range: row.average_price_range,
    highlight_image: row.highlight_image,
    images: row.images ?? [],
    tags: row.tags ?? [],
    google_map_url: isAllowedMapUrl(row.google_map_url),
    developer_id: row.developer_id,
    name: tx?.name ?? row.slug,
    short_description: tx?.short_description ?? null,
    description: tx?.description ?? null,
  };
}

export async function getCommunities(locale: string): Promise<Community[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("communities")
    .select("*, community_translations(*)")
    .eq("is_active", true);

  if (error) {
    console.error("getCommunities:", error.message);
    return [];
  }

  return (data as unknown as CommunityRow[])
    .map((row) => toCommunity(row, locale))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

export async function getCommunityBySlug(
  slug: string,
  locale: string,
): Promise<Community | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("communities")
    .select("*, community_translations(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getCommunityBySlug:", error.message);
    return null;
  }

  if (!data) return null;

  return toCommunity(data as unknown as CommunityRow, locale);
}

export interface CommunityOption {
  slug: string;
  name: string;
  city: string | null;
}

export async function getCommunitiesByCountry(
  country: string,
  locale: string,
): Promise<CommunityOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("communities")
    .select("*, community_translations(*)")
    .eq("country", country)
    .eq("is_active", true)
    .order("slug");

  if (error) {
    console.error("getCommunitiesByCountry:", error.message);
    return [];
  }

  return (data as unknown as CommunityRow[])
    .map((row) => toCommunity(row, locale))
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .map((c) => ({ slug: c.slug, name: c.name, city: c.city }));
}
