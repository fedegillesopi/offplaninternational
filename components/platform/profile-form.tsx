"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { UserProfile, UserRole } from "@/lib/types"

interface ProfileFormProps {
  profile: UserProfile
  initials: string
}

const COUNTRY_OPTIONS = [
  { value: "AE", label: "United Arab Emirates" },
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brazil" },
  { value: "ES", label: "Spain" },
  { value: "GB", label: "United Kingdom" },
  { value: "ID", label: "Indonesia" },
  { value: "ME", label: "Montenegro" },
  { value: "MX", label: "Mexico" },
  { value: "PT", label: "Portugal" },
]

const ROLE_LABELS: Record<UserRole, string> = {
  developer: "Developer",
  broker: "Broker",
  private_seller: "Private Seller",
}

export function ProfileForm({ profile, initials }: ProfileFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [fullName, setFullName] = useState(profile.full_name)
  const [phone, setPhone] = useState(profile.phone)
  const [companyName, setCompanyName] = useState(profile.company_name)
  const [companyWebsite, setCompanyWebsite] = useState(profile.company_website)

  const role = profile.role as UserRole

  const hasChanges =
    fullName !== profile.full_name ||
    phone !== profile.phone ||
    companyName !== profile.company_name ||
    companyWebsite !== profile.company_website

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("user_profiles")
      .update({
        full_name: fullName,
        phone,
        company_name: companyName,
        company_website: companyWebsite,
      })
      .eq("id", profile.id)

    if (!error) {
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-medium">{profile.full_name || "User"}</p>
          <p className="text-sm text-muted-foreground">{ROLE_LABELS[role]}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={profile.email} readOnly className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {(role === "developer" || role === "broker") && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Company</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Website</label>
              <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Operating Country</label>
              <Input value={COUNTRY_OPTIONS.find((c) => c.value === profile.operating_country)?.label || profile.operating_country} readOnly className="bg-muted" />
            </div>
            {role === "broker" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input value={profile.license_number} readOnly className="bg-muted" />
              </div>
            )}
          </div>
        </div>
      )}

      {role === "private_seller" && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Residence</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country of Residence</label>
            <Input value={COUNTRY_OPTIONS.find((c) => c.value === profile.country_of_residence)?.label || profile.country_of_residence} readOnly className="bg-muted" />
          </div>
        </div>
      )}

      <Button onClick={handleSave} disabled={!hasChanges || saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
