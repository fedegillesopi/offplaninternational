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
  stripePriceId: string | null;
}

type PlanByTier = Record<PlanTier, Plan>;
type PlansByRole = Partial<Record<UserRole, Partial<PlanByTier>>>;

const PRICE_ID = {
  developer_starter: process.env.DEVELOPER_STARTER_PRICE_ID ?? null,
  developer_pro: process.env.DEVELOPER_PRO_PRICE_ID ?? null,
  developer_enterprise: process.env.DEVELOPER_ENTERPRISE_PRICE_ID ?? null,
  broker_starter: process.env.BROKER_STARTER_PRICE_ID ?? null,
  broker_pro: process.env.BROKER_PRO_PRICE_ID ?? null,
  broker_enterprise: process.env.BROKER_ENTERPRISE_PRICE_ID ?? null,
  private_single: process.env.PRIVATE_SINGLE_PRICE_ID ?? null,
  private_starter: process.env.PRIVATE_STARTER_PRICE_ID ?? null,
  private_pro: process.env.PRIVATE_PRO_PRICE_ID ?? null,
} as const;

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
      stripePriceId: null,
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      maxProperties: 50,
      description: "Up to 50 properties with standard placement",
      stripePriceId: PRICE_ID.developer_starter,
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 99,
      currency: "USD",
      interval: "month",
      maxProperties: 200,
      description: "Unlimited-ish listings with priority placement",
      stripePriceId: PRICE_ID.developer_pro,
    },
    enterprise: {
      tier: "enterprise",
      name: "Enterprise",
      price: 299,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings with custom support",
      stripePriceId: PRICE_ID.developer_enterprise,
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
      stripePriceId: null,
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 39,
      currency: "USD",
      interval: "month",
      maxProperties: 25,
      description: "Up to 25 properties with standard placement",
      stripePriceId: PRICE_ID.broker_starter,
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 79,
      currency: "USD",
      interval: "month",
      maxProperties: 100,
      description: "Up to 100 properties with priority placement",
      stripePriceId: PRICE_ID.broker_pro,
    },
    enterprise: {
      tier: "enterprise",
      name: "Enterprise",
      price: 199,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings with custom support",
      stripePriceId: PRICE_ID.broker_enterprise,
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
      stripePriceId: null,
    },
    single: {
      tier: "single",
      name: "Single",
      price: 29,
      currency: "USD",
      interval: "month",
      maxProperties: 1,
      description: "List a single property with extra visibility",
      stripePriceId: PRICE_ID.private_single,
    },
    starter: {
      tier: "starter",
      name: "Starter",
      price: 49,
      currency: "USD",
      interval: "month",
      maxProperties: 20,
      description: "Up to 20 properties",
      stripePriceId: PRICE_ID.private_starter,
    },
    pro: {
      tier: "pro",
      name: "Pro",
      price: 99,
      currency: "USD",
      interval: "month",
      maxProperties: -1,
      description: "Unlimited listings",
      stripePriceId: PRICE_ID.private_pro,
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

export function findPlanByPriceId(
  priceId: string,
): { role: UserRole; plan: Plan } | null {
  for (const role of Object.keys(PLANS) as UserRole[]) {
    const rolePlans = PLANS[role];
    if (!rolePlans) continue;
    for (const tier of Object.keys(rolePlans) as PlanTier[]) {
      const plan = rolePlans[tier];
      if (plan?.stripePriceId === priceId) {
        return { role, plan };
      }
    }
  }
  return null;
}