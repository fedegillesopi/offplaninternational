import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/platform/app-sidebar"
import { SiteHeader } from "@/components/platform/site-header"

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
    <div className="flex flex-col md:flex-row h-screen">
      <AppSidebar
        user={{ name: userName, email: userEmail, avatar: "", role: userRole }}
      />
      <div className="flex flex-1 flex-col">
        <SiteHeader user={{ name: userName, email: userEmail, avatar: "" }} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
