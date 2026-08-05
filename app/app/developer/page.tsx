import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DeveloperForm } from "@/components/platform/developer-form"
import { getMyDeveloper } from "@/lib/developers"
import { getCitiesByCountry } from "@/lib/cities"
import { getCountryCode, getCountryLabel } from "@/lib/countries"
import type { UserProfile } from "@/lib/types"

export default async function DeveloperProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  if (profile.role !== "developer") {
    redirect("/app")
  }

  const developer = await getMyDeveloper(user.id)
  const countryCode = getCountryCode(profile.operating_country)
  const countryLabel = getCountryLabel(profile.operating_country)
  const cities = await getCitiesByCountry(countryCode)

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold">Developer Profile</h1>
      <div className="mt-6">
        <DeveloperForm
          developer={developer}
          profile={profile as UserProfile}
          cities={cities}
          countryCode={countryCode}
          countryLabel={countryLabel}
        />
      </div>
    </div>
  )
}
