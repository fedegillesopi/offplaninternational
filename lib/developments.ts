import { createClient } from "@/lib/supabase/server";
import type { Development, PropertyCurrency } from "@/lib/types";
import { stripHtmlToText } from "@/lib/utils";

export interface DevelopmentCardData {
  name: string;
  description: string;
  image: string;
  logo: string;
  location: string;
  slug: string;
}

export interface DevelopmentDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  amenities: string[];
  location: string;
  developerName: string;
  developerSlug: string;
  developerLogo: string;
  startingPrice: number;
  startingPriceCurrency: PropertyCurrency;
  propertyTypes: string[];
  totalArea: number;
  community: string;
  handoverDate: string | null;
}

type DevelopmentRow = Development & {
  developers: { name: string; logo_url: string | null; slug: string } | null;
};

function toCardData(row: DevelopmentRow): DevelopmentCardData {
  const dev = row.developers;
  return {
    name: row.name,
    description: row.description ? stripHtmlToText(row.description) : "",
    image: row.cover_image ?? "",
    logo: dev?.logo_url ?? "",
    location: [row.country, row.city, row.community].filter(Boolean).join(", "),
    slug: row.slug,
  };
}

function toDetailData(row: DevelopmentRow): DevelopmentDetailData {
  const dev = row.developers;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.cover_image ?? "",
    images: row.images ?? [],
    amenities: row.amenities ?? [],
    location: [row.country, row.city, row.community].filter(Boolean).join(", "),
    developerName: dev?.name ?? "",
    developerSlug: dev?.slug ?? "",
    developerLogo: dev?.logo_url ?? "",
    startingPrice: row.starting_price ?? 0,
    startingPriceCurrency: (row.starting_price_currency as PropertyCurrency) ?? "AED",
    propertyTypes: row.property_types ?? [],
    totalArea: row.total_area ?? 0,
    community: row.community ?? "",
    handoverDate: row.handover_date,
  };
}

export async function getDevelopments(): Promise<DevelopmentCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("developments")
    .select("*, developers(name, logo_url, slug)")
    .eq("is_active", true);

  if (error) {
    console.error("getDevelopments:", error.message);
    return [];
  }

  return (data as unknown as DevelopmentRow[])
    .map(toCardData)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export async function getDevelopmentBySlug(
  slug: string,
): Promise<DevelopmentDetailData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("developments")
    .select("*, developers(name, logo_url, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getDevelopmentBySlug:", error.message);
    return null;
  }

  if (!data) return null;

  return toDetailData(data as unknown as DevelopmentRow);
}

export async function getMyDevelopments(
  userProfileId: string,
): Promise<Development[]> {
  const supabase = await createClient();

  const { data: dev } = await supabase
    .from("developers")
    .select("id")
    .eq("user_profile_id", userProfileId)
    .maybeSingle();

  if (!dev) return [];

  const { data, error } = await supabase
    .from("developments")
    .select("*")
    .eq("developer_id", dev.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("getMyDevelopments:", error.message);
    return [];
  }

  return (data ?? []) as Development[];
}

export async function getMyDevelopment(
  userProfileId: string,
  developmentId: string,
): Promise<Development | null> {
  const supabase = await createClient();

  const { data: dev } = await supabase
    .from("developers")
    .select("id")
    .eq("user_profile_id", userProfileId)
    .maybeSingle();

  if (!dev) return null;

  const { data, error } = await supabase
    .from("developments")
    .select("*")
    .eq("id", developmentId)
    .eq("developer_id", dev.id)
    .maybeSingle();

  if (error) {
    console.error("getMyDevelopment:", error.message);
    return null;
  }

  return data as Development | null;
}
