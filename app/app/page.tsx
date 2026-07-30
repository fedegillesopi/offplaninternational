import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single()

  return (
    <div className="px-4 lg:p-6">
      <h1 className="text-2xl font-bold">Hi, {profile?.email || "Developer"}</h1>
    </div>
  )
}
