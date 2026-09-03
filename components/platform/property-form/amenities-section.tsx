import { FormSection } from "@/components/platform/property-form/form-section";
import type { PropertyAmenity } from "@/lib/property-amenities";

interface AmenitiesSectionProps {
  groupedAmenities: Record<string, PropertyAmenity[]>;
  selectedAmenities: string[];
  onToggle: (slug: string) => void;
}

export function AmenitiesSection({
  groupedAmenities,
  selectedAmenities,
  onToggle,
}: AmenitiesSectionProps) {
  return (
    <FormSection title="Amenities">
      {Object.entries(groupedAmenities).map(([cat, items]) => (
        <div key={cat} className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{cat}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onToggle(a.slug)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${selectedAmenities.includes(a.slug)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input text-muted-foreground hover:border-primary/50"
                  }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </FormSection>
  );
}
