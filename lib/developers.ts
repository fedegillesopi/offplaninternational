import { createClient } from "@/lib/supabase/server";
import type { Developer } from "@/lib/types";

export interface DeveloperCardData {
  name: string;
  description: string;
  image: string;
  logo: string;
  slug: string;
}

export interface DeveloperDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  logo: string;
  location: string;
  onTimeCompletion: number;
  email: string;
  phone: string;
  website: string;
}

type DeveloperRow = Developer;

function toCardData(row: DeveloperRow): DeveloperCardData {
  return {
    name: row.name,
    description: row.description ?? "",
    image: row.cover_image ?? "",
    logo: row.logo_url ?? "",
    slug: row.slug,
  };
}

function toDetailData(row: DeveloperRow): DeveloperDetailData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.cover_image ?? "",
    logo: row.logo_url ?? "",
    location: [row.country, row.city].filter(Boolean).join(", "),
    onTimeCompletion: row.on_time_completion ?? 0,
    email: row.email ?? "",
    phone: row.phone ?? "",
    website: row.website ?? "",
  };
}

export async function getDevelopers(): Promise<DeveloperCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("developers")
    .select("*")
    .eq("is_verified", true);

  if (error) {
    console.error("getDevelopers:", error.message);
    return [];
  }

  return (data as unknown as DeveloperRow[])
    .map(toCardData)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export async function getDeveloperBySlug(
  slug: string,
): Promise<DeveloperDetailData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("developers")
    .select("*")
    .eq("slug", slug)
    .eq("is_verified", true)
    .maybeSingle();

  if (error) {
    console.error("getDeveloperBySlug:", error.message);
    return null;
  }

  if (!data) return null;

  return toDetailData(data as unknown as DeveloperRow);
}

export async function getMyDeveloper(
  userProfileId: string,
): Promise<Developer | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("developers")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .maybeSingle();

  if (error) {
    console.error("getMyDeveloper:", error.message);
    return null;
  }

  return data as Developer | null;
}
