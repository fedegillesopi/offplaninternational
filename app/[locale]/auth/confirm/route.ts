import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const VALID_TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change"];
  const type = rawType && VALID_TYPES.includes(rawType as EmailOtpType)
    ? (rawType as EmailOtpType)
    : null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role, profile_completed")
          .eq("id", user.id)
          .single();

        if (profile && !profile.profile_completed) {
          redirect(`/auth/onboarding/${profile.role}`);
        }

        redirect("/app");
      }

      redirect("/app");
    } else {
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  redirect("/auth/error?error=No token hash or type");
}
