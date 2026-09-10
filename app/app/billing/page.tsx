import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveSubscription, countActiveProperties } from "@/lib/subscriptions";
import { getPlan, getPlansForRole } from "@/lib/plans";
import { BillingPage } from "@/components/platform/billing-page";

export default async function BillingPageRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile?.role) redirect("/login");

  const role = profile.role as "developer" | "broker" | "private_seller";
  const [subscription, propertyCount] = await Promise.all([
    getActiveSubscription(user.id),
    countActiveProperties(user.id),
  ]);

  const allPlans = getPlansForRole(role);
  const currentPlan = subscription
    ? (getPlan(role, subscription.plan_name) ??
      allPlans.find((p) => p.tier === subscription.plan_name))
    : null;

  return (
    <BillingPage
      currentPlan={currentPlan ?? null}
      subscription={subscription}
      propertyCount={propertyCount}
      allPlans={allPlans}
    />
  );
}