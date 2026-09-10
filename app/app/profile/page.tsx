import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/platform/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "id, role, full_name, email, phone, company_name, company_website, operating_country, country_of_residence, license_number, profile_completed, created_at, updated_at"
    )
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  const initials = (profile.full_name || profile.email || "U")
    .split(" ")[0][0]
    .toUpperCase()

  return (
    <div className="p-4 lg:p-6">
      <ProfileForm profile={profile} initials={initials} />
    </div>
  )
}
