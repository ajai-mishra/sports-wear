"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product.types";

const ZOOM_SCALE_PERCENT = 250;

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedImage = images[selectedIndex] ?? images[0];

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  function showPrevious() {
    setSelectedIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function showNext() {
    setSelectedIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  if (!selectedImage) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div className="relative flex-1">
        <div
          ref={containerRef}
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          {failedImageIds.has(selectedImage.id) ? (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="size-8" aria-hidden="true" />
              <span className="text-xs">Image unavailable</span>
            </div>
          ) : (
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || productName}
              fill
              priority
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              onError={() =>
                setFailedImageIds((current) => new Set(current).add(selectedImage.id))
              }
            />
          )}
          {/* The zoom lens needs the raw upstream url for a CSS background-image,
              which next/image's rewritten/optimized src can't be used for. */}
          {isZooming && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden bg-no-repeat sm:block"
              style={{
                backgroundImage: `url(${selectedImage.url})`,
                backgroundSize: `${ZOOM_SCALE_PERCENT}%`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
          <div className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white sm:hidden">
            <ZoomIn className="size-3" /> Tap to zoom
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100 sm:opacity-80"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-80 shadow-sm"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-y-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={index === selectedIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 sm:size-20",
                index === selectedIndex ? "border-primary" : "border-transparent hover:border-border",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] bg-background p-2 sm:max-w-2xl">
          <DialogTitle className="sr-only">{productName} — image {selectedIndex + 1}</DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || productName}
              fill
              sizes="(min-width: 640px) 640px, 100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button type="button" variant="outline" size="icon-sm" aria-label="Previous image" onClick={showPrevious}>
                <ChevronLeft />
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedIndex + 1} / {images.length}
              </span>
              <Button type="button" variant="outline" size="icon-sm" aria-label="Next image" onClick={showNext}>
                <ChevronRight />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
