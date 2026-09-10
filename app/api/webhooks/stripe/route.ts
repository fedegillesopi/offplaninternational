import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { findPlanByPriceId, getMaxProperties } from "@/lib/plans";
import { inactivateOldestProperties } from "@/lib/subscriptions";
import type { PlanTier } from "@/lib/plans";
import type { UserRole } from "@/lib/types";

type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "incomplete";

function mapStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
    case "paused":
      return "cancelled";
    case "incomplete":
      return "incomplete";
    default:
      return "cancelled";
  }
}

function customerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (typeof customer === "string") return customer;
  if (customer && "id" in customer) return customer.id;
  return null;
}

function tsToIso(ts: number | null | undefined): string | null {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const supabase = createServiceClient();

  const firstItem = sub.items?.data?.[0];
  const priceId = firstItem?.price?.id ?? null;
  const planMatch = priceId ? findPlanByPriceId(priceId) : null;
  const status = mapStatus(sub.status);
  const periodStart = tsToIso(firstItem?.current_period_start);
  const periodEnd = tsToIso(firstItem?.current_period_end);

  const { data: existingBySubId } = await supabase
    .from("subscriptions")
    .select("id, user_id, role, plan_name")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();

  const userId =
    typeof sub.metadata?.userId === "string"
      ? sub.metadata.userId
      : existingBySubId?.user_id ?? null;

  if (!userId) {
    return;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("operating_country, country_of_residence")
    .eq("id", userId)
    .maybeSingle();
  const country = profile?.operating_country || profile?.country_of_residence || "";

  const role = (planMatch?.role ??
    existingBySubId?.role ??
    sub.metadata?.role) as UserRole | undefined;
  const tier = (planMatch?.plan.tier ??
    sub.metadata?.tier ??
    existingBySubId?.plan_name) as PlanTier | undefined;

  if (!role || !tier) {
    return;
  }

  const values = {
    plan_name: tier,
    status,
    stripe_customer_id: customerId(sub.customer),
    stripe_subscription_id: sub.id,
    stripe_price_id: priceId,
    current_period_start: periodStart,
    current_period_end: periodEnd,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };

  if (existingBySubId) {
    await supabase.from("subscriptions").update(values).eq("id", existingBySubId.id);
    return;
  }

  if (status === "incomplete") {
    return;
  }

  const { data: activeRow } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (activeRow) {
    await supabase.from("subscriptions").update({ ...values, user_id: userId, country }).eq("id", activeRow.id);
    return;
  }

  await supabase.from("subscriptions").insert({
    ...values,
    user_id: userId,
    role,
    country,
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createServiceClient();
  const userId =
    typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : typeof session.metadata?.userId === "string"
        ? session.metadata.userId
        : null;
  const customer = customerId(session.customer);
  if (!userId || !customer) return;
  await supabase
    .from("user_profiles")
    .update({ stripe_customer_id: customer })
    .eq("id", userId);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createServiceClient();
  const parentSub = invoice.parent?.subscription_details?.subscription;
  const subId =
    typeof parentSub === "string" ? parentSub : parentSub?.id ?? null;
  if (!subId) return;
  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("stripe_subscription_id", subId);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, user_id, role")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!existing) return;

  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancel_at_period_end: true })
    .eq("id", existing.id);

  const role = (existing.role ?? sub.metadata?.role) as UserRole | undefined;
  if (!role) return;

  const { data: activeFree } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", existing.user_id)
    .eq("status", "active")
    .maybeSingle();

  if (!activeFree) {
    await supabase.from("subscriptions").insert({
      user_id: existing.user_id,
      role,
      plan_name: "free" as PlanTier,
      country: "",
      status: "active" as SubscriptionStatus,
    });
  }

  await inactivateOldestProperties(
    existing.user_id,
    getMaxProperties(role, "free"),
    supabase,
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await syncSubscription(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
    }
  } catch (e) {
    console.error("Stripe webhook handler:", e);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}