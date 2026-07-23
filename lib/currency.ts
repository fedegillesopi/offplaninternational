export type Currency = {
  code: string;
  symbol: string;
  locale: string;
};

export const currencies: Record<string, Currency> = {
  AED: { code: "AED", symbol: "د.إ", locale: "ar-AE" },
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
};

export const availableCurrencies: Currency[] = [
  currencies.AED,
  currencies.USD,
  currencies.EUR,
  currencies.GBP,
];

export const localeDefaultCurrency: Record<string, Currency> = {
  ae: currencies.AED,
  ar: currencies.USD,
  br: currencies.USD,
  es: currencies.EUR,
  gb: currencies.GBP,
  mx: currencies.USD,
  pt: currencies.EUR,
};

export function getDefaultCurrencyFromLocale(locale: string): Currency {
  return localeDefaultCurrency[locale] ?? currencies.AED;
}

export function formatPrice(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
}

export const CURRENCY_COOKIE = "NEXT_CURRENCY";
export const CURRENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
