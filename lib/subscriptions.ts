import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import type { PlanTier } from "@/lib/plans";

export interface Subscription {
  id: string;
  user_id: string;
  role: UserRole;
  plan_name: PlanTier;
  status:
    | "active"
    | "cancelled"
    | "past_due"
    | "trialing"
    | "incomplete";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export async function getActiveSubscription(
  userId: string,
): Promise<Subscription | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as Subscription;
}

export async function countActiveProperties(
  userProfileId: string,
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("listed_by_id", userProfileId)
    .eq("is_active", true);

  if (error || count === null) return 0;
  return count;
}
