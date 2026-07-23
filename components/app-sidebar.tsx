"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { IconDashboard, IconSettings, IconBuilding, IconList, IconChartBar, IconUser } from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { UserRole } from "@/lib/types"

const NAV_BY_ROLE: Record<UserRole, { title: string; url: string; icon: typeof IconDashboard }[]> = {
  developer: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: IconBuilding },
    { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
  ],
  broker: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Listings", url: "/dashboard/listings", icon: IconList },
    { title: "Clients", url: "/dashboard/clients", icon: IconUser },
  ],
  private_seller: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "My Property", url: "/dashboard/my-property", icon: IconBuilding },
  ],
}

const NAV_SECONDARY = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string; role: UserRole }
}) {
  const navMain = NAV_BY_ROLE[user.role] || NAV_BY_ROLE.developer

  return (
    <Sidebar collapsible="none" className="sticky top-0 h-svh self-start" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Image
                  src="/images/brand/IsoLogotype-Color.png"
                  alt="Off Plan International"
                  width={140}
                  height={35}
                  className="h-4 w-auto"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
