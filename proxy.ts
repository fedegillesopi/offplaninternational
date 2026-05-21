import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    /\/(?:ae|ar|br|mx)?\/?(?:auth|protected)/.test(pathname);

  if (isAuthRoute) {
    return await updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
