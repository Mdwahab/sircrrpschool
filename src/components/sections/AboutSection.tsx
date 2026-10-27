"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ShieldCheck,
  Target,
  Compass,
  Award,
  Calendar,
} from "lucide-react";
import {
  ScrollStaggerContainer,
  ScrollStaggerItem,
  CinematicMaskReveal,
} from "@/components/ui/ScrollAnimation";

const HISTORICAL_MILESTONES = [
  {
    year: "1945",
    title: "Governing Committee Founded",
    desc: "Sir C. R. Reddy Educational Institutions founded in Eluru under visionary educational leadership.",
  },
  {
    year: "1984",
    title: "Public School Established",
    desc: "Inaugurated to impart disciplined, English-medium CBSE schooling to children of West Godavari.",
  },
  {
    year: "CBSE 130072",
    title: "Senior Secondary Affiliation",
    desc: "Affiliated with CBSE New Delhi, preparing students up to Class XII in Science & Commerce streams.",
  },
  {
    year: "40+ Years",
    title: "Institutional Legacy",
    desc: "Four decades of dedicated service, state achievements, and thousands of accomplished alumni.",
  },
];

const CORE_PILLARS = [
  {
    icon: Target,
    title: "Academic Rigor",
    desc: "Inquiry-based CBSE curriculum blending conceptual depth with continuous diagnostic evaluations.",
    badge: "Excellence",
  },
  {
    icon: Compass,
    title: "Moral Grounding",
    desc: "Value-integrated education cultivating discipline, civic responsibility, and ethical courage.",
    badge: "Character",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Learning",
    desc: "Instruction spanning physical sports, expressive arts, and hands-on laboratory discovery.",
    badge: "Growth",
  },
  {
    icon: Award,
    title: "Proven Distinction",
    desc: "Dedicated faculty mentorship guiding students toward higher university and competitive success.",
    badge: "Heritage",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F5EEEB] relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="OUR HERITAGE &amp; ETHOS"
          title="Rooted in History, Dedicated to Excellence"
          highlight="Excellence"
          subtitle="Four decades of academic distinction under the historic Sir C. R. Reddy Educational Institutions."
        />

        {/* 1. Milestones Grid: Staggered Bottom-to-Top Reveal */}
        <ScrollStaggerContainer className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HISTORICAL_MILESTONES.map((item, idx) => (
            <ScrollStaggerItem key={idx}>
              <div className="bg-white p-6 rounded-2xl border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 group">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#567C8D]" />
                  <span className="font-mono text-xs font-extrabold text-[#2F4156] uppercase tracking-wider bg-[#C8D9E6]/40 px-2.5 py-0.5 rounded-full border border-[#C8D9E6]">
                    {item.year}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#2F4156] group-hover:text-[#567C8D] transition-colors font-serif mb-1.5 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#567C8D] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>

        {/* 2. Founder Tribute & Institutional Ethos Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 p-6 sm:p-10 rounded-3xl border border-[#C8D9E6] bg-white shadow-sm">
          {/* Founder Portrait Column: Film-like Mask Expansion Reveal */}
          <CinematicMaskReveal className="lg:col-span-5 flex justify-center" delay={0.1}>
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-white p-4 shadow-md border-2 border-[#C8D9E6] group transition-all duration-300 hover:shadow-xl hover:border-[#567C8D] hover:-translate-y-1">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F5EEEB] border border-[#C8D9E6]/60">
                <Image
                  src="/images/founder-portrait.svg"
                  alt="Dr. Sir Cattamanchi Ramalinga Reddy Tribute Portrait"
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="pt-4 pb-1 text-center">
                <span className="text-xs text-[#567C8D] font-bold tracking-wider uppercase block">
                  Patron &amp; Namesake
                </span>
                <h4 className="text-base font-serif font-bold text-[#2F4156] mt-0.5">
                  Dr. Sir Cattamanchi Ramalinga Reddy
                </h4>
                <span className="text-xs text-[#567C8D] font-medium block mt-0.5">
                  (1880–1951), Renowned Scholar &amp; Founding VC, Andhra University
                </span>
              </div>
            </div>
          </CinematicMaskReveal>

          {/* Institutional Ethos Description Column: Sequential Stagger */}
          <ScrollStaggerContainer className="lg:col-span-7 space-y-5">
            <ScrollStaggerItem>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EEEB] text-[#2F4156] border border-[#C8D9E6] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <span>Founding Ideals</span>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4156] leading-snug">
                A Legacy of Values-Based{" "}
                <span className="bg-gradient-to-r from-[#2F4156] via-[#3E5C6B] to-[#567C8D] bg-clip-text text-transparent font-extrabold">
                  Education &amp; Service
                </span>
              </h3>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <p className="text-sm sm:text-base text-[#567C8D] leading-relaxed font-normal">
                Named after the illustrious educationist, philosopher, and statesman <strong className="text-[#2F4156] font-semibold">Dr. Sir C. R. Reddy</strong>, our school inherits a noble institutional ethos dating back to 1945. Under the stewardship of the Sir C. R. Reddy Educational Institutions, we provide children of West Godavari district with established educational instruction in Eluru.
              </p>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <p className="text-sm sm:text-base text-[#567C8D] leading-relaxed font-normal">
                Our educators nurture intellectual curiosity, scientific reasoning, artistic expression, and unshakeable ethical integrity. Every child is guided to achieve their highest academic potential in a supportive, co-educational atmosphere.
              </p>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <div className="border-l-4 border-[#567C8D] pl-5 py-3 bg-[#F5EEEB] rounded-r-2xl">
                <p className="font-serif italic text-sm sm:text-base text-[#2F4156] font-medium leading-relaxed">
                  &ldquo;True education illuminates the mind, strengthens character, and instills a lifelong dedication to the common welfare.&rdquo;
                </p>
              </div>
            </ScrollStaggerItem>
          </ScrollStaggerContainer>
        </div>

        {/* 3. Core Institutional Pillars: Staggered Bottom-to-Top Reveal */}
        <ScrollStaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CORE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <ScrollStaggerItem key={idx}>
                <div className="bg-white p-6 rounded-2xl border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 group">
                  <div className="w-12 h-12 rounded-xl bg-[#C8D9E6]/30 border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] group-hover:bg-[#567C8D] group-hover:text-white mb-4 shadow-2xs group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-[#2F4156] font-serif">
                      {pillar.title}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4156] bg-[#F5EEEB] px-2.5 py-0.5 rounded-full border border-[#C8D9E6]">
                      {pillar.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#567C8D] leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </ScrollStaggerItem>
            );
          })}
        </ScrollStaggerContainer>
      </div>
    </section>
  );
}
