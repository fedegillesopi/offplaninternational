"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/types"

interface AppSidebarProps {
  user: {
    name: string
    email: string
    avatar: string
    role: UserRole
  }
  onNavClick?: () => void
}

const NAV_BY_ROLE: Record<UserRole, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  developer: [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/properties", label: "Properties", icon: Building },
  ],
  broker: [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/properties", label: "Properties", icon: Building },
  ],
  private_seller: [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/properties", label: "Properties", icon: Building },
  ],
}

export function AppSidebar({ user, onNavClick }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const navItems = NAV_BY_ROLE[user.role] || NAV_BY_ROLE.developer

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navContent = (
    <>
      <div className="hidden lg:flex h-14 items-center px-6 pt-12 pb-6">
        <Link href="/app">
          <Image
            src="/images/brand/IsoLogotype-Color.png"
            alt="Off Plan International"
            width={240}
            height={135}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 md:py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { onNavClick?.(); closeMobile() }}
              className={cn(
                "flex items-center gap-1 rounded-md px-[12px] py-2 text-sm font-medium hover:bg-accent",
                isActive && "bg-accent"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4 lg:hidden">
        <div className="space-y-1">
          <Link
            href="/app/settings"
            onClick={closeMobile}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
          >
            <Settings className="size-4" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-destructive hover:bg-accent"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r lg:flex">
        {navContent}
      </aside>
      <div className="p-3 pb-0 md:hidden border-b">
        <button
          onClick={() => setMobileOpen(true)}
          className={cn(
            "lg:hidden",
            mobileOpen && "hidden"
          )}
        >
          <Menu className="size-6" />
        </button>

      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-full flex-col bg-background transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-end px-4">
          <button onClick={closeMobile}>
            <X className="size-5" />
          </button>
        </div>
        {navContent}
      </div>
    </>
  )
}
