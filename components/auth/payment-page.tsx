"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlansForRole, type PlanTier } from "@/lib/plans";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_TITLE: Record<UserRole, string> = {
  developer: "Developer Plan",
  broker: "Broker Plan",
  private_seller: "Private Seller Plan",
};

export function PaymentPage({ role }: { role: UserRole }) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<PlanTier>("free");

  const plans = useMemo(() => getPlansForRole(role), [role]);

  const selectedPlan = plans.find((p) => p.tier === selectedTier);

  const handleSelect = () => {
    // TODO: wire up to Stripe once implemented.
    // For now, choosing a paid plan proceeds to the app with the selected tier.
    router.push("/app");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{ROLE_TITLE[role]}</h1>
          <p className="text-muted-foreground">
            Choose how many properties you want to list.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isSelected = plan.tier === selectedTier;
            return (
              <button
                key={plan.tier}
                type="button"
                onClick={() => setSelectedTier(plan.tier)}
                className={cn(
                  "rounded-xl border bg-card p-5 text-left shadow-sm transition-all",
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{plan.name}</p>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  {plan.maxProperties === -1
                    ? "Unlimited properties"
                    : `Up to ${plan.maxProperties} properties`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
              </button>
            );
          })}
        </div>

        {selectedPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedPlan.name} ·{" "}
                {selectedPlan.maxProperties === -1
                  ? "Unlimited properties"
                  : `${selectedPlan.maxProperties} properties available`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {role === "private_seller"
                  ? "You can list up to the selected number of properties on your primary pricing path."
                  : "Your listings allowance updates based on the plan you choose."}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleSelect}
                >
                  Continue with {selectedPlan.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
