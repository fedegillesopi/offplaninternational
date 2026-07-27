"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "./currency-provider";
import { useClickOutside } from "@/hooks/use-click-outside";

export function CurrencySwitcher() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-1 border border-white/30 px-2 py-1 text-sm text-white transition-colors hover:border-[--primary-main] hover:text-[--primary-main]"
        aria-label="Select currency"
      >
        <span className="font-heading">{currency.symbol}</span>
        <span className="font-heading text-xs">{currency.code}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[70px] rounded-1 bg-white shadow-lg">
          {availableCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-center px-2 py-2 text-center font-body text-sm transition-colors hover:bg-gray-100 ${c.code === currency.code
                ? "font-medium text-[--primary-main]"
                : "text-[--text-primary]"
                }`}
            >
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
