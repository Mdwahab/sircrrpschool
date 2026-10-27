"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Award,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SCHOOL_INFO } from "@/config/schoolInfo";
import { AmbientFloatingElements } from "@/components/ui/AmbientFloatingElements";
import {
  scrollStaggerContainerVariants,
  scrollStaggerItemVariants,
  scrollImageVariants,
  CinematicParallaxContainer,
} from "@/components/ui/ScrollAnimation";

interface HeroSectionProps {
  settings?: Record<string, string>;
}

export function HeroSection({ settings }: HeroSectionProps = {}) {
  const currentSession =
    settings?.currentAcademicSession || SCHOOL_INFO.admissions.currentAcademicSession;
  const campusAddress = settings?.campusAddress || SCHOOL_INFO.address.campus;
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-[#F5EEEB]/70 via-white to-[#F5EEEB]/50 pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Dynamic Ambient Background Elements in Sky Blue & Teal tones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C8D9E6]/35 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#567C8D]/15 blur-3xl" />
      </div>

      <AmbientFloatingElements />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Sequential Typography & Badges */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: false, amount: 0.15, margin: "-20px 0px" }}
            variants={scrollStaggerContainerVariants}
            custom={{ stagger: 0.1, delayChildren: 0.05 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Main School Title with Cinematic Navy & Teal Highlights */}
            <motion.h1
              variants={scrollStaggerItemVariants}
              className="text-4xl sm:text-5xl xl:text-6xl font-serif font-extrabold text-[#2F4156] tracking-tight leading-[1.12]"
            >
              Sir C. R. Reddy{" "}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#2F4156] via-[#3E5C6B] to-[#567C8D] bg-clip-text text-transparent font-extrabold">
                Public School
              </span>
            </motion.h1>

            {/* 3. Approved Motto in Stylized Accent Callout */}
            <motion.div
              variants={scrollStaggerItemVariants}
              className="pt-0.5 flex items-center justify-center lg:justify-start"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-[#F5EEEB] border border-[#C8D9E6] shadow-xs">
                <p className="text-base sm:text-lg font-serif italic font-bold text-[#2F4156] tracking-wide">
                  &ldquo;{SCHOOL_INFO.legacy.motto}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* 4. Supporting Description */}
            <motion.p
              variants={scrollStaggerItemVariants}
              className="text-sm sm:text-base text-[#567C8D] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              Established in 1984 under the historic Sir C. R. Reddy Educational Institutions in Eluru, Andhra Pradesh. Dedicated to values-grounded CBSE education, laboratory experimentation, and disciplined academic instruction.
            </motion.p>

            {/* 5. Primary Action Buttons */}
            <motion.div
              variants={scrollStaggerItemVariants}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#admissions"
                onClick={handleScrollToSection("admissions")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white font-bold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 group"
              >
                <span suppressHydrationWarning>Enroll for {currentSession}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#about"
                onClick={handleScrollToSection("about")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-[#F5EEEB] text-[#2F4156] border-2 border-[#C8D9E6] hover:border-[#567C8D] font-bold text-sm shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-[#567C8D]" />
                <span>Explore School Heritage</span>
              </a>
            </motion.div>

            {/* 6. Quick Institutional Badges */}
            <motion.div
              variants={scrollStaggerItemVariants}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-[#2F4156] font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#567C8D] shrink-0" />
                <span>Estd. 1984 Legacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#567C8D] shrink-0" />
                <span>CBSE Senior Secondary (Classes LKG–XII)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#567C8D] shrink-0" />
                <span suppressHydrationWarning>{campusAddress}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Campus Photograph with Parallax Motion & Floating Prestige Badges */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: false, amount: 0.15, margin: "-20px 0px" }}
            variants={scrollImageVariants}
            custom={{ delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <CinematicParallaxContainer parallaxOffset={20} className="w-full max-w-lg rounded-3xl">
              {/* Main Campus Image Showcase in Natural Photo Colors */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-[#C8D9E6] bg-white group transition-all duration-300 hover:shadow-2xl hover:border-[#567C8D]">
                <Image
                  src="/images/school/campus/campus-aerial-panorama.jpg"
                  alt="Sir C. R. Reddy Public School Main Campus Panoramic View"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 520px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Floating Top-Left Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#C8D9E6] shadow-md text-xs font-bold text-[#2F4156]">
                    <Award className="w-4 h-4 text-[#567C8D]" />
                    <span>Estd. 1984 (40+ Years)</span>
                  </div>
                </div>

                {/* Floating Top-Right Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2F4156]/95 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8D9E6]" />
                    <span>CBSE 130072</span>
                  </div>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#2F4156]/90 via-[#2F4156]/60 to-transparent text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#567C8D] text-white text-[10px] font-bold uppercase tracking-wider mb-1 shadow-xs">
                    Eluru Campus
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">
                    Main academic wings, sports arena &amp; laboratories
                  </p>
                </div>
              </div>
            </CinematicParallaxContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
