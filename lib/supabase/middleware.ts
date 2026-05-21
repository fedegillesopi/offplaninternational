import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const protectedRegex = /\/(?:ae|ar|br|mx)?\/?protected(?:\/|$)/;
  const authRegex = /\/(?:ae|ar|br|mx)?\/?auth\/(?!login|sign-up|forgot-password|confirm|error|update-password|sign-up-success)/;

  if (
    !user &&
    (protectedRegex.test(pathname) ||
      authRegex.test(pathname))
  ) {
    const url = request.nextUrl.clone();
    const localeMatch = pathname.match(/^\/(ae|ar|br|mx)\//);
    const localePrefix = localeMatch ? `/${localeMatch[1]}` : "";
    url.pathname = `${localePrefix}/auth/login`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
