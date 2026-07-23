import { createClient } from "@/lib/supabase/server"
import { SectionCards } from "@/components/section-cards"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">
              Hi, {profile?.email || "Developer"}
            </h1>
          </div>
          <SectionCards />
        </div>
      </div>
    </div>
  )
}
