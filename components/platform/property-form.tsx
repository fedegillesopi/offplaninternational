"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/platform/image-upload";
import { RichTextEditor } from "@/components/platform/rich-text-editor";
import {
  MilestonesEditor,
  type Milestone,
} from "@/components/platform/milestones-editor";
import { saveProperty, saveMilestones, deleteProperty } from "@/lib/actions";
import { uploadImage } from "@/lib/storage";
import { isHtmlText, slugify, toEditorHtml } from "@/lib/utils";
import type { PropertyData, UserRole } from "@/lib/types";
import type { PropertyAmenity } from "@/lib/property-amenities";
import type { PropertySubcategory } from "@/lib/property-subcategories";
import type { CommunityOption } from "@/lib/communities";

interface PropertyFormProps {
  property: PropertyData | null;
  milestones: Milestone[];
  userId: string;
  userRole: UserRole;
  cities: string[];
  communities: CommunityOption[];
  countryLabel: string;
  country: string;
  amenities: PropertyAmenity[];
  subcategories: PropertySubcategory[];
  developments: { id: string; name: string }[];
}

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "reserved", label: "Reserved" },
  { value: "off_market", label: "Off Market" },
];

const CURRENCIES = [
  { value: "AED", label: "AED" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-medium border-b pb-2">{children}</h3>
  );
}

export function PropertyForm({
  property,
  milestones: initialMilestones,
  userId,
  userRole,
  cities,
  communities,
  countryLabel,
  country,
  amenities,
  subcategories,
  developments,
}: PropertyFormProps) {
  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isNew = !property;

  // Basic Info
  const [title, setTitle] = useState(property?.title ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [status, setStatus] = useState<string>(property?.status ?? "available");
  const [subcategory, setSubcategory] = useState(property?.subcategory ?? "");

  // Location
  const [city, setCity] = useState(property?.city ?? "");
  const [community, setCommunity] = useState(property?.community ?? "");
  const [communityCustom, setCommunityCustom] = useState(
    property?.community && !communities.some((c) => c.slug === property.community)
      ? property.community
      : "",
  );
  const [communityIsCustom, setCommunityIsCustom] = useState(
    Boolean(
      property?.community && !communities.some((c) => c.slug === property.community),
    ),
  );
  const [address, setAddress] = useState(property?.address ?? "");

  // Details
  const [bedrooms, setBedrooms] = useState(property?.beds?.toString() ?? "");
  const [bathrooms, setBathrooms] = useState(property?.baths?.toString() ?? "");
  const [areaSqft, setAreaSqft] = useState(property?.area_sqft?.toString() ?? "");
  const [areaSqm, setAreaSqm] = useState(property?.area_sqm?.toString() ?? "");
  const [floor, setFloor] = useState(property?.floor?.toString() ?? "");
  const [hasBalcony, setHasBalcony] = useState(property?.has_balcony ?? false);
  const [hasGarden, setHasGarden] = useState(property?.has_garden ?? false);

  // Pricing
  const [price, setPrice] = useState(property?.price?.toString() ?? "");
  const [currency, setCurrency] = useState<string>(property?.currency ?? "AED");
  const [depositPercentage, setDepositPercentage] = useState(
    property?.deposit_percentage?.toString() ?? "",
  );
  const [depositAmount, setDepositAmount] = useState(
    property?.deposit_amount?.toString() ?? "",
  );
  const [hasPostHandover, setHasPostHandover] = useState(
    property?.has_post_handover ?? false,
  );
  const [handoverDate, setHandoverDate] = useState(property?.handover_date ?? "");
  const [paymentPlanMonths, setPaymentPlanMonths] = useState(
    property?.payment_plan_months?.toString() ?? "",
  );

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities ?? [],
  );

  // Images
  const [coverImage, setCoverImage] = useState(property?.cover_image ?? "");
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>(property?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  // Links
  const [developerId, setDeveloperId] = useState(property?.developer_id ?? "");
  const [developmentId, setDevelopmentId] = useState(property?.development_id ?? "");

  // Visibility
  const [isActive, setIsActive] = useState(property?.is_active ?? true);

  const slug = slugify(title);

  const cityOptions = city && !cities.includes(city) ? [city, ...cities] : cities;

  const CUSTOM_VALUE = "__custom__";

  const filteredCommunities = useMemo(() => {
    const existingCommunity = property?.community
      ? communities.find((c) => c.slug === property.community)
      : undefined;
    const options = existingCommunity
      ? communities
      : property?.community
        ? [
            { slug: property.community, name: property.community, city: null },
            ...communities,
          ]
        : communities;
    return options.filter((c) => !c.city || c.city === city);
  }, [communities, city, property?.community]);

  const communitySelectValue = communityIsCustom ? CUSTOM_VALUE : community;

  // Auto-calculate area_sqm from sqft
  const handleAreaSqftChange = (val: string) => {
    setAreaSqft(val);
    const num = parseFloat(val);
    if (num > 0) {
      setAreaSqm((Math.round(num * 0.092903 * 100) / 100).toString());
    } else {
      setAreaSqm("");
    }
  };

  // Auto-calculate deposit_amount
  const handleDepositPercentageChange = (val: string) => {
    setDepositPercentage(val);
    const pct = parseFloat(val);
    const p = parseFloat(price);
    if (pct > 0 && p > 0) {
      setDepositAmount((Math.round(p * pct) / 100).toString());
    } else {
      setDepositAmount("");
    }
  };

  // Tags
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Gallery images
  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    setError(null);
    try {
      const uploads = Array.from(files).slice(0, 10 - images.length);
      const urls = await Promise.all(
        uploads.map((file) => uploadImage(file, userId, "gallery", "property-images")),
      );
      setImages((prev) => [...prev, ...urls].slice(0, 10));
    } catch {
      setError("Failed to upload images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Amenities toggle
  const toggleAmenity = (slug: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(slug) ? prev.filter((a) => a !== slug) : [...prev, slug],
    );
  };

  // Copy public URL
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/property/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // hasChanges
  const hasChanges = isNew
    ? Boolean(title)
    : Boolean(
      title !== property!.title ||
      description.trim() !== toEditorHtml(property!.description || "").trim() ||
      subcategory !== property!.subcategory ||
      status !== property!.status ||
      city !== property!.city ||
      (communityCustom || community) !== property!.community ||
      (address ?? "") !== (property!.address ?? "") ||
      (bedrooms || "0") !== (property!.beds?.toString() || "0") ||
      (bathrooms || "0") !== (property!.baths?.toString() || "0") ||
      (areaSqft || "") !== (property!.area_sqft?.toString() || "") ||
      (areaSqm || "") !== (property!.area_sqm?.toString() || "") ||
      (floor || "") !== (property!.floor?.toString() || "") ||
      hasBalcony !== property!.has_balcony ||
      hasGarden !== property!.has_garden ||
      (price || "0") !== (property!.price?.toString() || "0") ||
      currency !== property!.currency ||
      (depositPercentage || "") !== (property!.deposit_percentage?.toString() || "") ||
      (depositAmount || "") !== (property!.deposit_amount?.toString() || "") ||
      hasPostHandover !== property!.has_post_handover ||
      (handoverDate || "") !== (property!.handover_date || "") ||
      (paymentPlanMonths || "") !== (property!.payment_plan_months?.toString() || "") ||
      coverImage !== (property!.cover_image ?? "") ||
      JSON.stringify(images) !== JSON.stringify(property!.images) ||
      JSON.stringify(selectedAmenities) !== JSON.stringify(property!.amenities) ||
      JSON.stringify(tags) !== JSON.stringify(property!.tags) ||
      (developerId || "") !== (property!.developer_id ?? "") ||
      (developmentId || "") !== (property!.development_id ?? "") ||
      isActive !== property!.is_active,
    );

  // Save
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const { id: savedId, error: saveError } = await saveProperty({
        id: property?.id,
        title,
        slug,
        description,
        subcategory: subcategory || null,
        status,
        country: property?.country || country,
        city,
        community: communityCustom || community,
        address,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area_sqft: areaSqft ? Number(areaSqft) : null,
        area_sqm: areaSqm ? Number(areaSqm) : null,
        floor: floor ? Number(floor) : null,
        has_balcony: hasBalcony,
        has_garden: hasGarden,
        price: price ? Number(price) : 0,
        currency,
        deposit_percentage: depositPercentage ? Number(depositPercentage) : null,
        deposit_amount: depositAmount ? Number(depositAmount) : null,
        has_post_handover: hasPostHandover,
        handover_date: handoverDate || null,
        payment_plan_months: paymentPlanMonths ? Number(paymentPlanMonths) : null,
        amenities: selectedAmenities,
        tags,
        images,
        cover_image: coverImage || null,
        developer_id: developerId || null,
        development_id: developmentId || null,
        is_active: isActive,
      });

      if (saveError) {
        setError(saveError);
        return;
      }

      if (savedId && milestones.length > 0) {
        const { error: milestoneError } = await saveMilestones({
          property_id: savedId,
          milestones: milestones.map((m, i) => ({
            ...m,
            sort_order: i,
          })),
        });

        if (milestoneError) {
          setError(`Property saved but milestones failed: ${milestoneError}`);
          return;
        }
      }

      router.refresh();
      if (isNew) {
        router.push("/app/properties");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!property?.id) return;
    if (!confirm("Are you sure you want to delete this property?")) return;

    setSaving(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteProperty(property.id);
      if (deleteError) {
        setError(deleteError);
        return;
      }
      router.push("/app/properties");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const groupedAmenities = amenities.reduce(
    (acc, a) => {
      const cat = a.category ?? "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(a);
      return acc;
    },
    {} as Record<string, PropertyAmenity[]>,
  );

  const groupedSubcategories = subcategories.reduce(
    (acc, s) => {
      const cat = s.category ?? "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    },
    {} as Record<string, PropertySubcategory[]>,
  );

  return (
    <div className="max-w-2xl space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <SectionHeading>Basic Information</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Luxury Penthouse in Downtown Dubai"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
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
          <Label>Description</Label>
          <RichTextEditor
            defaultValue={isHtmlText(description) ? description : toEditorHtml(description)}
            onChange={setDescription}
            userId={userId}
            placeholder="Describe the property..."
            bucket="property-images"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              <option value="">None</option>
              {Object.entries(groupedSubcategories).map(([cat, subs]) => (
                <optgroup key={cat} label={cat}>
                  {subs.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <SectionHeading>Location</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={countryLabel} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <select
              value={city}
              onChange={(e) => {
                const newCity = e.target.value;
                setCity(newCity);
                if (
                  community &&
                  !communities.some(
                    (c) => c.slug === community && (!c.city || c.city === newCity),
                  )
                ) {
                  setCommunity("");
                  setCommunityCustom("");
                  setCommunityIsCustom(false);
                }
              }}
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
          <div className="space-y-2">
            <Label>Community</Label>
            <select
              value={communitySelectValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === CUSTOM_VALUE) {
                  setCommunity("");
                  setCommunityCustom("");
                  setCommunityIsCustom(true);
                } else {
                  setCommunity(val);
                  setCommunityCustom("");
                  setCommunityIsCustom(false);
                }
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              <option value="">None</option>
              {filteredCommunities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
              <option value={CUSTOM_VALUE}>Other (type below)</option>
            </select>
            {communitySelectValue === CUSTOM_VALUE && (
              <Input
                value={communityCustom}
                onChange={(e) => setCommunityCustom(e.target.value)}
                placeholder="Type community name"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address (optional)"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <SectionHeading>Property Details</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Floor</Label>
            <Input
              type="number"
              min={0}
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Area (sqft)</Label>
            <Input
              type="number"
              min={0}
              value={areaSqft}
              onChange={(e) => handleAreaSqftChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Area (sqm)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={areaSqm}
              onChange={(e) => setAreaSqm(e.target.value)}
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="has_balcony"
              checked={hasBalcony}
              onCheckedChange={(c) => setHasBalcony(c === true)}
            />
            <Label htmlFor="has_balcony" className="font-normal">
              Balcony
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="has_garden"
              checked={hasGarden}
              onCheckedChange={(c) => setHasGarden(c === true)}
            />
            <Label htmlFor="has_garden" className="font-normal">
              Garden
            </Label>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <SectionHeading>Pricing</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Deposit %</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={depositPercentage}
              onChange={(e) => handleDepositPercentageChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Deposit Amount</Label>
            <Input
              type="number"
              min={0}
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Handover Date</Label>
            <Input
              type="date"
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Plan (months)</Label>
            <Input
              type="number"
              min={0}
              value={paymentPlanMonths}
              onChange={(e) => setPaymentPlanMonths(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="flex items-end pb-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="post_handover"
                checked={hasPostHandover}
                onCheckedChange={(c) => setHasPostHandover(c === true)}
              />
              <Label htmlFor="post_handover" className="font-normal">
                Post Handover
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Plan Milestones */}
      <div className="space-y-4">
        <SectionHeading>Payment Plan Milestones</SectionHeading>
        <MilestonesEditor
          value={milestones}
          onChange={setMilestones}
          propertyPrice={parseFloat(price) || 0}
          currency={currency}
        />
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="space-y-4">
          <SectionHeading>Amenities</SectionHeading>
          {Object.entries(groupedAmenities).map(([cat, items]) => (
            <div key={cat} className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{cat}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(a.slug)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${selectedAmenities.includes(a.slug)
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
        </div>
      )}

      {/* Images */}
      <div className="space-y-4">
        <SectionHeading>Images</SectionHeading>

        <ImageUpload
          label="Cover Image"
          value={coverImage}
          onChange={setCoverImage}
          userId={userId}
          folder="covers"
          bucket="property-images"
        />

        <div className="space-y-2">
          <Label>Gallery Images ({images.length}/10)</Label>
          <div className="grid grid-cols-3 gap-3">
            {images.map((url, i) => (
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
                  onClick={() => removeImage(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {images.length < 10 && (
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
              if (e.target.files) handleGalleryUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <SectionHeading>Tags</SectionHeading>
        <div className="flex gap-2">
          <Input
            ref={tagInputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type a tag and press Enter"
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      {(userRole === "developer" || developments.length > 0) && (
        <div className="space-y-4">
          <SectionHeading>Links</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {developments.length > 0 && (
              <div className="space-y-2">
                <Label>Development</Label>
                <select
                  value={developmentId}
                  onChange={(e) => setDevelopmentId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                >
                  <option value="">None</option>
                  {developments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visibility */}
      <div className="space-y-4">
        <SectionHeading>Visibility</SectionHeading>
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
      </div>

      {/* Actions */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving || !hasChanges}>
          {saving ? "Saving..." : isNew ? "Create Property" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
