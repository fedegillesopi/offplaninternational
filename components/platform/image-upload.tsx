"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/storage"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (value: string) => void
  userId: string
  folder: string
}

export function ImageUpload({ label, value, onChange, userId, folder }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file, userId, folder)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border">
          <Image src={value} alt={label} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
          >
            <Trash2 />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-40 w-full flex-col gap-2 border-dashed"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload />
              Upload image
            </>
          )}
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
