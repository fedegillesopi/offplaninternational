"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { DeveloperCardData } from "@/lib/developers";
import { DeveloperCard } from "@/components/site/developer-card";
import { stripHtmlToText } from "@/lib/utils";

interface DevelopersGridProps {
  developers: DeveloperCardData[];
}

export function DevelopersGrid({ developers }: DevelopersGridProps) {
  const t = useTranslations("developers");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return developers;
    return developers.filter((d) =>
      [d.name, stripHtmlToText(d.description), d.slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q)),
    );
  }, [developers, query]);

  return (
    <>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[--grey-300]" />
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-1 border border-[--grey-200] bg-white py-3 pl-12 pr-4 font-body text-base text-[--text-primary] outline-none placeholder:text-[--grey-300]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mb-10 font-body text-base text-[--grey-300]">{t("no_results")}</p>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dev) => (
            <DeveloperCard
              key={dev.slug}
              name={dev.name}
              description={dev.description}
              image={dev.image}
              logo={dev.logo}
              slug={dev.slug}
            />
          ))}
        </div>
      )}
    </>
  );
}
