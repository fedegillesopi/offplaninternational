"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function AuthCallbackClient() {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    async function handleHash() {
      if (!accessToken || !refreshToken) {
        window.location.href = "/auth/error?error=No tokens found in URL"
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        window.location.href = `/auth/error?error=${encodeURIComponent(error.message)}`
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/auth/error?error=User not found"
        return
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, profile_completed")
        .eq("id", user.id)
        .single()

      if (profile && !profile.profile_completed) {
        window.location.href = `/auth/onboarding/${profile.role}`
      } else {
        window.location.href = "/app"
      }
    }

    handleHash()
  }, [])

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
