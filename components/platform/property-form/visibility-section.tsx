"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FormSection } from "@/components/platform/property-form/form-section"

interface VisibilitySectionProps {
  isActive: boolean
  saving: boolean
  hasChanges: boolean
  isNew: boolean
  error: string | null
  onActiveChange: (checked: boolean) => void
  onSave: () => void
  onDelete: () => void
}

export function VisibilitySection({
  isActive,
  saving,
  hasChanges,
  isNew,
  error,
  onActiveChange,
  onSave,
  onDelete,
}: VisibilitySectionProps) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <FormSection title="Visibility">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_active"
            checked={isActive}
            onCheckedChange={(c) => onActiveChange(c === true)}
          />
          <Label htmlFor="is_active" className="font-normal">
            Active (visible on public listings)
          </Label>
        </div>
      </FormSection>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="w-full space-y-3">
        <Button
          className="w-full"
          onClick={onSave}
          disabled={saving || !hasChanges}
        >
          {saving ? "Saving..." : isNew ? "Create Property" : "Save Changes"}
        </Button>

        {isNew ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/app/properties")}
            disabled={saving}
          >
            Cancel
          </Button>
        ) : (
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={saving}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this property. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  asChild
                  className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setConfirmOpen(false)
                      onDelete()
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </>
  )
}
