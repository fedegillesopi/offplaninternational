"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Milestone {
  id?: string;
  milestone_name: string;
  percentage: number;
  amount: number | null;
  due_date: string | null;
  description: string | null;
  sort_order: number;
}

interface MilestonesEditorProps {
  value: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  propertyPrice: number;
  currency: string;
}

function newMilestone(order: number): Milestone {
  return {
    milestone_name: "",
    percentage: 0,
    amount: null,
    due_date: null,
    description: null,
    sort_order: order,
  };
}

export function MilestonesEditor({
  value,
  onChange,
  propertyPrice,
  currency,
}: MilestonesEditorProps) {
  const [error, setError] = useState<string | null>(null);

  const totalPercentage = value.reduce((sum, m) => sum + m.percentage, 0);

  const add = () => {
    setError(null);
    onChange([...value, newMilestone(value.length)]);
  };

  const remove = (index: number) => {
    setError(null);
    onChange(value.filter((_, i) => i !== index));
  };

  const update = (index: number, field: keyof Milestone, val: string | number | null) => {
    setError(null);
    const next = value.map((m, i) => {
      if (i !== index) return m;
      const updated = { ...m, [field]: val };
      if (field === "percentage" && typeof val === "number" && propertyPrice > 0) {
        updated.amount = Math.round(propertyPrice * val) / 100;
      }
      return updated;
    });
    onChange(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    next.forEach((m, i) => (m.sort_order = i));
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    next.forEach((m, i) => (m.sort_order = i));
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Total: <span className={totalPercentage > 100 ? "text-destructive font-medium" : "font-medium"}>{totalPercentage}%</span>
          </span>
          {totalPercentage > 100 && (
            <span className="text-destructive text-xs">
              Cannot exceed 100%
            </span>
          )}
        </div>
      )}

      {value.map((milestone, i) => (
        <div
          key={i}
          className="rounded-lg border p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Milestone {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === 0}
                onClick={() => moveUp(i)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === value.length - 1}
                onClick={() => moveDown(i)}
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => remove(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input
                value={milestone.milestone_name}
                onChange={(e) => update(i, "milestone_name", e.target.value)}
                placeholder="e.g. On Booking"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Percentage (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={milestone.percentage || ""}
                onChange={(e) => update(i, "percentage", parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount ({currency})</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={milestone.amount ?? ""}
                onChange={(e) => update(i, "amount", parseFloat(e.target.value) || null)}
                placeholder="Auto-calculated"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Due Date</Label>
              <Input
                type="date"
                value={milestone.due_date ?? ""}
                onChange={(e) => update(i, "due_date", e.target.value || null)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              value={milestone.description ?? ""}
              onChange={(e) => update(i, "description", e.target.value || null)}
              placeholder="Optional description"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={add}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Milestone
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
