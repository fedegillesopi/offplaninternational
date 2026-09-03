import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { FormSection } from "@/components/platform/property-form/form-section";
import type { UserRole } from "@/lib/types";

interface DevelopmentDetailsSectionProps {
  userRole: UserRole;
  developments: { id: string; name: string }[];
  developmentId: string;
  development: string;
  developmentArea: string;
  developerName: string;
  onDevelopmentIdChange: (value: string) => void;
  onDevelopmentChange: (value: string) => void;
  onDevelopmentAreaChange: (value: string) => void;
  onDeveloperNameChange: (value: string) => void;
}

export function DevelopmentDetailsSection({
  userRole,
  developments,
  developmentId,
  development,
  developmentArea,
  developerName,
  onDevelopmentIdChange,
  onDevelopmentChange,
  onDevelopmentAreaChange,
  onDeveloperNameChange,
}: DevelopmentDetailsSectionProps) {
  const isDeveloper = userRole === "developer";

  return (
    <FormSection title="Development Details">
      {(isDeveloper || developments.length > 0) && (
        <div className="space-y-2">
          <Label>Development (link)</Label>
          <NativeSelect
            value={developmentId}
            onChange={(e) => onDevelopmentIdChange(e.target.value)}
          >
            <option value="">None</option>
            {developments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </NativeSelect>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Development</Label>
          <Input
            value={development}
            onChange={(e) => onDevelopmentChange(e.target.value)}
            placeholder="e.g. One Zabeel"
          />
        </div>
        <div className="space-y-2">
          <Label>Development Area (sqft)</Label>
          <Input
            type="number"
            min={0}
            value={developmentArea}
            onChange={(e) => onDevelopmentAreaChange(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Developer</Label>
        <Input
          value={developerName}
          onChange={isDeveloper ? undefined : (e) => onDeveloperNameChange(e.target.value)}
          readOnly={isDeveloper}
          className={isDeveloper ? "bg-muted" : undefined}
          placeholder={
            isDeveloper
              ? "Automatically set to your developer profile"
              : "Developer name"
          }
        />
      </div>
    </FormSection>
  );
}
