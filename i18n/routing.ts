import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ae", "ar", "br", "es", "gb", "mx", "pt"],
  defaultLocale: "ae",
  localePrefix: "as-needed",
});
