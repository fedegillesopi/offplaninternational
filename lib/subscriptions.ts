import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import type { PlanTier } from "@/lib/plans";
import { getMaxProperties, type Plan } from "@/lib/plans";

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

export async function getActiveLimits(
  userId: string,
): Promise<{ maxProperties: number; tier: PlanTier; role: UserRole } | null> {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return null;
  const maxProperties = getMaxProperties(
    subscription.role,
    subscription.plan_name,
  );
  return {
    maxProperties,
    tier: subscription.plan_name,
    role: subscription.role,
  };
}

const GRACE_DAYS = 3;

function isPastDueExpired(subscription: Subscription): boolean {
  if (subscription.status !== "past_due") return false;
  const ref = subscription.current_period_end
    ? new Date(subscription.current_period_end)
    : new Date(subscription.updated_at);
  const graceMs = GRACE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() > ref.getTime() + graceMs;
}

export async function getEffectiveLimits(
  userId: string,
): Promise<{ maxProperties: number; tier: PlanTier; role: UserRole } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  const sub = data as Subscription;

  const freeProps = getMaxProperties(sub.role, "free");

  if (sub.status === "active") {
    return {
      maxProperties: getMaxProperties(sub.role, sub.plan_name),
      tier: sub.plan_name,
      role: sub.role,
    };
  }

  if (sub.status === "past_due") {
    if (isPastDueExpired(sub)) {
      return { maxProperties: freeProps, tier: "free", role: sub.role };
    }
    return {
      maxProperties: getMaxProperties(sub.role, sub.plan_name),
      tier: sub.plan_name,
      role: sub.role,
    };
  }

  return { maxProperties: freeProps, tier: "free", role: sub.role };
}

export async function canAddMoreProperties(userId: string): Promise<{
  allowed: boolean;
  used: number;
  maxProperties: number | null;
  error?: string;
}> {
  const limits = await getEffectiveLimits(userId);
  if (!limits) {
    return { allowed: true, used: 0, maxProperties: null };
  }
  const used = await countActiveProperties(userId);
  if (limits.maxProperties === -1) {
    return { allowed: true, used, maxProperties: -1 };
  }
  const allowed = used < limits.maxProperties;
  return {
    allowed,
    used,
    maxProperties: limits.maxProperties,
    error: allowed
      ? undefined
      : `You have reached the limit of ${limits.maxProperties} active properties on your ${planLabel(limits.tier)} plan. Upgrade at /app/billing.`,
  };
}

function planLabel(tier: PlanTier): string {
  if (tier === "free") return "Free";
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export async function inactivateOldestProperties(
  userProfileId: string,
  maxAllowed: number,
  client?: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const db = client ?? (await createClient());
  const { data, error } = await db
    .from("properties")
    .select("id")
    .eq("listed_by_id", userProfileId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error || !data) return 0;
  const excess = data.slice(0, Math.max(0, data.length - maxAllowed));
  if (excess.length === 0) return 0;
  const { error: updateError } = await db
    .from("properties")
    .update({ is_active: false })
    .in("id", excess.map((r) => r.id));
  if (updateError) {
    console.error("inactivateOldestProperties:", updateError.message);
    return 0;
  }
  return excess.length;
}

export type { Plan };
