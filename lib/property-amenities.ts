import { createClient } from "@/lib/supabase/server";

interface AmenityRow {
  id: string;
  slug: string;
  name: string;
  icon_url: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyAmenity {
  id: string;
  slug: string;
  name: string;
  icon_url: string | null;
  category: string | null;
}

function toAmenity(row: AmenityRow): PropertyAmenity {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon_url: row.icon_url,
    category: row.category,
  };
}

export async function getPropertyAmenities(): Promise<PropertyAmenity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_amenities")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("getPropertyAmenities:", error.message);
    return [];
  }

  return (data as unknown as AmenityRow[]).map(toAmenity);
}
