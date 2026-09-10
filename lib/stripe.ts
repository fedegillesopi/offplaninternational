import "server-only";

import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-08-26.dahlia",
      typescript: true,
    });
  }
  return stripeClient;
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<{ customerId: string; error: string | null }> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return { customerId: profile.stripe_customer_id, error: null };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { customerId: "", error: "Stripe is not configured." };
  }

  try {
    const customer = await getStripe().customers.create({ email });
    await supabase
      .from("user_profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);
    return { customerId: customer.id, error: null };
  } catch (e) {
    console.error("getOrCreateStripeCustomer:", e);
    return { customerId: "", error: "Could not create Stripe customer. Please try again." };
  }
}

export async function createCheckoutSession({
  customerId,
  userId,
  role,
  tier,
  priceId,
}: {
  customerId: string;
  userId: string;
  role: string;
  tier: string;
  priceId: string;
}): Promise<{ url: string | null; error: string | null }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId, role, tier },
      },
      client_reference_id: userId,
      success_url: `${appUrl}/app/billing?upgraded=true`,
      cancel_url: `${appUrl}/auth/payment`,
      allow_promotion_codes: true,
    });

    return { url: session.url, error: null };
  } catch (e) {
    console.error("createCheckoutSession:", e);
    return { url: null, error: "Could not start checkout. Please try again." };
  }
}

export async function createPortalSession(
  customerId: string,
): Promise<{ url: string | null; error: string | null }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/app/billing`,
    });

    return { url: session.url, error: null };
  } catch (e) {
    console.error("createPortalSession:", e);
    return { url: null, error: "Could not open the billing portal. Please try again." };
  }
}

export async function cancelStripeSubscription(
  subscriptionId: string,
): Promise<{ error: string | null }> {
  try {
    await getStripe().subscriptions.cancel(subscriptionId);
    return { error: null };
  } catch (e) {
    console.error("cancelStripeSubscription:", e);
    return { error: "Could not cancel subscription. Please try again." };
  }
}

export async function scheduleSubscriptionCancellation(
  subscriptionId: string,
): Promise<{ error: string | null }> {
  try {
    await getStripe().subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return { error: null };
  } catch (e) {
    console.error("scheduleSubscriptionCancellation:", e);
    return {
      error: "Could not schedule the plan cancellation. Please try again.",
    };
  }
}