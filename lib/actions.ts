"use server";

import { createClient } from "@/lib/supabase/server";
import { sanitizeUserHtml } from "@/lib/sanitize-html";

export interface SaveDeveloperPayload {
  id?: string;
  name: string;
  slug: string;
  description: string;
  city: string | null;
  cover_image: string | null;
  logo_url: string | null;
  website: string | null;
  on_time_completion: number | null;
  email: string;
  phone: string;
  country: string;
}

const MAX_DESCRIPTION = 20_000;
const MAX_NAME = 120;
const MAX_EMAIL = 320;
const MAX_PHONE = 50;

function isValidWebsite(url: string): boolean {
  if (!/^https?:\/\/.+/i.test(url)) return false;
  try {
    return Boolean(new URL(url).hostname);
  } catch {
    return false;
  }
}

export async function saveDeveloperProfile(
  payload: SaveDeveloperPayload,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const name = payload.name.trim();
  let website = payload.website?.trim() || null;
  if (website && !/^https?:\/\//i.test(website)) {
    website = `https://${website}`;
  }
  const description = sanitizeUserHtml(payload.description);

  if (!name) return { error: "Company name is required." };
  if (name.length > MAX_NAME) return { error: "Company name is too long." };
  if (!/^[a-z0-9-]+$/.test(payload.slug)) return { error: "Invalid slug." };
  if (description.length > MAX_DESCRIPTION) {
    return { error: "Description is too long." };
  }
  if (payload.email.length > MAX_EMAIL) return { error: "Email is too long." };
  if (payload.phone.length > MAX_PHONE) return { error: "Phone is too long." };
  if (website && !isValidWebsite(website)) {
    return { error: "Website must be a valid http(s) URL." };
  }
  if (
    payload.on_time_completion !== null &&
    (payload.on_time_completion < 0 || payload.on_time_completion > 100)
  ) {
    return { error: "On-time completion must be between 0 and 100." };
  }

  const fields = {
    name,
    slug: payload.slug,
    description,
    city: payload.city,
    cover_image: payload.cover_image,
    logo_url: payload.logo_url,
    website,
    on_time_completion: payload.on_time_completion,
    email: payload.email,
    phone: payload.phone,
  };

  let dbError: { message: string } | null;

  if (payload.id) {
    const { error } = await supabase
      .from("developers")
      .update(fields)
      .eq("id", payload.id)
      .eq("user_profile_id", user.id);
    dbError = error;
  } else {
    const { error } = await supabase
      .from("developers")
      .insert({ ...fields, country: payload.country, user_profile_id: user.id });
    dbError = error;
  }

  if (dbError) {
    console.error("saveDeveloperProfile:", dbError.message);
    return { error: "Could not save your profile. Please try again." };
  }

  return { error: null };
}

export interface SaveBrokerPayload {
  id?: string;
  name: string;
  slug: string;
  profile_image: string | null;
  personal_url: string | null;
  description: string;
  country: string | null;
  city: string | null;
  email_public: string;
  phone: string;
  whatsapp: string;
  closed_transactions: number | null;
}

const MAX_CLOSED_TRANSACTIONS = 100_000;

export async function saveBrokerProfile(
  payload: SaveBrokerPayload,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const name = payload.name.trim();
  let personalUrl = payload.personal_url?.trim() || null;
  if (personalUrl && !/^https?:\/\//i.test(personalUrl)) {
    personalUrl = `https://${personalUrl}`;
  }
  const description = sanitizeUserHtml(payload.description);

  if (!name) return { error: "Name is required." };
  if (name.length > MAX_NAME) return { error: "Name is too long." };
  if (!/^[a-z0-9-]+$/.test(payload.slug)) return { error: "Invalid slug." };
  if (description.length > MAX_DESCRIPTION) {
    return { error: "Description is too long." };
  }
  if (payload.email_public.length > MAX_EMAIL) {
    return { error: "Email is too long." };
  }
  if (payload.phone.length > MAX_PHONE) return { error: "Phone is too long." };
  if (payload.whatsapp.length > MAX_PHONE) {
    return { error: "WhatsApp number is too long." };
  }
  if (personalUrl && !isValidWebsite(personalUrl)) {
    return { error: "Personal URL must be a valid http(s) URL." };
  }
  if (
    payload.closed_transactions !== null &&
    (payload.closed_transactions < 0 ||
      payload.closed_transactions > MAX_CLOSED_TRANSACTIONS)
  ) {
    return {
      error: `Closed transactions must be between 0 and ${MAX_CLOSED_TRANSACTIONS}.`,
    };
  }

  const fields = {
    name,
    slug: payload.slug,
    profile_image: payload.profile_image,
    personal_url: personalUrl,
    description,
    country: payload.country,
    city: payload.city,
    email_public: payload.email_public,
    phone: payload.phone,
    whatsapp: payload.whatsapp,
    closed_transactions: payload.closed_transactions ?? 0,
  };

  let dbError: { message: string } | null;

  if (payload.id) {
    const { error } = await supabase
      .from("broker_profiles")
      .update(fields)
      .eq("id", payload.id)
      .eq("user_profile_id", user.id);
    dbError = error;
  } else {
    const { error } = await supabase
      .from("broker_profiles")
      .insert({ ...fields, user_profile_id: user.id });
    dbError = error;
  }

  if (dbError) {
    console.error("saveBrokerProfile:", dbError.message);
    return { error: "Could not save your profile. Please try again." };
  }

  return { error: null };
}

// ── Properties ──────────────────────────────────────────────────────────────

export interface SavePropertyPayload {
  id?: string;
  title: string;
  slug: string;
  description: string;
  subcategory: string | null;
  status: string;
  country: string;
  city: string;
  community: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  area_sqm: number | null;
  floor: number | null;
  price: number;
  currency: string;
  deposit_percentage: number | null;
  deposit_amount: number | null;
  has_post_handover: boolean;
  handover_date: string | null;
  amenities: string[];
  tags: string[];
  images: string[];
  cover_image: string | null;
  development: string | null;
  development_area: number | null;
  developer: string | null;
  development_id: string | null;
  is_active: boolean;
}

const MAX_TITLE = 200;
const MAX_ADDRESS = 500;
const MAX_COMMUNITY = 200;
const MAX_DEVELOPMENT = 200;
const MAX_DEVELOPER = 200;

const STATUSES = ["available", "sold", "reserved", "off_market"];
const CURRENCIES = ["AED", "USD", "EUR", "GBP"];

function toNull(v: string | undefined | null): string | null {
  if (v === undefined || v === null) return null;
  const t = v.trim();
  return t === "" ? null : t;
}

function toNumNull(v: number | string | null | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = typeof v === "string" ? Number(v.trim()) : v;
  return Number.isFinite(n) ? n : null;
}

export async function saveProperty(
  payload: SavePropertyPayload,
): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { id: null, error: "You must be signed in." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const listed_by_type = profile?.role ?? null;
  if (
    !listed_by_type ||
    !["developer", "broker", "private_seller"].includes(listed_by_type)
  ) {
    return { id: null, error: "Invalid user role." };
  }

  const title = payload.title.trim();
  const slug = payload.slug.trim();
  const description = sanitizeUserHtml(payload.description);
  const community = toNull(payload.community);
  const address = toNull(payload.address);
  const subcategory = toNull(payload.subcategory);
  const development = toNull(payload.development);
  const developer = toNull(payload.developer);

  if (!title) return { id: null, error: "Title is required." };
  if (title.length > MAX_TITLE) return { id: null, error: "Title is too long." };
  if (!/^[a-z0-9-]+$/.test(slug)) return { id: null, error: "Invalid slug." };
  if (description.length > MAX_DESCRIPTION) {
    return { id: null, error: "Description is too long." };
  }
  if (!STATUSES.includes(payload.status)) {
    return { id: null, error: "Invalid status." };
  }
  if (!CURRENCIES.includes(payload.currency)) {
    return { id: null, error: "Invalid currency." };
  }
  if (!payload.price || payload.price <= 0) {
    return { id: null, error: "Price must be greater than 0." };
  }
  if (community && community.length > MAX_COMMUNITY) {
    return { id: null, error: "Community is too long." };
  }
  if (address && address.length > MAX_ADDRESS) {
    return { id: null, error: "Address is too long." };
  }
  if (subcategory && subcategory.length > 200) {
    return { id: null, error: "Subcategory is too long." };
  }
  if (subcategory) {
    const { data: subcat, error: subcatError } = await supabase
      .from("property_subcategories")
      .select("slug")
      .eq("slug", subcategory)
      .eq("is_active", true)
      .maybeSingle();
    if (subcatError || !subcat) {
      return { id: null, error: "Invalid subcategory." };
    }
  }
  if (
    payload.deposit_percentage !== null &&
    (payload.deposit_percentage < 0 || payload.deposit_percentage > 100)
  ) {
    return {
      id: null,
      error: "Deposit percentage must be between 0 and 100.",
    };
  }
  if (development && development.length > MAX_DEVELOPMENT) {
    return { id: null, error: "Development is too long." };
  }
  if (developer && developer.length > MAX_DEVELOPER) {
    return { id: null, error: "Developer is too long." };
  }
  if (
    payload.development_area !== null &&
    payload.development_area !== undefined &&
    Number(payload.development_area) < 0
  ) {
    return { id: null, error: "Development area must be positive." };
  }

  let area_sqft = toNumNull(payload.area_sqft);
  let area_sqm = toNumNull(payload.area_sqm);
  if (area_sqft && !area_sqm) area_sqm = Math.round(area_sqft * 0.092903 * 100) / 100;
  if (area_sqm && !area_sqft) area_sqft = Math.round(area_sqm / 0.092903 * 100) / 100;

  let deposit_amount = toNumNull(payload.deposit_amount);
  if (payload.deposit_percentage && !deposit_amount) {
    deposit_amount = Math.round(payload.price * payload.deposit_percentage) / 100;
  }

  let developer_id: string | null = null;
  let developer_name: string | null = null;
  if (listed_by_type === "developer") {
    const { data: dev } = await supabase
      .from("developers")
      .select("id, name")
      .eq("user_profile_id", user.id)
      .maybeSingle();
    developer_id = dev?.id ?? null;
    developer_name = dev?.name ?? null;
  }

  let development_id = toNull(payload.development_id);
  if (!development_id) {
    development_id = null;
  } else if (listed_by_type !== "developer") {
    development_id = null;
  } else {
    const { data: devt, error: devtError } = await supabase
      .from("developments")
      .select("id")
      .eq("id", development_id)
      .eq("developer_id", developer_id ?? "")
      .eq("is_active", true)
      .maybeSingle();
    if (devtError || !devt) {
      return { id: null, error: "Invalid development." };
    }
  }

  const fields = {
    title,
    slug,
    description,
    subcategory,
    status: payload.status,
    country: payload.country,
    city: payload.city.trim(),
    community,
    address,
    bedrooms: toNumNull(payload.bedrooms),
    bathrooms: toNumNull(payload.bathrooms),
    area_sqft,
    area_sqm,
    floor: toNumNull(payload.floor),
    price: payload.price,
    currency: payload.currency,
    deposit_percentage: toNumNull(payload.deposit_percentage),
    deposit_amount,
    has_post_handover: payload.has_post_handover,
    handover_date: toNull(payload.handover_date),
    amenities: payload.amenities,
    tags: payload.tags,
    images: payload.images,
    cover_image: payload.cover_image,
    development,
    development_area: toNumNull(payload.development_area),
    developer: listed_by_type === "developer" ? developer_name : developer,
    developer_id,
    development_id,
    is_active: payload.is_active,
  };

  let dbError: { message: string } | null;
  let savedId: string | null = payload.id ?? null;

  if (payload.id) {
    const { data, error } = await supabase
      .from("properties")
      .update(fields)
      .eq("id", payload.id)
      .eq("listed_by_id", user.id)
      .select("id")
      .maybeSingle();
    dbError = error;
    savedId = data?.id ?? null;
  } else {
    const { data, error } = await supabase
      .from("properties")
      .insert({ ...fields, listed_by_id: user.id, listed_by_type })
      .select("id")
      .maybeSingle();
    dbError = error;
    savedId = data?.id ?? null;
  }

  if (dbError) {
    console.error("saveProperty:", dbError.message);
    return { id: null, error: "Could not save property. Please try again." };
  }

  return { id: savedId, error: null };
}

export async function deleteProperty(
  propertyId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId)
    .eq("listed_by_id", user.id);

  if (error) {
    console.error("deleteProperty:", error.message);
    return { error: "Could not delete property. Please try again." };
  }

  return { error: null };
}

