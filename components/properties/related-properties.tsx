import { getTranslations } from "next-intl/server";
import { PropertyCardCompact } from "@/components/properties/property-card-compact";
import type { PropertyData } from "@/lib/types";

export async function RelatedProperties({
  properties,
}: {
  properties: PropertyData[];
}) {
  const t = await getTranslations("property_detail");
  if (properties.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
        {t("other_related_properties")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCardCompact key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
