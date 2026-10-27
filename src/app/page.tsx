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
import { CinematicSectionDivider } from "@/components/ui/ScrollAnimation";
import {
  getPublishedGalleryImages,
  getPublishedAchievements,
  getPublishedNotices,
  getSchoolSettings,
} from "@/lib/db/service";

// Ensure real-time live data sync: Never serve stale build-time cached HTML
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [galleryImages, achievements, notices, settings] = await Promise.all([
    getPublishedGalleryImages(),
    getPublishedAchievements(),
    getPublishedNotices(),
    getSchoolSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />

      <main className="flex-grow">
        <HeroSection settings={settings} />
        <AboutSection />
        <CinematicSectionDivider fromColor="#F5EEEB" toColor="#FFFFFF" />
        <AcademicsSection />
        <CinematicSectionDivider fromColor="#FFFFFF" toColor="#F5EEEB" />
        <PrincipalSection settings={settings} />
        <CinematicSectionDivider fromColor="#F5EEEB" toColor="#FFFFFF" />
        <ResultsSection achievements={achievements} />
        <CinematicSectionDivider fromColor="#FFFFFF" toColor="#F5EEEB" />
        <GallerySection initialImages={galleryImages} />
        <CinematicSectionDivider fromColor="#F5EEEB" toColor="#FFFFFF" />
        <NoticesSection notices={notices} />
        <CinematicSectionDivider fromColor="#FFFFFF" toColor="#F5EEEB" />
        <AdmissionsSection settings={settings} />
        <CinematicSectionDivider fromColor="#F5EEEB" toColor="#FFFFFF" />
        <ContactSection settings={settings} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
