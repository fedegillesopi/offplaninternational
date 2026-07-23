import type { UserRole } from "./types";

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
}

type PlanByCountry = Record<string, PricingPlan>;
type PricingMatrix = Record<UserRole, PlanByCountry>;

export const PRICING_PLANS: PricingMatrix = {
  developer: {
    AE: {
      name: "Enterprise",
      price: 299,
      currency: "AED",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Featured placement",
        "Analytics dashboard",
        "Priority support",
        "Lead management",
      ],
    },
    GB: {
      name: "Business",
      price: 199,
      currency: "GBP",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Standard placement",
        "Analytics dashboard",
        "Email support",
        "Lead management",
      ],
    },
    ES: {
      name: "Business",
      price: 149,
      currency: "EUR",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Standard placement",
        "Analytics dashboard",
        "Email support",
        "Lead management",
      ],
    },
    PT: {
      name: "Business",
      price: 149,
      currency: "EUR",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Standard placement",
        "Analytics dashboard",
        "Email support",
        "Lead management",
      ],
    },
    MX: {
      name: "Professional",
      price: 99,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 50 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    BR: {
      name: "Professional",
      price: 99,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 50 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    AR: {
      name: "Professional",
      price: 99,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 50 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
  },
  broker: {
    AE: {
      name: "Professional",
      price: 199,
      currency: "AED",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Featured placement",
        "Analytics dashboard",
        "Priority support",
        "Lead management",
      ],
    },
    GB: {
      name: "Professional",
      price: 149,
      currency: "GBP",
      interval: "month",
      features: [
        "Unlimited property listings",
        "Standard placement",
        "Analytics dashboard",
        "Email support",
        "Lead management",
      ],
    },
    ES: {
      name: "Professional",
      price: 99,
      currency: "EUR",
      interval: "month",
      features: [
        "Up to 50 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    PT: {
      name: "Professional",
      price: 99,
      currency: "EUR",
      interval: "month",
      features: [
        "Up to 50 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    MX: {
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 20 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    BR: {
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 20 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
    AR: {
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 20 property listings",
        "Standard placement",
        "Basic analytics",
        "Email support",
      ],
    },
  },
  private_seller: {
    _default: {
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "month",
      features: [
        "Up to 3 property listings",
        "Standard placement",
        "Basic analytics",
      ],
    },
  },
};

export function getPricingPlan(role: UserRole, country?: string): PricingPlan {
  const plans = PRICING_PLANS[role];
  if (!plans) {
    return PRICING_PLANS.private_seller._default;
  }

  if (country && plans[country]) {
    return plans[country];
  }

  if (plans._default) {
    return plans._default;
  }

  const firstPlan = Object.values(plans)[0];
  return firstPlan ?? PRICING_PLANS.private_seller._default;
}
