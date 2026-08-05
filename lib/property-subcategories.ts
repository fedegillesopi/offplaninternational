import { createClient } from "@/lib/supabase/server";

interface SubcategoryRow {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertySubcategory {
  id: string;
  slug: string;
  name: string;
  category: string | null;
}

function toSubcategory(row: SubcategoryRow): PropertySubcategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
  };
}

export async function getPropertySubcategories(): Promise<PropertySubcategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_subcategories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("getPropertySubcategories:", error.message);
    return [];
  }

  return (data as unknown as SubcategoryRow[]).map(toSubcategory);
}
