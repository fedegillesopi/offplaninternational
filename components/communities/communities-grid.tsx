"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { Community } from "@/lib/communities";
import { CommunityCard } from "@/components/site/community-card";

interface CommunitiesGridProps {
  communities: Community[];
}

export function CommunitiesGrid({ communities }: CommunitiesGridProps) {
  const t = useTranslations("communities");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter((c) =>
      [c.name, c.city, c.location, ...c.tags]
        .filter((v): v is string => Boolean(v))
        .some((value) => value.toLowerCase().includes(q)),
    );
  }, [communities, query]);

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
          {filtered.map((c) => (
            <CommunityCard
              key={c.id}
              name={c.name}
              shortDescription={c.short_description ?? ""}
              image={c.highlight_image ?? ""}
              slug={c.slug}
            />
          ))}
        </div>
      )}
    </>
  );
}
