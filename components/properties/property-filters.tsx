"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  locationOptions,
  developerOptions,
  categoryOptionDefs,
  priceOptionDefs,
  statusOptionDefs,
  amenityOptionDefs,
  getBedOptions,
  getBathOptions,
  resolveOptions,
  type FilterOption,
} from "@/lib/filter-options";

function FilterDropdown({
  label,
  selected,
  children,
  className,
}: {
  label: string;
  selected?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded border border-[--grey-100] bg-white px-1 py-1 font-body text-sm font-regular text-[--text-primary] transition-colors hover:border-[--primary-main]"
      >
        <span>{selected || label}</span>
        <ChevronDown
          className={`h-2 w-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-1 border border-[--grey-100] bg-white p-1 shadow-lg">
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
  options: FilterOption[];
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
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 rounded-sm px-2 py-1 font-body text-sm font-light text-left transition-colors hover:bg-[--grey-50] ${
            selected === opt.value
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

export function PropertyFilters() {
  const t = useTranslations("properties");
  const [showMore, setShowMore] = useState(false);

  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [status, setStatus] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [developer, setDeveloper] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const categoryOptions = resolveOptions(categoryOptionDefs, t);
  const priceOptions = resolveOptions(priceOptionDefs, t);
  const statusOptions = resolveOptions(statusOptionDefs, t);
  const amenityOptions = resolveOptions(amenityOptionDefs, t);
  const bedOptions = getBedOptions();
  const bathOptions = getBathOptions();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          className=""
          label={t("location")}
          selected={location ? locationOptions.find((o) => o.value === location)?.label : undefined}
        >
          <FilterRadioGroup
            options={locationOptions}
            selected={location}
            onChange={setLocation}
          />
        </FilterDropdown>

        <FilterDropdown
          label={t("category")}
          selected={categories.length > 0 ? `${categories.length} ${t("selected")}` : undefined}
        >
          <FilterCheckboxGroup
            options={categoryOptions}
            selected={categories}
            onChange={setCategories}
          />
        </FilterDropdown>

        <FilterDropdown
          label={t("price_range")}
          selected={priceRange ? priceOptions.find((o) => o.value === priceRange)?.label : undefined}
        >
          <FilterRadioGroup
            options={priceOptions}
            selected={priceRange}
            onChange={setPriceRange}
          />
        </FilterDropdown>

        <FilterDropdown
          label={t("status")}
          selected={status ? statusOptions.find((o) => o.value === status)?.label : undefined}
        >
          <FilterRadioGroup
            options={statusOptions}
            selected={status}
            onChange={setStatus}
          />
        </FilterDropdown>

        <button
          onClick={() => setShowMore(!showMore)}
          className="font-body text-sm font-regular text-[--primary-main] transition-colors hover:underline"
        >
          {showMore ? t("less_filters") : t("more_filters")}
        </button>

        <div className="ml-auto">
          <Link
            href="/properties/properties-list-map-view"
            className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-body text-base font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
          >
            <MapPin className="h-3 w-3" />
            {t("map_view")}
          </Link>
        </div>
      </div>

      {showMore && (
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label={t("beds")}
            selected={beds ? beds : undefined}
          >
            <FilterRadioGroup
              options={bedOptions}
              selected={beds}
              onChange={setBeds}
            />
          </FilterDropdown>

          <FilterDropdown
            label={t("baths")}
            selected={baths ? baths : undefined}
          >
            <FilterRadioGroup
              options={bathOptions}
              selected={baths}
              onChange={setBaths}
            />
          </FilterDropdown>

          <FilterDropdown
            label={t("developer")}
            selected={developer ? developerOptions.find((o) => o.value === developer)?.label : undefined}
          >
            <FilterRadioGroup
              options={developerOptions}
              selected={developer}
              onChange={setDeveloper}
            />
          </FilterDropdown>

          <FilterDropdown
            label={t("amenities")}
            selected={amenities.length > 0 ? `${amenities.length} ${t("selected")}` : undefined}
          >
            <FilterCheckboxGroup
              options={amenityOptions}
              selected={amenities}
              onChange={setAmenities}
            />
          </FilterDropdown>
        </div>
      )}
    </div>
  );
}
