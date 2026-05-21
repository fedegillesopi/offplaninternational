"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface DropdownProps {
  label: string;
  multi?: boolean;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function Dropdown({ label, multi, options, selected, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayText = selected.length === 0
    ? label
    : multi
      ? `${selected.length} selected`
      : selected[0];

  const toggle = (value: string) => {
    if (multi) {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    } else {
      onChange([value]);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-1 bg-[--primary-main] px-3 py-2 text-left text-white"
      >
        <span className="truncate font-heading text-base">{displayText}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-1 bg-white shadow-lg">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggle(option)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-body text-sm text-[--text-primary] hover:bg-gray-100"
              >
                {multi && (
                  <div
                    className={`size-4 shrink-0 rounded border ${
                      isSelected
                        ? "border-[--primary-main] bg-[--primary-main]"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 16 16" fill="white" className="size-4">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                    )}
                  </div>
                )}
                <span className={isSelected ? "font-medium" : ""}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function HeroHeader() {
  const t = useTranslations("hero");
  const searchT = useTranslations("search");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const categoryOptions = [
    searchT("category_options.apartment"),
    searchT("category_options.villa"),
    searchT("category_options.townhouse"),
    searchT("category_options.penthouse"),
    searchT("category_options.duplex"),
    searchT("category_options.studio"),
    searchT("category_options.commercial"),
    searchT("category_options.land"),
  ];

  const priceOptions = [
    searchT("price_options.under", { amount: 500 }),
    searchT("price_options.range", { min: 500, max: 1 }),
    searchT("price_options.range", { min: 1, max: 2 }),
    searchT("price_options.range_2", { min: 2, max: 5 }),
    searchT("price_options.range_2", { min: 5, max: 10 }),
    searchT("price_options.above", { amount: 10 }),
  ];

  const statusOptions = [
    searchT("status_options.ready"),
    searchT("status_options.construction"),
    searchT("status_options.launching"),
    searchT("status_options.completed"),
  ];

  return (
    <section className="flex items-center justify-center bg-[--text-primary] px-3 py-10 md:px-6 md:py-10"
    style={{
            backgroundImage: "url('/images/miscelaneous/worldBack.png')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}>
      <div className="flex w-full max-w-[900px] flex-col items-center gap-7">
        <div
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1 className="font-heading text-h1 text-white">
            {t("title")}
          </h1>
          <p className="font-body text-subtitle-1 text-white/80">
            {t("subtitle")}
            {t("subtitle_prefix")}
            <span className="font-heading text-[--primary-main]">
              {t("subtitle_highlight")}
            </span>
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full rounded-1 bg-white px-4 py-3 font-body text-base text-[--text-primary] outline-none placeholder:text-gray-400"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Search size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Dropdown
              label={searchT("category")}
              multi
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
            <Dropdown
              label={searchT("price_range")}
              options={priceOptions}
              selected={selectedPrice}
              onChange={setSelectedPrice}
            />
            <Dropdown
              label={searchT("status")}
              options={statusOptions}
              selected={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
