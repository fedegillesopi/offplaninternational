import { getTranslations } from "next-intl/server";

export async function PropertyTags({ tags }: { tags: string[] }) {
  const t = await getTranslations("property_detail");
  if (tags.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 font-heading text-h4 font-bold text-[--text-primary]">
        {t("tags")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-1 bg-[--primary-light] px-2 py-1 font-body text-sm font-medium text-[--primary-main]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
