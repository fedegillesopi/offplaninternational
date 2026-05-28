"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  type Currency,
  currencies,
  availableCurrencies,
  CURRENCY_COOKIE,
  CURRENCY_COOKIE_MAX_AGE,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (code: string) => void;
  availableCurrencies: Currency[];
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [currency, setCurrencyState] = useState<Currency>(
    currencies.USD,
  );

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CURRENCY_COOKIE}=`))
      ?.split("=")[1];

    if (cookieValue) {
      const found = availableCurrencies.find((c) => c.code === cookieValue);
      if (found) {
        setCurrencyState(found);
      }
    }
  }, [locale]);

  const setCurrency = useCallback((code: string) => {
    const found = availableCurrencies.find((c) => c.code === code);
    if (found) {
      setCurrencyState(found);
      document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=${CURRENCY_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, availableCurrencies }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a <CurrencyProvider>");
  }
  return ctx;
}
