"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/platform/image-upload"
import { RichTextEditor } from "@/components/platform/rich-text-editor"
import { saveBrokerProfile } from "@/lib/actions"
import { sanitizeUserHtml } from "@/lib/sanitize-html"
import { slugify, toEditorHtml } from "@/lib/utils"
import type { BrokerProfile, UserProfile } from "@/lib/types"

interface BrokerFormProps {
  broker: BrokerProfile | null
  profile: UserProfile
  cities: string[]
  countryCode: string
  countryLabel: string
}

export function BrokerForm({
  broker,
  profile,
  cities,
  countryCode,
  countryLabel,
}: BrokerFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialDescription = toEditorHtml(broker?.description ?? "")
  const isNew = !broker
  const [name, setName] = useState(broker?.name ?? profile.company_name)
  const [description, setDescription] = useState(initialDescription)
  const [profileImage, setProfileImage] = useState(broker?.profile_image ?? "")
  const [personalUrl, setPersonalUrl] = useState(broker?.personal_url ?? "")
  const [city, setCity] = useState(broker?.city ?? "")
  const [emailPublic, setEmailPublic] = useState(
    broker?.email_public ?? (isNew ? profile.email : ""),
  )
  const [phone, setPhone] = useState(
    broker?.phone ?? (isNew ? profile.phone : ""),
  )
  const [whatsapp, setWhatsapp] = useState(broker?.whatsapp ?? "")
  const [closedTransactions, setClosedTransactions] = useState(
    broker?.closed_transactions?.toString() ?? "0",
  )

  const country = countryCode
  const slug = slugify(name)

  const cityOptions = city && !cities.includes(city) ? [city, ...cities] : cities

  const hasChanges = isNew
    ? Boolean(name)
    : Boolean(
        name !== broker.name ||
          sanitizeUserHtml(description) !== sanitizeUserHtml(initialDescription) ||
          profileImage !== broker.profile_image ||
          personalUrl !== (broker.personal_url ?? "") ||
          city !== broker.city ||
          emailPublic !== (broker.email_public ?? "") ||
          phone !== (broker.phone ?? "") ||
          whatsapp !== (broker.whatsapp ?? "") ||
          closedTransactions !== (broker.closed_transactions?.toString() ?? "0"),
      )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/broker/${slug}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const { error: saveError } = await saveBrokerProfile({
        id: broker?.id,
        name,
        slug,
        profile_image: profileImage || null,
        personal_url: personalUrl || null,
        description: sanitizeUserHtml(description),
        country,
        city: city || null,
        email_public: emailPublic,
        phone,
        whatsapp,
        closed_transactions: closedTransactions
          ? Number(closedTransactions)
          : null,
      })

      if (saveError) {
        setError(saveError)
        return
      }

      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {!isNew && !broker.is_verified && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          Pending verification. Your profile will be published once approved.
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Smith Realty"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <div className="flex gap-2">
              <Input value={slug} readOnly className="bg-muted" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                title="Copy public URL"
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Image</label>
          <ImageUpload
            label="Profile Image"
            value={profileImage}
            onChange={setProfileImage}
            userId={profile.id}
            folder="profile"
            bucket="broker-images"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <RichTextEditor
            defaultValue={initialDescription}
            onChange={setDescription}
            userId={profile.id}
            placeholder="Describe yourself, your expertise and track record..."
            bucket="broker-images"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input value={countryLabel} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Personal Website</label>
          <Input
            value={personalUrl}
            onChange={(e) => setPersonalUrl(e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Public Email</label>
            <Input
              value={emailPublic}
              onChange={(e) => setEmailPublic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+971 50 123 4567"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Closed Transactions</label>
            <Input
              type="number"
              min={0}
              value={closedTransactions}
              onChange={(e) => setClosedTransactions(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="w-full space-y-3">
        <Button className="w-full" onClick={handleSave} disabled={saving || !hasChanges}>
          {saving ? "Saving..." : isNew ? "Create Profile" : "Save Changes"}
        </Button>
        {isNew && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/app")}
            disabled={saving}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
