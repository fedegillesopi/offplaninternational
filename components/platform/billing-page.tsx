"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { activateFreePlan, changePlan } from "@/lib/actions";
import type { Plan } from "@/lib/plans";
import type { Subscription } from "@/lib/subscriptions";

interface BillingPageProps {
  currentPlan: Plan | null;
  subscription: Subscription | null;
  propertyCount: number;
  allPlans: Plan[];
}

export function BillingPage({
  currentPlan,
  subscription,
  propertyCount,
  allPlans,
}: BillingPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSubscription = Boolean(subscription);
  const hasPaidPlan =
    subscription && subscription.plan_name !== "free";

  const handleActivateFree = async () => {
    setLoading(true);
    setError(null);
    const result = await activateFreePlan();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  const handleUpgrade = async (tier: string) => {
    setLoading(true);
    setError(null);
    const result = await changePlan(tier as Plan["tier"]);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  const usagePercent =
    currentPlan && currentPlan.maxProperties > 0
      ? Math.min(100, (propertyCount / currentPlan.maxProperties) * 100)
      : 0;

  const usageLabel =
    currentPlan && currentPlan.maxProperties === -1
      ? `${propertyCount} properties listed`
      : `${propertyCount} / ${currentPlan?.maxProperties ?? 10} properties used`;

  return (
    <div className="px-4 py-6 lg:p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and plan.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            {hasSubscription && (
              <Badge variant="secondary">
                {currentPlan?.name ?? subscription?.plan_name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasSubscription ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have an active plan yet. Activate the Free plan
                to start listing properties.
              </p>
              <Button
                onClick={handleActivateFree}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Activate Free Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {currentPlan?.price === 0
                    ? "Free"
                    : `$${currentPlan?.price}/mo`}
                </span>
                {hasPaidPlan && (
                  <span className="text-sm text-muted-foreground">
                    Billed monthly
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{usageLabel}</span>
                  {currentPlan && currentPlan.maxProperties > 0 && (
                    <span className="font-medium">
                      {Math.round(usagePercent)}%
                    </span>
                  )}
                </div>
                {currentPlan && currentPlan.maxProperties > 0 && (
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {hasPaidPlan ? (
                  <Button variant="outline" disabled>
                    Manage Subscription
                  </Button>
                ) : (
                  <Button onClick={() => router.push("/auth/payment")}>
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Payment methods are managed through Stripe. Stripe integration is
            coming soon.
          </p>
          <Button variant="outline" disabled>
            Manage Payment Method
          </Button>
        </CardContent>
      </Card>

      {(!hasSubscription || !hasPaidPlan) && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Available Plans</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allPlans.map((plan) => {
              const isCurrent = plan.tier === subscription?.plan_name;
              const isHigher =
                currentPlan &&
                plan.price > currentPlan.price;

              return (
                <div
                  key={plan.tier}
                  className={cn(
                    "rounded-xl border bg-card p-5 space-y-3",
                    isCurrent && "border-primary ring-2 ring-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{plan.name}</p>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {plan.maxProperties === -1
                      ? "Unlimited properties"
                      : `Up to ${plan.maxProperties} properties`}
                  </p>
                  {isHigher && (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => handleUpgrade(plan.tier)}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Upgrade"
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
