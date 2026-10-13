"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { GalleryImage } from "@/lib/db/types";
import { Maximize2, ShieldAlert } from "lucide-react";

interface GallerySectionProps {
  initialImages: GalleryImage[];
}

const CATEGORIES = ["All", "Campus", "Laboratories", "Academics", "Sports"] as const;

export function GallerySection({ initialImages }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const filteredImages =
    selectedCategory === "All"
      ? initialImages
      : initialImages.filter((img) => img.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-24 bg-[#07172F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CAMPUS LIFE &amp; INFRASTRUCTURE"
          title="Glimpses of Our Institution"
          subtitle="A visual tour of the academic wings, scientific laboratories, library, and sporting arenas at Eluru."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37] text-[#07172F] shadow-lg shadow-[#D4AF37]/25 font-bold"
                    : "bg-[#0E2548] text-slate-300 hover:text-white hover:bg-[#143566] border border-slate-700/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl p-8 border border-slate-800">
            <p className="text-slate-400 text-sm">
              No gallery images found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, idx) => (
              <div
                key={image.id}
                onClick={() => handleOpenLightbox(idx)}
                className="glass-card rounded-xl overflow-hidden border border-[#D4AF37]/20 group cursor-pointer hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-[#0A1E3C] overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#07172F]/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
                    {image.category}
                  </div>

                  {/* Expand Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#07172F]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-[#D4AF37] text-[#07172F] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white font-serif leading-snug group-hover:text-[#F3CA52] transition-colors">
                      {image.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {image.caption}
                    </p>
                  </div>

                  {image.is_development_placeholder && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-amber-300/90 font-medium">
                      <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                      <span>Development graphic • Official photograph pending</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Privacy Note */}
        <div className="mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <em>
            Note on Student Privacy: Sir C. R. Reddy Public School strictly adheres to institutional child privacy guidelines. All published photographs are vetted by school management prior to public digital display.
          </em>
        </div>

        {/* Lightbox Modal */}
        <GalleryLightbox
          images={filteredImages}
          currentIndex={activeImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
        />
      </div>
    </section>
  );
}
