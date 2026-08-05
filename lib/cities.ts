import { createClient } from "@/lib/supabase/server";

export async function getCitiesByCountry(country: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cities")
    .select("name")
    .eq("country", country)
    .order("name");

  if (error) {
    console.error("getCitiesByCountry:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.name as string);
}
