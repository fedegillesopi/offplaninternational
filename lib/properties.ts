import { createClient } from "@/lib/supabase/server";
import type { PropertyData } from "@/lib/types";

const DEFAULT_LOCALE = "ae";

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  listed_by_id: string;
  listed_by_type: string;
  developer_id: string | null;
  development_id: string | null;
  status: string;
  country: string;
  city: string;
  community: string | null;
  address: string | null;
  subcategory: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  area_sqm: number | null;
  floor: number | null;
  has_balcony: boolean;
  has_garden: boolean;
  price: number;
  currency: string;
  deposit_percentage: number | null;
  deposit_amount: number | null;
  has_post_handover: boolean;
  handover_date: string | null;
  amenities: string[] | null;
  images: string[] | null;
  cover_image: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  developers: { name: string; slug: string; logo_url: string | null } | null;
  broker_profiles: { name: string; slug: string } | null;
  user_profiles: { full_name: string } | null;
  developments: {
    name: string;
    slug: string;
    amenities: string[] | null;
  } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatHandoverDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `Q${q} - ${d.getFullYear()}`;
}

interface CommunityMeta {
  name: string;
  description: string | null;
}

async function resolveCommunityData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slugs: string[],
  locale: string,
): Promise<Record<string, CommunityMeta>> {
  const unique = Array.from(new Set(slugs.filter(Boolean)));
  if (unique.length === 0) return {};

  const { data, error } = await supabase
    .from("communities")
    .select("slug, community_translations(locale, name, short_description, description)")
    .in("slug", unique);

  if (error) return {};

  const map: Record<string, CommunityMeta> = {};
  for (const row of (data ?? []) as unknown as {
    slug: string;
    community_translations: {
      locale: string;
      name: string;
      short_description: string | null;
      description: string | null;
    }[] | null;
  }[]) {
    const tx = row.community_translations ?? [];
    const selected =
      tx.find((t) => t.locale === locale) ??
      tx.find((t) => t.locale === DEFAULT_LOCALE) ??
      tx[0];
    if (!selected) continue;
    map[row.slug] = {
      name: selected.name ?? row.slug,
      description:
        selected.short_description?.trim() || selected.description?.trim() || null,
    };
  }
  return map;
}

async function resolveCountriesFromCities(
  supabase: Awaited<ReturnType<typeof createClient>>,
  cities: string[],
): Promise<Record<string, string>> {
  const unique = Array.from(new Set(cities.filter(Boolean)));
  if (unique.length === 0) return {};

  const { data, error } = await supabase
    .from("cities")
    .select("name, country")
    .in("name", unique);

  if (error) return {};

  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { name: string; country: string }[]) {
    if (row.country) map[row.name] = row.country;
  }
  return map;
}

async function resolveAmenityNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slugs: string[],
): Promise<Record<string, string>> {
  const unique = Array.from(new Set(slugs.filter(Boolean)));
  if (unique.length === 0) return {};

  const { data, error } = await supabase
    .from("property_amenities")
    .select("slug, name")
    .in("slug", unique);

  if (error) return {};

  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { slug: string; name: string }[]) {
    map[row.slug] = row.name;
  }
  return map;
}

function toPropertyData(
  row: PropertyRow,
  brokerName: string,
  brokerSlug: string,
  communityData: Record<string, CommunityMeta>,
  countryFallback: Record<string, string>,
  amenityNames: Record<string, string>,
): PropertyData {
  const dev = row.developers;
  const devt = row.developments;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    descriptionFull: row.description ?? "",

    listed_by_id: row.listed_by_id,
    listed_by_type: row.listed_by_type as PropertyData["listed_by_type"],
    developer_id: row.developer_id,
    development_id: row.development_id,

    status: row.status as PropertyData["status"],
    country: row.country || countryFallback[row.city ?? ""] || "",
    city: row.city,
    community: row.community ?? "",
    address: row.address,

    subcategory: row.subcategory ?? "",
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    area: row.area_sqft ?? 0,
    area_sqft: row.area_sqft,
    area_sqm: row.area_sqm,
    floor: row.floor,
    has_balcony: row.has_balcony,
    has_garden: row.has_garden,

    price: row.price,
    currency: row.currency as PropertyData["currency"],
    deposit_percentage: row.deposit_percentage,
    deposit_amount: row.deposit_amount,

    has_post_handover: row.has_post_handover,
    handover_date: row.handover_date,
    handoverDate: formatHandoverDate(row.handover_date),

    images: row.images ?? [],
    cover_image: row.cover_image,
    amenities: row.amenities ?? [],
    amenity_names: amenityNames,
    tags: row.tags ?? [],

    is_featured: row.is_featured,
    is_active: row.is_active,
    addedOn: formatDate(row.created_at),
    created_at: row.created_at,
    updated_at: row.updated_at,

    developer_name: dev?.name ?? "",
    developer_slug: dev?.slug ?? "",
    developer_logo: dev?.logo_url ?? "",
    broker_name: brokerName,
    broker_slug: brokerSlug,
    private_seller_name:
      row.listed_by_type === "private_seller"
        ? row.user_profiles?.full_name ?? ""
        : "",
    development_name: devt?.name ?? "",
    development_slug: devt?.slug ?? "",
    development_total_area: 0,
    development_amenities: devt?.amenities ?? [],
    community_name:
      communityData[row.community ?? ""]?.name ?? row.community ?? "",
    community_slug: row.community ?? "",
    community_total_area: 0,
    community_description: communityData[row.community ?? ""]?.description ?? null,

    phone: "",
    whatsapp: "",
  };
}

export async function getPropertyBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<PropertyData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getPropertyBySlug:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as PropertyRow;

  let brokerName = "";
  let brokerSlug = "";
  if (row.listed_by_type === "broker") {
    const { data: broker } = await supabase
      .from("broker_profiles")
      .select("name, slug")
      .eq("user_profile_id", row.listed_by_id)
      .maybeSingle();
    brokerName = broker?.name ?? "";
    brokerSlug = broker?.slug ?? "";
  }

  const communityData = await resolveCommunityData(supabase, [row.community ?? ""], locale);
  const countryFallback = await resolveCountriesFromCities(supabase, [row.city ?? ""]);
  const amenityNames = await resolveAmenityNames(supabase, row.amenities ?? []);
  return toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames);
}

export async function getRelatedProperties(
  currentId: string,
): Promise<PropertyData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("is_active", true)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) return [];

  const rows = data as unknown as PropertyRow[];
  const communityData = await resolveCommunityData(
    supabase,
    rows.map((r) => r.community ?? ""),
    DEFAULT_LOCALE,
  );
  const countryFallback = await resolveCountriesFromCities(
    supabase,
    rows.map((r) => r.city ?? ""),
  );
  const amenityNames = await resolveAmenityNames(
    supabase,
    rows.flatMap((r) => r.amenities ?? []),
  );
  const results: PropertyData[] = [];

  for (const row of rows) {
    let brokerName = "";
    let brokerSlug = "";
    if (row.listed_by_type === "broker") {
      const { data: broker } = await supabase
        .from("broker_profiles")
        .select("name, slug")
        .eq("user_profile_id", row.listed_by_id)
        .maybeSingle();
      brokerName = broker?.name ?? "";
      brokerSlug = broker?.slug ?? "";
    }
    results.push(toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames));
  }

  return results;
}

export async function getProperties(): Promise<PropertyData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as unknown as PropertyRow[];
  const communityData = await resolveCommunityData(
    supabase,
    rows.map((r) => r.community ?? ""),
    DEFAULT_LOCALE,
  );
  const countryFallback = await resolveCountriesFromCities(
    supabase,
    rows.map((r) => r.city ?? ""),
  );
  const amenityNames = await resolveAmenityNames(
    supabase,
    rows.flatMap((r) => r.amenities ?? []),
  );
  const results: PropertyData[] = [];

  for (const row of rows) {
    let brokerName = "";
    let brokerSlug = "";
    if (row.listed_by_type === "broker") {
      const { data: broker } = await supabase
        .from("broker_profiles")
        .select("name, slug")
        .eq("user_profile_id", row.listed_by_id)
        .maybeSingle();
      brokerName = broker?.name ?? "";
      brokerSlug = broker?.slug ?? "";
    }
    results.push(toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames));
  }

  return results;
}

export async function getBrokerActiveProperties(
  userProfileId: string,
  brokerName: string,
  brokerSlug: string,
  limit = 5,
): Promise<PropertyData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("listed_by_id", userProfileId)
    .eq("listed_by_type", "broker")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const rows = data as unknown as PropertyRow[];
  const communityData = await resolveCommunityData(
    supabase,
    rows.map((r) => r.community ?? ""),
    DEFAULT_LOCALE,
  );
  const countryFallback = await resolveCountriesFromCities(
    supabase,
    rows.map((r) => r.city ?? ""),
  );
  const amenityNames = await resolveAmenityNames(
    supabase,
    rows.flatMap((r) => r.amenities ?? []),
  );
  return rows.map((row) =>
    toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames),
  );
}

export async function getMyProperties(
  userProfileId: string,
): Promise<PropertyData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("listed_by_id", userProfileId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as unknown as PropertyRow[];
  const communityData = await resolveCommunityData(
    supabase,
    rows.map((r) => r.community ?? ""),
    DEFAULT_LOCALE,
  );
  const countryFallback = await resolveCountriesFromCities(
    supabase,
    rows.map((r) => r.city ?? ""),
  );
  const amenityNames = await resolveAmenityNames(
    supabase,
    rows.flatMap((r) => r.amenities ?? []),
  );
  const results: PropertyData[] = [];

  for (const row of rows) {
    let brokerName = "";
    let brokerSlug = "";
    if (row.listed_by_type === "broker") {
      const { data: broker } = await supabase
        .from("broker_profiles")
        .select("name, slug")
        .eq("user_profile_id", row.listed_by_id)
        .maybeSingle();
      brokerName = broker?.name ?? "";
      brokerSlug = broker?.slug ?? "";
    }
    results.push(toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames));
  }

  return results;
}

export async function getMyProperty(
  userProfileId: string,
  propertyId: string,
  locale: string = DEFAULT_LOCALE,
): Promise<PropertyData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities )
    `)
    .eq("id", propertyId)
    .eq("listed_by_id", userProfileId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as PropertyRow;

  let brokerName = "";
  let brokerSlug = "";
  if (row.listed_by_type === "broker") {
    const { data: broker } = await supabase
      .from("broker_profiles")
      .select("name, slug")
      .eq("user_profile_id", row.listed_by_id)
      .maybeSingle();
    brokerName = broker?.name ?? "";
    brokerSlug = broker?.slug ?? "";
  }

  const communityData = await resolveCommunityData(supabase, [row.community ?? ""], locale);
  const countryFallback = await resolveCountriesFromCities(supabase, [row.city ?? ""]);
  const amenityNames = await resolveAmenityNames(supabase, row.amenities ?? []);
  return toPropertyData(row, brokerName, brokerSlug, communityData, countryFallback, amenityNames);
}
