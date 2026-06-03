import { getTranslations } from "next-intl/server";
import { PropertyCard } from "@/components/property-card";
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
      <div className="flex flex-col gap-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
