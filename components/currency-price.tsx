"use client";

import { useCurrency } from "@/components/currency-provider";
import { convertPrice } from "@/lib/exchange-rates";
import { formatPrice } from "@/lib/currency";

export function CurrencyPrice({
  basePrice,
  baseCurrency = "AED",
  className,
}: {
  basePrice: number;
  baseCurrency?: string;
  className?: string;
}) {
  const { currency } = useCurrency();
  const converted = convertPrice(basePrice, baseCurrency, currency.code);
  const formatted = formatPrice(converted, currency);

  return <span className={className}>{formatted}</span>;
}
