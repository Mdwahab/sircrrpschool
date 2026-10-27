"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/lib/db/types";
import { motion, AnimatePresence } from "framer-motion";

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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Trap Escape, Arrow keys for keyboard accessibility
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

  // Touch Swipe Handlers for Mobile Lightbox Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      onNavigate((currentIndex + 1) % images.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      onNavigate((currentIndex - 1 + images.length) % images.length);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox Preview"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/90 backdrop-blur-md p-4 sm:p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white text-[#2F4156] hover:bg-[#567C8D] hover:text-white border border-[#C8D9E6] transition-colors z-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#567C8D] cursor-pointer shadow-sm"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white text-[#2F4156] hover:bg-[#567C8D] hover:text-white border border-[#C8D9E6] transition-colors z-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#567C8D] cursor-pointer shadow-md"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white text-[#2F4156] hover:bg-[#567C8D] hover:text-white border border-[#C8D9E6] transition-colors z-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#567C8D] cursor-pointer shadow-md"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
          key={currentImage.id || currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-4xl w-full flex flex-col items-center select-none"
        >
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[75vh] rounded-2xl overflow-hidden bg-black/40 border border-[#C8D9E6]/40 shadow-2xl">
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="object-contain"
              unoptimized={currentImage.image_url.startsWith("http") || currentImage.image_url.startsWith("data:")}
            />
          </div>

          {/* Caption & Metadata */}
          <div className="mt-4 text-center max-w-2xl px-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/95 border border-[#C8D9E6] text-[#2F4156] text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
              {currentImage.category} | {currentIndex + 1} of {images.length}
            </span>
            <h3 className="text-lg font-bold text-white font-serif">
              {currentImage.title}
            </h3>
            {currentImage.caption && (
              <p className="text-xs sm:text-sm text-[#C8D9E6] mt-1 font-medium leading-relaxed">
                {currentImage.caption}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
