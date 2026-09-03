"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BasicInformationSection } from "@/components/platform/property-form/basic-information-section";
import { LocationSection } from "@/components/platform/property-form/location-section";
import { PropertyDetailsSection } from "@/components/platform/property-form/property-details-section";
import { DevelopmentDetailsSection } from "@/components/platform/property-form/development-details-section";
import { TagsSection } from "@/components/platform/property-form/tags-section";
import { AmenitiesSection } from "@/components/platform/property-form/amenities-section";
import { ImagesSection } from "@/components/platform/property-form/images-section";
import { VisibilitySection } from "@/components/platform/property-form/visibility-section";
import { saveProperty, deleteProperty } from "@/lib/actions";
import { uploadImage } from "@/lib/storage";
import { slugify, toEditorHtml } from "@/lib/utils";
import { CUSTOM_VALUE } from "@/lib/property-form";
import type { PropertyData, UserRole } from "@/lib/types";
import type { PropertyAmenity } from "@/lib/property-amenities";
import type { PropertySubcategory } from "@/lib/property-subcategories";
import type { CommunityOption } from "@/lib/communities";

interface PropertyFormProps {
  property: PropertyData | null;
  userId: string;
  userRole: UserRole;
  cities: string[];
  communities: CommunityOption[];
  countryLabel: string;
  country: string;
  amenities: PropertyAmenity[];
  subcategories: PropertySubcategory[];
  developments: { id: string; name: string }[];
  ownDeveloperName?: string;
}

export function PropertyForm({
  property,
  userId,
  userRole,
  cities,
  communities,
  countryLabel,
  country,
  amenities,
  subcategories,
  developments,
  ownDeveloperName = "",
}: PropertyFormProps) {
  const router = useRouter();

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

  // Links + Development Details
  const [developmentId, setDevelopmentId] = useState(property?.development_id ?? "");
  const [development, setDevelopment] = useState(property?.development ?? "");
  const [developmentArea, setDevelopmentArea] = useState(
    property?.development_area?.toString() ?? "",
  );
  const [developerName, setDeveloperName] = useState(
    userRole === "developer" ? ownDeveloperName : (property?.developer ?? ""),
  );

  // Visibility
  const [isActive, setIsActive] = useState(property?.is_active ?? true);

  const slug = slugify(title);

  const cityOptions = city && !cities.includes(city) ? [city, ...cities] : cities;

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

  // City change also resets community if no longer matching
  const handleCityChange = (newCity: string) => {
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
  };

  const handleCommunityChange = (val: string) => {
    if (val === CUSTOM_VALUE) {
      setCommunity("");
      setCommunityCustom("");
      setCommunityIsCustom(true);
    } else {
      setCommunity(val);
      setCommunityCustom("");
      setCommunityIsCustom(false);
    }
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
      (price || "0") !== (property!.price?.toString() || "0") ||
      currency !== property!.currency ||
      (depositPercentage || "") !== (property!.deposit_percentage?.toString() || "") ||
      (depositAmount || "") !== (property!.deposit_amount?.toString() || "") ||
      hasPostHandover !== property!.has_post_handover ||
      (handoverDate || "") !== (property!.handover_date || "") ||
      coverImage !== (property!.cover_image ?? "") ||
      JSON.stringify(images) !== JSON.stringify(property!.images) ||
      JSON.stringify(selectedAmenities) !== JSON.stringify(property!.amenities) ||
      JSON.stringify(tags) !== JSON.stringify(property!.tags) ||
      (development || "") !== (property!.development || "") ||
      (developmentArea || "") !== (property!.development_area?.toString() || "") ||
      (developerName || "") !== (property!.developer ?? "") ||
      (developmentId || "") !== (property!.development_id ?? "") ||
      isActive !== property!.is_active,
    );

  // Save
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const { error: saveError } = await saveProperty({
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
        price: price ? Number(price) : 0,
        currency,
        deposit_percentage: depositPercentage ? Number(depositPercentage) : null,
        deposit_amount: depositAmount ? Number(depositAmount) : null,
        has_post_handover: hasPostHandover,
        handover_date: handoverDate || null,
        amenities: selectedAmenities,
        tags,
        images,
        cover_image: coverImage || null,
        development: development || null,
        development_area: developmentArea ? Number(developmentArea) : null,
        developer: developerName || null,
        development_id: developmentId || null,
        is_active: isActive,
      });

      if (saveError) {
        setError(saveError);
        return;
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
      <BasicInformationSection
        title={title}
        slug={slug}
        description={description}
        subcategory={subcategory}
        status={status}
        userId={userId}
        groupedSubcategories={groupedSubcategories}
        copied={copied}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSubcategoryChange={setSubcategory}
        onStatusChange={setStatus}
        onCopy={handleCopy}
      />

      <LocationSection
        countryLabel={countryLabel}
        city={city}
        cityOptions={cityOptions}
        community={community}
        communityIsCustom={communityIsCustom}
        communityCustom={communityCustom}
        filteredCommunities={filteredCommunities}
        address={address}
        onCityChange={handleCityChange}
        onCommunityChange={handleCommunityChange}
        onCommunityCustomChange={setCommunityCustom}
        onAddressChange={setAddress}
      />

      <PropertyDetailsSection
        bedrooms={bedrooms}
        bathrooms={bathrooms}
        floor={floor}
        areaSqft={areaSqft}
        areaSqm={areaSqm}
        price={price}
        currency={currency}
        depositPercentage={depositPercentage}
        depositAmount={depositAmount}
        hasPostHandover={hasPostHandover}
        handoverDate={handoverDate}
        onBedroomsChange={setBedrooms}
        onBathroomsChange={setBathrooms}
        onFloorChange={setFloor}
        onAreaSqftChange={handleAreaSqftChange}
        onAreaSqmChange={setAreaSqm}
        onPriceChange={setPrice}
        onCurrencyChange={setCurrency}
        onDepositPercentageChange={handleDepositPercentageChange}
        onDepositAmountChange={setDepositAmount}
        onHasPostHandoverChange={setHasPostHandover}
        onHandoverDateChange={setHandoverDate}
      />

      <DevelopmentDetailsSection
        userRole={userRole}
        developments={developments}
        developmentId={developmentId}
        development={development}
        developmentArea={developmentArea}
        developerName={developerName}
        onDevelopmentIdChange={setDevelopmentId}
        onDevelopmentChange={setDevelopment}
        onDevelopmentAreaChange={setDevelopmentArea}
        onDeveloperNameChange={setDeveloperName}
      />

      <TagsSection
        tags={tags}
        tagInput={tagInput}
        onTagInputChange={setTagInput}
        onAdd={addTag}
        onRemove={removeTag}
      />

      {amenities.length > 0 && (
        <AmenitiesSection
          groupedAmenities={groupedAmenities}
          selectedAmenities={selectedAmenities}
          onToggle={toggleAmenity}
        />
      )}

      <ImagesSection
        coverImage={coverImage}
        images={images}
        uploadingGallery={uploadingGallery}
        userId={userId}
        onCoverChange={setCoverImage}
        onGalleryFiles={handleGalleryUpload}
        onRemoveImage={removeImage}
      />

      <VisibilitySection
        isActive={isActive}
        saving={saving}
        hasChanges={hasChanges}
        isNew={isNew}
        error={error}
        onActiveChange={setIsActive}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => router.push("/app/properties")}
      />
    </div>
  );
}
