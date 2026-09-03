import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "br", "es", "gb", "mx", "pt"],
  defaultLocale: "en",
  localePrefix: "never",
});
