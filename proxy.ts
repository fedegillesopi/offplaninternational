import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const locales = routing.locales as readonly string[];
const localePattern = locales.join("|");
const authRouteRegex = new RegExp(`\\/(?:${localePattern})?\\/?(?:auth|protected)`);
const appRouteRegex = /^\/(?:app|login|signup)(?:\/|$)/;

function stripLocalePrefix(pathname: string): string | null {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStandaloneRoute = appRouteRegex.test(pathname);

  if (isStandaloneRoute) {
    return await updateSession(request);
  }

  if (authRouteRegex.test(pathname)) {
    const sessionResponse = await updateSession(request);
    if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
      return sessionResponse;
    }
    return intlMiddleware(request);
  }

  const cleanPath = stripLocalePrefix(pathname);
  if (cleanPath !== null) {
    const url = request.nextUrl.clone();
    url.pathname = cleanPath;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
