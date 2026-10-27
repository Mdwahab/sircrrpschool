"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { GalleryImage } from "@/lib/db/types";
import { Maximize2, Camera } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollAnimation";

interface GallerySectionProps {
  initialImages: GalleryImage[];
}

const CATEGORIES = ["Campus", "Events", "Sports", "Laboratories", "Academics"] as const;

export function GallerySection({ initialImages }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Campus");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const filteredImages = initialImages.filter((img) => img.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#F5EEEB] relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CAMPUS LIFE &amp; INFRASTRUCTURE"
          title="Glimpses of Our Institution"
          highlight="Our Institution"
          subtitle="A visual tour of the academic wings, scientific laboratories, school library, and sporting arenas at Eluru."
        />

        {/* Category Filters: Scroll Reveal Entrance */}
        <ScrollReveal className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = initialImages.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-2xs ${
                  isActive
                    ? "bg-[#2F4156] text-white shadow-md"
                    : "bg-[#F5EEEB] text-[#2F4156] hover:text-[#567C8D] border border-[#C8D9E6]"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-[#C8D9E6]/30 text-white" : "bg-[#C8D9E6]/40 text-[#2F4156]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Gallery Grid: Smooth Animated Category Reveal */}
        <AnimatePresence mode="wait">
          {filteredImages.length === 0 ? (
            <motion.div
              key="empty-gallery"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-[#F5EEEB] rounded-3xl p-8 border border-[#C8D9E6] shadow-xs max-w-md mx-auto space-y-3"
            >
              <Camera className="w-8 h-8 text-[#567C8D] mx-auto" />
              <h4 className="font-serif font-bold text-[#2F4156] text-base">No Photographs in this Category</h4>
              <p className="text-[#567C8D] text-xs font-normal">
                Additional campus images for {selectedCategory} will be curated and published soon.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col"
                >
                  <div
                    onClick={() => handleOpenLightbox(idx)}
                    className="bg-white rounded-3xl overflow-hidden border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 group cursor-pointer flex flex-col shadow-xs hover:shadow-xl hover:-translate-y-1.5 h-full"
                  >
                    <div className="relative aspect-[16/10] bg-[#F5EEEB] overflow-hidden">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#2F4156]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white text-[#2F4156] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 group-hover:text-[#567C8D] transition-all duration-300">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-bold text-[#2F4156] border border-[#C8D9E6] shadow-xs">
                        <span>{image.category}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h4 className="font-serif font-bold text-[#2F4156] text-base group-hover:text-[#567C8D] transition-colors line-clamp-1">
                        {image.title}
                      </h4>
                      {image.caption && (
                        <p className="text-xs text-[#567C8D] mt-1.5 line-clamp-2 leading-relaxed font-normal">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox Modal */}
        <GalleryLightbox
          isOpen={lightboxOpen}
          images={filteredImages}
          currentIndex={activeImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
        />
      </div>
    </section>
  );
}
