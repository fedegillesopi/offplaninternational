import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BrokerForm } from "@/components/platform/broker-form"
import { getMyBroker } from "@/lib/brokers"
import { getCitiesByCountry } from "@/lib/cities"
import { getCountryCode, getCountryLabel } from "@/lib/countries"
import type { UserProfile } from "@/lib/types"

export default async function BrokerProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  if (profile.role !== "broker") {
    redirect("/app")
  }

  const broker = await getMyBroker(user.id)
  const countryCode = getCountryCode(profile.operating_country)
  const countryLabel = getCountryLabel(profile.operating_country)
  const cities = await getCitiesByCountry(countryCode)

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold">Broker Profile</h1>
      <div className="mt-6">
        <BrokerForm
          broker={broker}
          profile={profile as UserProfile}
          cities={cities}
          countryCode={countryCode}
          countryLabel={countryLabel}
        />
      </div>
    </div>
  )
}
