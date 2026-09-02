"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/platform/image-upload"
import { RichTextEditor } from "@/components/platform/rich-text-editor"
import { saveDeveloperProfile } from "@/lib/actions"
import { sanitizeUserHtml } from "@/lib/sanitize-html"
import { slugify, toEditorHtml } from "@/lib/utils"
import type { Developer, UserProfile } from "@/lib/types"

interface DeveloperFormProps {
  developer: Developer | null
  profile: UserProfile
  cities: string[]
  countryCode: string
  countryLabel: string
}

export function DeveloperForm({
  developer,
  profile,
  cities,
  countryCode,
  countryLabel,
}: DeveloperFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialDescription = toEditorHtml(developer?.description ?? "")
  const isNew = !developer
  const [name, setName] = useState(developer?.name ?? profile.company_name)
  const [description, setDescription] = useState(initialDescription)
  const [city, setCity] = useState(developer?.city ?? "")
  const [coverImage, setCoverImage] = useState(developer?.cover_image ?? "")
  const [logoUrl, setLogoUrl] = useState(developer?.logo_url ?? "")
  const [website, setWebsite] = useState(developer?.website ?? (isNew ? profile.company_website : ""))
  const [onTimeCompletion, setOnTimeCompletion] = useState(
    developer?.on_time_completion?.toString() ?? "",
  )
  const [email, setEmail] = useState(developer?.email ?? (isNew ? profile.email : ""))
  const [phone, setPhone] = useState(developer?.phone ?? (isNew ? profile.phone : ""))

  const country = countryCode
  const slug = slugify(name)

  const cityOptions = city && !cities.includes(city) ? [city, ...cities] : cities

  const hasChanges = isNew
    ? Boolean(name)
    : Boolean(
        name !== developer.name ||
          sanitizeUserHtml(description) !== sanitizeUserHtml(initialDescription) ||
          city !== developer.city ||
          coverImage !== developer.cover_image ||
          logoUrl !== developer.logo_url ||
          website !== (developer.website ?? "") ||
          onTimeCompletion !== (developer.on_time_completion?.toString() ?? "") ||
          email !== (developer.email ?? "") ||
          phone !== (developer.phone ?? ""),
      )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/developer/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const { error: saveError } = await saveDeveloperProfile({
        id: developer?.id,
        name,
        slug,
        description: sanitizeUserHtml(description),
        city: city || null,
        cover_image: coverImage || null,
        logo_url: logoUrl || null,
        website: website || null,
        on_time_completion: onTimeCompletion ? Number(onTimeCompletion) : null,
        email,
        phone,
        country,
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
      {!isNew && !developer.is_verified && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          Pending verification. Your profile will be published once approved.
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emaar Properties"
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
          <label className="text-sm font-medium">Description</label>
          <RichTextEditor
            defaultValue={initialDescription}
            onChange={setDescription}
            userId={profile.id}
            placeholder="Describe your company, projects and track record..."
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

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onChange={setCoverImage}
            userId={profile.id}
            folder="covers"
          />
          <ImageUpload
            label="Logo"
            value={logoUrl}
            onChange={setLogoUrl}
            userId={profile.id}
            folder="logos"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Website</label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">On-time completion (%)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={onTimeCompletion}
              onChange={(e) => setOnTimeCompletion(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
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
