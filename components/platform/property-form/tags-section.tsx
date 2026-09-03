import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection } from "@/components/platform/property-form/form-section";

interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
}

export function TagsSection({
  tags,
  tagInput,
  onTagInputChange,
  onAdd,
  onRemove,
}: TagsSectionProps) {
  const tagInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection title="Tags">
      <div className="flex gap-2">
        <Input
          ref={tagInputRef}
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="Type a tag and press Enter"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onAdd();
            tagInputRef.current?.focus();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </FormSection>
  );
}
