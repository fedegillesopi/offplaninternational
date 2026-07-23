import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

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
    <SidebarProvider
      style={{
        "--sidebar-width": "10rem",
        "--header-height": "3rem",
      } as React.CSSProperties}
    >
      <AppSidebar
        user={{ name: userName, email: userEmail, avatar: "", role: userRole }}
      />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
