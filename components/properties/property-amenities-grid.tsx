"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";

function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\.\w*/g, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const VISIBLE_COUNT = 4;

export function PropertyAmenitiesGrid({
  amenities,
  amenityNames,
  title,
}: {
  amenities: string[];
  amenityNames?: Record<string, string>;
  title: string;
}) {
  const t = useTranslations("property_detail");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const filtered = amenities.map((key) => {
    const name = amenityNames?.[key] ?? humanizeSlug(key);
    return { slug: key, name };
  });

  if (filtered.length === 0) return null;

  const visible = filtered.slice(0, VISIBLE_COUNT);
  const hasMore = filtered.length > VISIBLE_COUNT;

  return (
    <>
      <div>
        <h3 className="mb-4 font-heading text-h4 font-bold text-[--text-primary]">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {visible.map(({ slug, name }) => (
            <div
              key={slug}
              className="flex flex-col items-center gap-1 rounded-1 bg-[--primary-light] p-2 text-center"
              style={{ width: "100px", height: "100px" }}
            >
              <span className="flex h-8 w-8 items-center justify-center text-[--primary-main]">
                <Check className="h-5 w-5" />
              </span>
              <span className="font-body text-sm font-regular text-[--primary-main]">
                {name}
              </span>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex flex-col items-center justify-center rounded-1 border-2 border-[--primary-main] bg-white p-2 text-center transition-colors hover:bg-[--primary-light]"
              style={{ width: "100px", height: "100px" }}
            >
              <span className="font-body text-lg font-semibold text-[--primary-main]">
                +{filtered.length - VISIBLE_COUNT}
              </span>
              <span className="font-body text-md font-regular text-[--primary-main]">
                {t("see_more")}
              </span>
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-xl flex-col rounded-2 bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-heading text-h5 font-bold text-[--text-primary]">
                {title}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[--grey-300] transition-colors hover:bg-[--grey-50] hover:text-[--text-primary]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto">
              {filtered.map(({ slug, name }, index) => (
                <div key={slug}>
                  <div className="flex items-center gap-3 px-1 py-3">
                    <Check className="h-5 w-5 shrink-0 text-[--primary-main]" />
                    <span className="font-body text-base font-regular text-[--text-primary]">
                      {name}
                    </span>
                  </div>
                  {index < filtered.length - 1 && (
                    <div className="h-px w-full bg-[--grey-50]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
