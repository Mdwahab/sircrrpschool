import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { AcademicsSection } from "@/components/sections/AcademicsSection";
import { PrincipalSection } from "@/components/sections/PrincipalSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { NoticesSection } from "@/components/sections/NoticesSection";
import { AdmissionsSection } from "@/components/sections/AdmissionsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  getPublishedGalleryImages,
  getPublishedAchievements,
  getPublishedNotices,
} from "@/lib/db/service";



export default async function HomePage() {
  const [galleryImages, achievements, notices] = await Promise.all([
    getPublishedGalleryImages(),
    getPublishedAchievements(),
    getPublishedNotices(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <AcademicsSection />
        <PrincipalSection />
        <GallerySection initialImages={galleryImages} />
        <ResultsSection achievements={achievements} />
        <NoticesSection notices={notices} />
        <AdmissionsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
