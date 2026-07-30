import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getPricingPlan } from "@/lib/pricing-plans"
import type { UserRole } from "@/lib/types"
import { Check, ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

interface PaymentPageProps {
  params: Promise<{ locale: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.payment" })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, operating_country, country_of_residence")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  const role = profile.role as UserRole
  const country =
    role === "private_seller"
      ? profile.country_of_residence
      : profile.operating_country

  const plan = getPricingPlan(role, country)
  const intervalLabel = plan.interval === "month" ? t("month") : t("year")

  const currencySymbol =
    plan.currency === "AED" ? "د.إ" :
    plan.currency === "EUR" ? "€" :
    plan.currency === "GBP" ? "£" : "$"

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-3">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-left">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              {plan.name}
            </p>
            <p className="text-3xl font-bold mt-1">
              {currencySymbol}{plan.price}
              <span className="text-base font-normal text-muted-foreground">/{intervalLabel}</span>
            </p>
          </div>

          <ul className="space-y-2 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <form action="/app" method="GET" className="space-y-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium hover:bg-primary/90"
            >
              {t("select_plan")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="mt-6">
          <Link
            href="/app"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("skip")}
          </Link>
        </div>
      </div>
    </div>
  )
}
