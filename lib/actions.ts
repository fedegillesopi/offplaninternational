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
