import { createClient } from "@/lib/supabase/server";

interface CommunityTagRow {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityTag {
  id: string;
  slug: string;
  name: string;
  category: string | null;
}

function toTag(row: CommunityTagRow): CommunityTag {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
  };
}

export async function getCommunityTags(): Promise<CommunityTag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_tags")
    .select("*")
    .order("name");

  if (error) {
    console.error("getCommunityTags:", error.message);
    return [];
  }

  return (data as unknown as CommunityTagRow[]).map(toTag);
}
