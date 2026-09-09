"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  EMPTY_FILTERS,
  buildQueryString,
  type FilterOptions,
  type PropertyFilters,
} from "@/lib/filter-options";

function FilterDropdown({
  label,
  selected,
  children,
}: {
  label: string;
  selected?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-2 rounded-md border border-[--grey-100] bg-white px-3 font-body text-sm font-regular text-[--text-primary] transition-colors hover:border-[--primary-main]"
      >
        <span>{selected || label}</span>
        <ChevronDown
          className={`h-2 w-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-[280px] min-w-[220px] overflow-y-auto rounded-md border border-[--grey-100] bg-white p-1 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterCheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-1">
      {options.map((opt) => {
        const isChecked = selected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 font-body text-sm font-light text-[--text-primary] hover:bg-[--grey-50]"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                onChange(
                  isChecked
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value],
                );
              }}
              className="h-4 w-4 accent-[--primary-main]"
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

function FilterRadioGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 rounded-sm px-2 py-1 font-body text-sm font-light text-left transition-colors hover:bg-[--grey-50] ${selected === opt.value
              ? "bg-[--primary-light] text-[--primary-dark]"
              : "text-[--text-primary]"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface PropertyFiltersProps {
  options: FilterOptions;
  filters: PropertyFilters;
}

type SingleKey = "location" | "price" | "status" | "beds" | "baths" | "developer";

export function PropertyFilters({ options, filters }: PropertyFiltersProps) {
  const t = useTranslations("properties");
  const router = useRouter();
  const pathname = usePathname();

  const update = (patch: Partial<PropertyFilters>) => {
    router.replace(`${pathname}?${buildQueryString({ ...filters, ...patch }, 1)}`);
  };

  const setSingle = (key: SingleKey, value: string) => {
    update({ [key]: filters[key] === value ? "" : value });
  };

  const label = (value: string, opts: { value: string; label: string }[]) =>
    opts.find((o) => o.value === value)?.label ?? value;

  const selectedCount = (count: number) => `${count} ${t("selected")}`;

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.location) {
    chips.push({
      key: "location",
      label: label(filters.location, options.locations),
      onRemove: () => update({ location: "" }),
    });
  }
  for (const c of filters.categories) {
    chips.push({
      key: `category-${c}`,
      label: label(c, options.categories),
      onRemove: () =>
        update({ categories: filters.categories.filter((v) => v !== c) }),
    });
  }
  if (filters.price) {
    chips.push({
      key: "price",
      label: label(filters.price, options.prices),
      onRemove: () => update({ price: "" }),
    });
  }
  if (filters.status) {
    chips.push({
      key: "status",
      label: label(filters.status, options.statuses),
      onRemove: () => update({ status: "" }),
    });
  }
  if (filters.beds) {
    chips.push({
      key: "beds",
      label: `${t("beds")}: ${filters.beds}`,
      onRemove: () => update({ beds: "" }),
    });
  }
  if (filters.baths) {
    chips.push({
      key: "baths",
      label: `${t("baths")}: ${filters.baths}`,
      onRemove: () => update({ baths: "" }),
    });
  }
  if (filters.developer) {
    chips.push({
      key: "developer",
      label: label(filters.developer, options.developers),
      onRemove: () => update({ developer: "" }),
    });
  }
  for (const a of filters.amenities) {
    chips.push({
      key: `amenity-${a}`,
      label: label(a, options.amenities),
      onRemove: () =>
        update({ amenities: filters.amenities.filter((v) => v !== a) }),
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {options.locations.length > 0 && (
          <FilterDropdown
            label={t("location")}
            selected={filters.location ? label(filters.location, options.locations) : undefined}
          >
            <FilterRadioGroup
              options={options.locations}
              selected={filters.location}
              onChange={(v) => setSingle("location", v)}
            />
          </FilterDropdown>
        )}

        {options.categories.length > 0 && (
          <FilterDropdown
            label={t("category")}
            selected={
              filters.categories.length > 0 ? selectedCount(filters.categories.length) : undefined
            }
          >
            <FilterCheckboxGroup
              options={options.categories}
              selected={filters.categories}
              onChange={(v) => update({ categories: v })}
            />
          </FilterDropdown>
        )}

        {options.prices.length > 0 && (
          <FilterDropdown
            label={t("price_range")}
            selected={filters.price ? label(filters.price, options.prices) : undefined}
          >
            <FilterRadioGroup
              options={options.prices}
              selected={filters.price}
              onChange={(v) => setSingle("price", v)}
            />
          </FilterDropdown>
        )}

        {options.statuses.length > 0 && (
          <FilterDropdown
            label={t("status")}
            selected={filters.status ? label(filters.status, options.statuses) : undefined}
          >
            <FilterRadioGroup
              options={options.statuses}
              selected={filters.status}
              onChange={(v) => setSingle("status", v)}
            />
          </FilterDropdown>
        )}

        <FilterDropdown label={t("beds")} selected={filters.beds ?? undefined}>
          <FilterRadioGroup
            options={options.beds}
            selected={filters.beds}
            onChange={(v) => setSingle("beds", v)}
          />
        </FilterDropdown>

        <FilterDropdown label={t("baths")} selected={filters.baths ?? undefined}>
          <FilterRadioGroup
            options={options.baths}
            selected={filters.baths}
            onChange={(v) => setSingle("baths", v)}
          />
        </FilterDropdown>

        {options.developers.length > 0 && (
          <FilterDropdown
            label={t("developer")}
            selected={filters.developer ? label(filters.developer, options.developers) : undefined}
          >
            <FilterRadioGroup
              options={options.developers}
              selected={filters.developer}
              onChange={(v) => setSingle("developer", v)}
            />
          </FilterDropdown>
        )}

        {options.amenities.length > 0 && (
          <FilterDropdown
            label={t("amenities")}
            selected={
              filters.amenities.length > 0 ? selectedCount(filters.amenities.length) : undefined
            }
          >
            <FilterCheckboxGroup
              options={options.amenities}
              selected={filters.amenities}
              onChange={(v) => update({ amenities: v })}
            />
          </FilterDropdown>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 rounded-full border border-[--primary-main] bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-dark] transition-colors hover:bg-[--primary-main] hover:text-white"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => update(EMPTY_FILTERS)}
            className="font-body text-sm font-regular text-[--grey-300] underline transition-colors hover:text-[--primary-main]"
          >
            {t("clear_filters")}
          </button>
        </div>
      )}
    </div>
  );
}