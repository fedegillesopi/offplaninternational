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

  const subscriptionData = subscription
    ? {
        plan_name: subscription.plan_name,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }
    : null;

  return (
    <BillingPage
      currentPlan={currentPlan ?? null}
      subscription={subscriptionData}
      propertyCount={propertyCount}
      allPlans={allPlans}
    />
  );
}