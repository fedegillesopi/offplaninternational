import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const COUNTRY_LOCALE: Record<string, string> = {
  AR: "ar",
  BR: "br",
  ES: "es",
  GB: "gb",
  MX: "mx",
  PT: "pt",
};

const locales = routing.locales as readonly string[];
const localePattern = locales.join("|");
const authRouteRegex = new RegExp(`\\/(?:${localePattern})?\\/?(?:auth|protected)`);
const dashboardRouteRegex = /^\/(?:dashboard|login|signup)(?:\/|$)/;

function getLocaleFromCountry(country: string | null | undefined): string | null {
  if (!country) return null;
  return COUNTRY_LOCALE[country.toUpperCase()] ?? null;
}

function pathHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRouteRegex.test(pathname) || dashboardRouteRegex.test(pathname);

  if (isAuthRoute) {
    return await updateSession(request);
  }

  if (pathname === "/" && !pathHasLocale(pathname)) {
    const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;

    if (localeCookie && locales.includes(localeCookie)) {
      if (localeCookie !== routing.defaultLocale) {
        const url = request.nextUrl.clone();
        url.pathname = `/${localeCookie}`;
        return NextResponse.redirect(url);
      }
      return intlMiddleware(request);
    }

    const detectedCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cloudfront-viewer-country") ||
      request.headers.get("cf-ipcountry") ||
      null;
    const detectedLocale = getLocaleFromCountry(detectedCountry);

    if (detectedLocale && detectedLocale !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", detectedLocale, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
