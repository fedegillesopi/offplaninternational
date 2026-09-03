import { useRef } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/platform/image-upload";
import { FormSection } from "@/components/platform/property-form/form-section";

interface ImagesSectionProps {
  coverImage: string;
  images: string[];
  uploadingGallery: boolean;
  userId: string;
  onCoverChange: (url: string) => void;
  onGalleryFiles: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
}

export function ImagesSection({
  coverImage,
  images,
  uploadingGallery,
  userId,
  onCoverChange,
  onGalleryFiles,
  onRemoveImage,
}: ImagesSectionProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection title="Images">
      <ImageUpload
        label="Cover Image"
        value={coverImage}
        onChange={onCoverChange}
        userId={userId}
        folder="covers"
        bucket="property-images"
      />

      <div className="space-y-2">
        <Label>Gallery Images ({images.length}/10)</Label>
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
              <Image
                src={url}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 33vw, 200px"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => onRemoveImage(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        {images.length < 10 && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadingGallery}
          >
            {uploadingGallery ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>
        )}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onGalleryFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </FormSection>
  );
}
