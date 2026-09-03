import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PaymentPage } from "@/components/auth/payment-page"
import type { UserRole } from "@/lib/types"

export default async function PaymentRoute() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  return <PaymentPage role={profile.role as UserRole} />
}
