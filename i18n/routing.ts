import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ae", "ar", "br", "mx"],
  defaultLocale: "ae",
  localePrefix: "as-needed",
});
