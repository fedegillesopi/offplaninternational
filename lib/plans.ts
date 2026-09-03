import type { UserRole } from "./types";

export type PlanTier = "free" | "single" | "starter" | "pro" | "enterprise";

export interface Plan {
  tier: PlanTier;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  maxProperties: number;
  description: string;
}

type PlanByTier = Record<PlanTier, Plan>;
type PlansByRole = Partial<Record<UserRole, Partial<PlanByTier>>>;

export const PLANS: PlansByRole = {
  developer: {
    free: {
      tier: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "month",
      maxProperties: 10,
      description: "Start listing up to 10 properties",
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      maxProperties: 50,
      description: "Up to 50 properties with standard placement",
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 99,
      currency: "USD",
      interval: "month",
      maxProperties: 200,
      description: "Unlimited-ish listings with priority placement",
    },
    enterprise: {
      tier: "enterprise",
      name: "Enterprise",
      price: 299,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings with custom support",
    },
  },
  broker: {
    free: {
      tier: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "month",
      maxProperties: 10,
      description: "Start listing up to 10 properties",
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 39,
      currency: "USD",
      interval: "month",
      maxProperties: 25,
      description: "Up to 25 properties with standard placement",
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 79,
      currency: "USD",
      interval: "month",
      maxProperties: 100,
      description: "Up to 100 properties with priority placement",
    },
    enterprise: {
      tier: "enterprise",
      name: "Enterprise",
      price: 199,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings with custom support",
    },
  },
  private_seller: {
    free: {
      tier: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "month",
      maxProperties: 10,
      description: "Start listing up to 10 properties",
    },
    single: {
      tier: "single",
      name: "Single",
      price: 29,
      currency: "USD",
      interval: "month",
      maxProperties: 1,
      description: "List a single property with extra visibility",
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      maxProperties: 20,
      description: "Up to 20 properties",
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 99,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings",
    },
  },
};

const TIER_ORDER: PlanTier[] = ["free", "single", "starter", "pro", "enterprise"];

export function getPlansForRole(role: UserRole): Plan[] {
  const plans = PLANS[role];
  if (!plans) return [];
  return TIER_ORDER.flatMap((tier) => {
    const plan = plans[tier];
    return plan ? [plan] : [];
  });
}

export function getPlan(role: UserRole, tier: PlanTier): Plan | undefined {
  return PLANS[role]?.[tier];
}

export function getMaxProperties(role: UserRole, tier: PlanTier): number {
  const plan = getPlan(role, tier);
  return plan ? plan.maxProperties : 0;
}
