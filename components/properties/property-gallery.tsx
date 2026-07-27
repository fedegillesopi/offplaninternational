"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2 group">
        <Image
          src={images[selectedIndex]}
          alt={`${title} - ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[--text-primary] opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[--text-primary] opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-1 border-2 transition-colors ${index === selectedIndex
                ? "border-[--primary-main]"
                : "border-transparent hover:border-[--grey-100]"
                }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
