import { createClient } from "@/lib/supabase/server";
import type { BrokerProfile } from "@/lib/types";

export interface BrokerDetailData {
  id: string;
  userProfileId: string;
  name: string;
  slug: string;
  profileImage: string;
  personalUrl: string;
  description: string;
  location: string;
  emailPublic: string;
  phone: string;
  whatsapp: string;
  closedTransactions: number;
}

type BrokerRow = BrokerProfile;

function toDetailData(row: BrokerRow): BrokerDetailData {
  return {
    id: row.id,
    userProfileId: row.user_profile_id,
    name: row.name,
    slug: row.slug,
    profileImage: row.profile_image ?? "",
    personalUrl: row.personal_url ?? "",
    description: row.description ?? "",
    location: [row.country, row.city].filter(Boolean).join(", "),
    emailPublic: row.email_public ?? "",
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    closedTransactions: row.closed_transactions ?? 0,
  };
}

export async function getBrokerBySlug(
  slug: string,
): Promise<BrokerDetailData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("broker_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_verified", true)
    .maybeSingle();

  if (error) {
    console.error("getBrokerBySlug:", error.message);
    return null;
  }

  if (!data) return null;

  return toDetailData(data as unknown as BrokerRow);
}

export async function getMyBroker(
  userProfileId: string,
): Promise<BrokerProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("broker_profiles")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .maybeSingle();

  if (error) {
    console.error("getMyBroker:", error.message);
    return null;
  }

  return data as BrokerProfile | null;
}
