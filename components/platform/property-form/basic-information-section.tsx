import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { RichTextEditor } from "@/components/platform/rich-text-editor";
import { FormSection } from "@/components/platform/property-form/form-section";
import { isHtmlText, toEditorHtml } from "@/lib/utils";
import type { PropertySubcategory } from "@/lib/property-subcategories";

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "reserved", label: "Reserved" },
  { value: "off_market", label: "Off Market" },
];

interface BasicInformationSectionProps {
  title: string;
  slug: string;
  description: string;
  subcategory: string;
  status: string;
  userId: string;
  groupedSubcategories: Record<string, PropertySubcategory[]>;
  copied: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCopy: () => void;
}

export function BasicInformationSection({
  title,
  slug,
  description,
  subcategory,
  status,
  userId,
  groupedSubcategories,
  copied,
  onTitleChange,
  onDescriptionChange,
  onSubcategoryChange,
  onStatusChange,
  onCopy,
}: BasicInformationSectionProps) {
  return (
    <FormSection title="Basic Information">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Luxury Penthouse in Downtown Dubai"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <div className="flex gap-2">
            <Input value={slug} readOnly className="bg-muted" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onCopy}
              title="Copy public URL"
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <RichTextEditor
          defaultValue={isHtmlText(description) ? description : toEditorHtml(description)}
          onChange={onDescriptionChange}
          userId={userId}
          placeholder="Describe the property..."
          bucket="property-images"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <NativeSelect
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
          >
            <option value="">None</option>
            {Object.entries(groupedSubcategories).map(([cat, subs]) => (
              <optgroup key={cat} label={cat}>
                {subs.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <NativeSelect
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
    </FormSection>
  );
}
