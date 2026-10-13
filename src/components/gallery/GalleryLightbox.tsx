"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { GalleryImage } from "@/lib/db/types";

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-[#D4AF37] hover:text-[#07172F] transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-[#D4AF37] hover:text-[#07172F] transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-4xl w-full flex flex-col items-center">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[75vh] rounded-xl overflow-hidden bg-slate-900 border border-[#D4AF37]/30 shadow-2xl">
          <Image
            src={currentImage.image_url}
            alt={currentImage.alt_text}
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Caption & Metadata */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <span className="inline-block px-2.5 py-0.5 rounded bg-[#0A1E3C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            {currentImage.category} • {currentIndex + 1} of {images.length}
          </span>
          <h3 className="text-lg font-bold text-white font-serif">
            {currentImage.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {currentImage.caption}
          </p>

          {currentImage.is_development_placeholder && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300 text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span>Development graphic — to be updated with authorized campus photograph upon management submission.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
