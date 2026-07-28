"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building,
  BarChart3,
  Settings,
  List,
  Users,
  Home,
  LogOut,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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
    { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  ],
  broker: [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/listings", label: "Listings", icon: List },
    { href: "/app/clients", label: "Clients", icon: Users },
  ],
  private_seller: [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/my-property", label: "My Property", icon: Home },
  ],
}

export function AppSidebar({ user, onNavClick }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = NAV_BY_ROLE[user.role] || NAV_BY_ROLE.developer

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4 py-6">
        <Link href="/app">
          <Image
            src="/images/brand/IsoLogotype-Color.png"
            alt="Off Plan International"
            width={140}
            height={35}
            className="h-4 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
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
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-1 rounded-md px-[12px] py-1 text-sm font-medium hover:bg-accent",
                isActive && "bg-accent"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3">
        <Link
          href="/app/settings"
          onClick={onNavClick}
          className={cn(
            "flex items-center gap-1 rounded-md px-[12px] py-1 text-sm font-medium hover:bg-accent",
            (pathname === "/app/settings" || pathname.startsWith("/app/settings/")) && "bg-accent"
          )}
        >
          <Settings className="size-4" />
          Settings
        </Link>
      </div>

      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-[12px] py-1 text-sm font-medium hover:bg-accent">
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" side="top" align="start">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" variant="destructive">
              <div className="flex items-center gap-1">
                <LogOut className="size-4" />
                Log out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
