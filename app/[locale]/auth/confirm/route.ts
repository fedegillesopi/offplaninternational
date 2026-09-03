import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");

  const VALID_TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change"];
  const type = rawType && VALID_TYPES.includes(rawType as EmailOtpType)
    ? (rawType as EmailOtpType)
    : null;

  // PKCE flow: exchange code for session
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, origin),
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, profile_completed")
        .eq("id", user.id)
        .single();

      if (profile && !profile.profile_completed) {
        return NextResponse.redirect(new URL(`/auth/onboarding/${profile.role}`, origin));
      }
    }

    return NextResponse.redirect(new URL("/app", origin));
  }

  // Legacy flow: verify OTP with token_hash
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, origin),
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, profile_completed")
        .eq("id", user.id)
        .single();

      if (profile && !profile.profile_completed) {
        return NextResponse.redirect(new URL(`/auth/onboarding/${profile.role}`, origin));
      }
    }

    return NextResponse.redirect(new URL("/app", origin));
  }

  // No PKCE code or token_hash found — might be implicit flow with hash fragment.
  // Redirect to a client page that can read window.location.hash.
  return NextResponse.redirect(
    new URL(`/auth/confirm-client?redirect=${encodeURIComponent(request.url)}`, origin),
  );
}
