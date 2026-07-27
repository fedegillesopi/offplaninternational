import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/platform/app-sidebar"

export const metadata: Metadata = {
  title: "Dashboard - Off Plan International",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single()

  const userName = profile?.full_name || profile?.email?.split("@")[0] || "User"
  const userEmail = profile?.email || user.email || ""
  const userRole = profile?.role || "developer"

  if (profile && !profile.role) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 shrink-0 border-r">
        <AppSidebar
          user={{ name: userName, email: userEmail, avatar: "", role: userRole }}
        />
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
