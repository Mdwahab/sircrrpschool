"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FlaskConical,
  Monitor,
  BookOpen,
  Trophy,
  Bus,
  CheckCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollReveal,
  ScrollStaggerContainer,
  ScrollStaggerItem,
} from "@/components/ui/ScrollAnimation";

const STAGES = [
  {
    id: "foundational",
    title: "Foundational Stage",
    grades: "Pre-Primary (LKG & UKG)",
    badge: "Early Childhood Care & Education",
    desc: "Play-based and activity-integrated learning cultivating early literacy, numeracy, aesthetic appreciation, and sensory exploration in a nurturing setting.",
    features: [
      "Activity-integrated phonics and language immersion",
      "Experiential motor skill and cognitive development",
      "Gentle socialization and emotional foundation",
      "Air-conditioned smart audiovisual activity classrooms",
    ],
    curriculumHighlights: ["Letter & Sound Recognition", "Number Sense & Logic", "Art & Sensory Play", "Rhythmic Rhymes & Motor Skills"],
  },
  {
    id: "preparatory",
    title: "Preparatory Stage",
    grades: "Classes I to V",
    badge: "Primary Discovery Foundation",
    desc: "Structured foundational literacy, numeracy, environmental awareness, and expressive arts building fundamental discovery and inquiry skills.",
    features: [
      "Integrated general science and experiential math concepts",
      "Bilingual comprehension: English, Telugu, and Hindi",
      "Introductory computational thinking and computer basics",
      "Values-grounded storytelling, ethics, and physical education",
    ],
    curriculumHighlights: ["Mathematics & Mental Arithmetic", "Environmental Studies (EVS)", "Language Arts & Reading", "Digital Foundations"],
  },
  {
    id: "middle",
    title: "Middle Stage",
    grades: "Classes VI to VIII",
    badge: "Experiential Inquiry Stage",
    desc: "Subject-focused inquiry across sciences, mathematics, humanities, and technology, fostering analytical reasoning, laboratory experimentation, and independent inquiry.",
    features: [
      "Hands-on scientific inquiry in laboratory environments",
      "Applied algebraic concepts, geometry, and real-world statistics",
      "Social science field studies and constitutional values",
      "Coding fundamentals and digital informatics training",
    ],
    curriculumHighlights: ["Physics, Chemistry & Biology", "Geometry & Algebra", "Social Science & Civics", "Computer Programming Basics"],
  },
  {
    id: "secondary",
    title: "Secondary & Senior Secondary",
    grades: "Classes IX to XII",
    badge: "CBSE Board & Competitive Focus",
    desc: "Comprehensive CBSE Board examination curriculum, competitive examination orientation, and specialized scientific and commercial streams.",
    features: [
      "Science Stream: Physics, Chemistry, Mathematics & Biology",
      "Commerce Stream: Accountancy, Business Studies & Economics",
      "CBSE board examination preparation & competitive orientation",
      "Dedicated CBSE laboratory practical work and viva training",
    ],
    curriculumHighlights: ["Science Stream (MPC & BiPC)", "Commerce & Economics (MEC)", "Competitive Test Guidance", "CBSE Practical Viva Voce"],
  },
];

const FACILITIES = [
  {
    icon: FlaskConical,
    title: "Science Laboratories",
    subtitle: "Physics, Chemistry & Biology Workbenches",
    image: "/images/school/laboratories/chemistry-titration-practical-lab.jpg",
    desc: "Dedicated practical workbenches, laboratory glassware, and demonstration apparatus supporting the prescribed CBSE practical curriculum.",
    badge: "Practical Laboratories",
    highlight: "Equipped for CBSE practical examinations & live experimental demonstrations.",
  },
  {
    icon: Monitor,
    title: "Computer Laboratory",
    subtitle: "Digital Literacy & Informatics",
    image: "/images/school/laboratories/computer-technology-lab.jpg",
    desc: "Workstations dedicated to foundational digital skills, computer applications, and informatics practices curriculum.",
    badge: "Computer Education",
    highlight: "Individual workstations with modern software.",
  },
  {
    icon: BookOpen,
    title: "School Library",
    subtitle: "Central Reading Hall & Reference",
    image: "/images/school/library/school-library-reading-hall.jpg",
    desc: "Curated collection of encyclopedias, reference textbooks, period literature, and educational journals fostering reading habits.",
    badge: "Central Library",
    highlight: "Dedicated quiet reading environment with extensive reference volumes.",
  },
  {
    icon: Trophy,
    title: "Sports & Athletics Grounds",
    subtitle: "Playgrounds & Physical Training",
    image: "/images/school/sports/school-sports-ground-and-track.jpg",
    desc: "Spacious campus grounds supporting athletics, cricket, volleyball, and physical fitness drills.",
    badge: "Physical Education",
    highlight: "Dedicated outdoor grounds for team sports and athletic events.",
  },
  {
    icon: Bus,
    title: "School Transport Fleet",
    subtitle: "Transit Across Eluru & Environs",
    image: "/images/school/facilities/school-transport-bus-fleet.jpg",
    desc: "Dedicated bus fleet providing regulated, safe transit for day scholars across Eluru town, Vatluru, and neighboring suburban points.",
    badge: "Transport Services",
    highlight: "Supervised routes with safety compliance.",
  },
];

export function AcademicsSection() {
  const [activeStageId, setActiveStageId] = useState(STAGES[0].id);
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section id="academics" className="py-20 sm:py-28 bg-white relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="CBSE CURRICULUM &amp; INFRASTRUCTURE"
          title="A Structured Journey from Pre-Primary to Class XII"
          highlight="Pre-Primary to Class XII"
          subtitle="Aligning with the National Education Policy (NEP 2020) across 4 developmental stages."
        />

        {/* Stage Selector Tabs: Scroll Reveal */}
        <ScrollReveal className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-2xs ${
                  isActive
                    ? "bg-[#2F4156] text-white shadow-md"
                    : "bg-[#F5EEEB] text-[#2F4156] hover:text-[#567C8D] border border-[#C8D9E6]"
                }`}
              >
                <span>{stage.title}</span>
                <span className={`ml-1.5 hidden sm:inline text-xs font-normal ${isActive ? "text-[#C8D9E6]" : "text-[#567C8D]"}`}>
                  ({stage.grades})
                </span>
              </button>
            );
          })}
        </ScrollReveal>

        {/* Active Stage Detail Card: Scroll Reveal + AnimatePresence */}
        <ScrollReveal className="mb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C8D9E6] shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EEEB] text-[#2F4156] border border-[#C8D9E6] text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5 text-[#567C8D]" />
                    <span>{activeStage.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4156]">
                    {activeStage.title}{" "}
                    <span className="text-sm font-semibold text-[#567C8D] block sm:inline sm:ml-2">
                      [{activeStage.grades}]
                    </span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#567C8D] leading-relaxed font-normal">
                    {activeStage.desc}
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeStage.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2F4156]">
                        <CheckCircle className="w-4 h-4 text-[#567C8D] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Highlights Column */}
                <div className="lg:col-span-5 bg-[#F5EEEB] p-6 sm:p-7 rounded-2xl border border-[#C8D9E6] shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2F4156] block mb-3 font-mono">
                    Curriculum Highlights
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStage.curriculumHighlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-white text-[#2F4156] text-xs font-bold border border-[#C8D9E6] flex items-center shadow-2xs"
                      >
                        <span>{hl}</span>
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#C8D9E6]">
                    <a
                      href="#admissions"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4156] hover:text-[#567C8D] transition-colors group"
                    >
                      <span>Inquire for {activeStage.grades}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </ScrollReveal>

        {/* Campus Facilities Showcase */}
        <div id="facilities" className="scroll-mt-24 pt-4">
          <SectionHeading
            badge="CAMPUS FACILITIES &amp; LABORATORIES"
            title="Campus Facilities &amp; Practical Learning"
            highlight="Practical Learning"
            subtitle="Equipping students with modern scientific workbenches, computing labs, reading halls, and sports grounds."
          />

          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACILITIES.map((fac, idx) => {
              const Icon = fac.icon;
              const isSpotlight = idx === 0;
              return (
                <ScrollStaggerItem key={idx} className={isSpotlight ? "lg:col-span-2" : "lg:col-span-1"}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 flex flex-col group shadow-xs hover:shadow-xl hover:-translate-y-1.5 h-full">
                    <div className={`relative bg-[#F5EEEB] overflow-hidden ${isSpotlight ? "aspect-[16/10] lg:aspect-[20/10]" : "aspect-[16/10]"}`}>
                      <Image
                        src={fac.image}
                        alt={fac.title}
                        fill
                        sizes={isSpotlight ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-[#2F4156] border border-[#C8D9E6] shadow-xs flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#567C8D]" />
                        <span>{fac.badge}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold font-serif text-[#2F4156] group-hover:text-[#567C8D] transition-colors">
                          {fac.title}
                        </h4>
                        <p className="text-xs text-[#567C8D] font-semibold mb-2">
                          {fac.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#567C8D] leading-relaxed font-normal">
                          {fac.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#C8D9E6]/60 flex items-center gap-2 text-xs font-semibold text-[#2F4156]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#567C8D] shrink-0" />
                        <span>{fac.highlight}</span>
                      </div>
                    </div>
                  </div>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStaggerContainer>
        </div>
      </div>
    </section>
  );
}
