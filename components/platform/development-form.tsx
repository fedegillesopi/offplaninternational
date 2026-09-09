"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect } from "@/components/ui/native-select"
import { FormSection } from "@/components/platform/property-form/form-section"
import { ImageUpload } from "@/components/platform/image-upload"
import { RichTextEditor } from "@/components/platform/rich-text-editor"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { saveDevelopment, deleteDevelopment } from "@/lib/actions"
import { sanitizeUserHtml } from "@/lib/sanitize-html"
import { slugify, toEditorHtml } from "@/lib/utils"
import { uploadImage } from "@/lib/storage"
import type { Development, UserProfile, PropertyCurrency } from "@/lib/types"
import type { PropertyAmenity } from "@/lib/property-amenities"
import type { PropertySubcategory } from "@/lib/property-subcategories"
import type { CommunityOption } from "@/lib/communities"

const BUCKET = "development-images";
const MAX_GALLERY = 10;
const CURRENCIES = ["AED", "USD", "EUR", "GBP"];

interface DevelopmentFormProps {
  development: Development | null
  profile: UserProfile
  cities: string[]
  countryCode: string
  countryLabel: string
  communities: CommunityOption[]
  amenities: PropertyAmenity[]
  subcategories: PropertySubcategory[]
}

export function DevelopmentForm({
  development,
  profile,
  cities,
  countryCode,
  countryLabel,
  communities,
  amenities,
  subcategories,
}: DevelopmentFormProps) {
  const router = useRouter()
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const isNew = !development
  const initialDescription = toEditorHtml(development?.description ?? "")

  const [name, setName] = useState(development?.name ?? "")
  const [description, setDescription] = useState(initialDescription)
  const [city, setCity] = useState(development?.city ?? "")
  const [community, setCommunity] = useState(development?.community ?? "")
  const [coverImage, setCoverImage] = useState(development?.cover_image ?? "")
  const [galleryImages, setGalleryImages] = useState<string[]>(development?.images ?? [])
  const [amenitySlugs, setAmenitySlugs] = useState<string[]>(development?.amenities ?? [])
  const [propertyTypes, setPropertyTypes] = useState<string[]>(development?.property_types ?? [])
  const [startingPrice, setStartingPrice] = useState(
    development?.starting_price?.toString() ?? "",
  )
  const [startingPriceCurrency, setStartingPriceCurrency] = useState<PropertyCurrency>(
    (development?.starting_price_currency as PropertyCurrency) ?? "AED",
  )
  const [totalArea, setTotalArea] = useState(development?.total_area?.toString() ?? "")
  const [handoverDate, setHandoverDate] = useState(development?.handover_date ?? "")
  const [isActive, setIsActive] = useState(development?.is_active ?? true)

  const country = countryCode
  const slug = slugify(name)

  const cityOptions = city && !cities.includes(city) ? [city, ...cities] : cities

  const groupedAmenities = amenities.reduce(
    (acc, a) => {
      const cat = a.category ?? "Other"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(a)
      return acc
    },
    {} as Record<string, PropertyAmenity[]>,
  )

  const groupedSubcategories = subcategories.reduce(
    (acc, s) => {
      const cat = s.category ?? "Other"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(s)
      return acc
    },
    {} as Record<string, PropertySubcategory[]>,
  )

  const hasChanges = isNew
    ? Boolean(name)
    : Boolean(
        name !== development.name ||
          sanitizeUserHtml(description) !== sanitizeUserHtml(initialDescription) ||
          city !== development.city ||
          community !== development.community ||
          coverImage !== development.cover_image ||
          galleryImages.join("|") !== (development.images ?? []).join("|") ||
          amenitySlugs.join("|") !== (development.amenities ?? []).join("|") ||
          propertyTypes.join("|") !== (development.property_types ?? []).join("|") ||
          startingPrice !== (development.starting_price?.toString() ?? "") ||
          startingPriceCurrency !== (development.starting_price_currency ?? "AED") ||
          totalArea !== (development.total_area?.toString() ?? "") ||
          handoverDate !== (development.handover_date ?? "") ||
          isActive !== development.is_active,
      )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/development/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGalleryFiles = async (files: FileList) => {
    const remaining = MAX_GALLERY - galleryImages.length
    if (remaining <= 0) return
    const toUpload = Array.from(files).slice(0, remaining)
    setUploadingGallery(true)
    setError(null)
    try {
      const urls = await Promise.all(
        toUpload.map((f) => uploadImage(f, profile.id, "gallery", BUCKET)),
      )
      setGalleryImages((prev) => [...prev, ...urls])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.")
    } finally {
      setUploadingGallery(false)
    }
  }

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const { error: saveError } = await saveDevelopment({
        id: development?.id,
        name,
        slug,
        description: sanitizeUserHtml(description),
        country,
        city: city || "",
        community: community || "",
        cover_image: coverImage || null,
        images: galleryImages,
        amenities: amenitySlugs,
        property_types: propertyTypes,
        starting_price: startingPrice ? Number(startingPrice) : null,
        starting_price_currency: startingPriceCurrency,
        total_area: totalArea ? Number(totalArea) : null,
        handover_date: handoverDate || null,
        is_active: isActive,
      })

      if (saveError) {
        setError(saveError)
        return
      }

      router.refresh()
      if (isNew) router.push("/app/developments")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!development) return
    setDeleting(true)
    setError(null)
    try {
      const { error: deleteError } = await deleteDevelopment(development.id)
      if (deleteError) {
        setError(deleteError)
        return
      }
      router.push("/app/developments")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <FormSection title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="development_name">Name</Label>
            <Input
              id="development_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Palm Jumeirah Towers"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="development_slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="development_slug" value={slug} readOnly className="bg-muted" />
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
          <Label>Description</Label>
          <RichTextEditor
            defaultValue={initialDescription}
            onChange={setDescription}
            userId={profile.id}
            bucket={BUCKET}
            placeholder="Describe the development, units, amenities and timeline..."
          />
        </div>
      </FormSection>

      <FormSection title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={countryLabel} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="development_city">City</Label>
            <NativeSelect
              id="development_city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="development_community">Community</Label>
          <NativeSelect
            id="development_community"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
          >
            <option value="">Select community</option>
            {communities
              .sort((a, b) => a.name.localeCompare(b.name, "en"))
              .map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}{c.city ? ` (${c.city})` : ""}
                </option>
              ))}
          </NativeSelect>
        </div>
      </FormSection>

      <FormSection title="Images">
        <ImageUpload
          label="Cover Image"
          value={coverImage}
          onChange={setCoverImage}
          userId={profile.id}
          folder="covers"
          bucket={BUCKET}
        />

        <div className="space-y-2">
          <Label>Gallery Images ({galleryImages.length}/{MAX_GALLERY})</Label>
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
                <Image
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 33vw, 200px"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {galleryImages.length < MAX_GALLERY && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingGallery}
            >
              {uploadingGallery ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </>
              )}
            </Button>
          )}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleGalleryFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>
      </FormSection>

      <FormSection title="Amenities">
        {Object.entries(groupedAmenities).map(([cat, items]) => (
          <div key={cat} className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAmenitySlugs((prev) => toggleInList(prev, a.slug))}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${
                    amenitySlugs.includes(a.slug)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Property Types">
        {Object.entries(groupedSubcategories).map(([cat, items]) => (
          <div key={cat} className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPropertyTypes((prev) => toggleInList(prev, s.slug))}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${
                    propertyTypes.includes(s.slug)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Pricing & Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="development_price">Starting Price</Label>
            <Input
              id="development_price"
              type="number"
              min={0}
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="development_currency">Currency</Label>
            <NativeSelect
              id="development_currency"
              value={startingPriceCurrency}
              onChange={(e) => setStartingPriceCurrency(e.target.value as PropertyCurrency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="development_area">Total Area (sqm)</Label>
            <Input
              id="development_area"
              type="number"
              min={0}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="development_handover">Handover Date</Label>
            <Input
              id="development_handover"
              type="date"
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Visibility">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_active"
            checked={isActive}
            onCheckedChange={(c) => setIsActive(c === true)}
          />
          <Label htmlFor="is_active" className="font-normal">
            Active (visible on public listings)
          </Label>
        </div>
      </FormSection>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="w-full space-y-3">
        <Button className="w-full" onClick={handleSave} disabled={saving || !hasChanges}>
          {saving ? "Saving..." : isNew ? "Create Development" : "Save Changes"}
        </Button>

        {isNew ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/app/developments")}
            disabled={saving}
          >
            Cancel
          </Button>
        ) : (
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={saving || deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this development. Properties assigned
                  to it will lose their development link.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  asChild
                  className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setConfirmOpen(false)
                      handleDelete()
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}