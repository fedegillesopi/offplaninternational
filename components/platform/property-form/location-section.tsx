import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/platform/property-form/form-section";
import type { CommunityOption } from "@/lib/communities";

const CUSTOM_VALUE = "__custom__";

interface LocationSectionProps {
  countryLabel: string;
  city: string;
  cityOptions: string[];
  community: string;
  communityIsCustom: boolean;
  communityCustom: string;
  filteredCommunities: CommunityOption[];
  address: string;
  onCityChange: (city: string) => void;
  onCommunityChange: (value: string) => void;
  onCommunityCustomChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

export function LocationSection({
  countryLabel,
  city,
  cityOptions,
  community,
  communityIsCustom,
  communityCustom,
  filteredCommunities,
  address,
  onCityChange,
  onCommunityChange,
  onCommunityCustomChange,
  onAddressChange,
}: LocationSectionProps) {
  const communitySelectValue = communityIsCustom ? CUSTOM_VALUE : community;

  return (
    <FormSection title="Location">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Country</Label>
          <Input value={countryLabel} readOnly className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
          >
            <option value="">Select city</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Community</Label>
          <select
            value={communitySelectValue}
            onChange={(e) => onCommunityChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
          >
            <option value="">None</option>
            {filteredCommunities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value={CUSTOM_VALUE}>Other (type below)</option>
          </select>
          {communityIsCustom && (
            <Input
              value={communityCustom}
              onChange={(e) => onCommunityCustomChange(e.target.value)}
              placeholder="Type community name"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Full address (optional)"
          />
        </div>
      </div>
    </FormSection>
  );
}
