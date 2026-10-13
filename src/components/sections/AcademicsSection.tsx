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
  Sparkles,
} from "lucide-react";

const STAGES = [
  {
    id: "foundational",
    title: "Foundational Stage",
    grades: "LKG & UKG",
    desc: "Early childhood learning focused on motor skills, interactive phonics, foundational numeracy, and joyful play-based exploration.",
    features: [
      "Activity-based thematic learning",
      "Language development & storytelling",
      "Motor skill & artistic expression",
      "Nurturing, secure environment",
    ],
  },
  {
    id: "preparatory",
    title: "Preparatory Stage",
    grades: "Classes I – V",
    desc: "Building solid conceptual competencies in languages, mathematics, environmental studies, and social awareness.",
    features: [
      "Structured literacy & mathematical reasoning",
      "Experiential science activities",
      "Visual arts, music & craft integration",
      "Values education & physical drills",
    ],
  },
  {
    id: "middle",
    title: "Middle Stage",
    grades: "Classes VI – VIII",
    desc: "Introduction of specialized subject disciplines, laboratory demonstrations, and logical reasoning under CBSE curriculum framework.",
    features: [
      "Discrete sciences: Physics, Chemistry & Biology",
      "Computer applications & digital literacy",
      "Social sciences: History, Civics & Geography",
      "Languages: English, Hindi, and Regional Language",
    ],
  },
  {
    id: "secondary",
    title: "Secondary Stage",
    grades: "Classes IX & X",
    desc: "Rigorous preparation for the CBSE All India Secondary School Examination (AISSE) with periodic assessments and mock examinations.",
    features: [
      "CBSE prescribed syllabus & question patterns",
      "Hands-on science laboratory practicals",
      "Continuous formative & summative assessments",
      "Academic counseling & remedial support",
    ],
  },
  {
    id: "senior-secondary",
    title: "Senior Secondary Stage",
    grades: "Classes XI & XII",
    desc: "Specialized academic streams designed to equip scholars for national competitive examinations (JEE, NEET, CUET, CA Foundation) and university admission.",
    features: [
      "Science Stream: Physics, Chemistry, Mathematics (MPC) or Biology (BiPC)",
      "Commerce Stream: Accountancy, Business Studies, Economics, Applied Math",
      "Advanced experimental practicals & viva",
      "Career counseling & entrance guidance",
    ],
  },
];

const FACILITIES = [
  {
    icon: FlaskConical,
    title: "Science Laboratories",
    subtitle: "Physics, Chemistry & Biology",
    image: "/images/science-lab.svg",
    desc: "Fully equipped experimental workbenches, calibrated optical instruments, chemical safety stations, and biological specimens enabling comprehensive CBSE practical curricula.",
    badge: "Verified Facility",
  },
  {
    icon: Monitor,
    title: "Computer & IT Lab",
    subtitle: "Digital Literacy & Informatics",
    image: "/images/computer-lab.svg",
    desc: "Networked systems with high-speed internet, programming compilers, and multimedia educational software fostering computational thinking from early grades.",
    badge: "Verified Facility",
  },
  {
    icon: BookOpen,
    title: "Central Library",
    subtitle: "Academic Reference & Reading Hall",
    image: "/images/library.svg",
    desc: "A wide catalog of CBSE textbooks, competitive exam reference materials, encyclopedias, national periodicals, and quiet reading desks for independent inquiry.",
    badge: "Verified Facility",
  },
  {
    icon: Trophy,
    title: "Sports & Athletics Grounds",
    subtitle: "Physical Education & Games",
    image: "/images/sports-ground.svg",
    desc: "Expansive outdoor playfields for cricket, volleyball, track events, and athletics nurturing physical endurance, teamwork, and competitive sportsmanship.",
    badge: "Verified Facility",
  },
  {
    icon: Bus,
    title: "Campus Transport Network",
    subtitle: "Safe School Commute",
    image: "/images/campus-main.svg",
    desc: "Designated school bus routes connecting key neighborhoods in Eluru and surrounding sectors with verified drivers and safety supervisors.",
    badge: "Subject to Route Availability",
  },
  {
    icon: Sparkles,
    title: "Smart Classrooms",
    subtitle: "Interactive Audio-Visual Learning",
    image: "/images/computer-lab.svg",
    desc: "Audiovisual-enabled instructional classrooms with digital boards and animated curriculum modules facilitating clear conceptual comprehension.",
    badge: "Verified Facility",
  },
];

export function AcademicsSection() {
  const [activeStage, setActiveStage] = useState(STAGES[0].id);
  const currentStage = STAGES.find((s) => s.id === activeStage) || STAGES[0];

  return (
    <section id="academics" className="py-24 bg-[#07172F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="ACADEMIC PROGRAMME"
          title="Structured CBSE Learning from LKG to Class XII"
          subtitle="Curriculum aligned with the National Curriculum Framework (NCF), fostering intellectual depth and real-world analytical capability."
        />

        {/* Academic Stages Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {STAGES.map((stage) => {
            const isActive = stage.id === activeStage;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37] text-[#07172F] shadow-lg shadow-[#D4AF37]/25 font-bold scale-105"
                    : "bg-[#0E2548] text-slate-300 hover:text-white hover:bg-[#143566] border border-slate-700/60"
                }`}
              >
                {stage.title} ({stage.grades})
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-[#D4AF37]/30 max-w-4xl mx-auto mb-24 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-700/60 pb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold block mb-1">
                Curriculum Stage
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {currentStage.title}
              </h3>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#0E2548] border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-bold">
              {currentStage.grades}
            </span>
          </div>

          <p className="text-base text-slate-200 leading-relaxed mb-8">
            {currentStage.desc}
          </p>

          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
            Curricular Highlights &amp; Pedagogical Focus:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStage.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#081830] border border-slate-800"
              >
                <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="text-sm text-slate-200 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div id="facilities" className="pt-8">
          <SectionHeading
            badge="CAMPUS INFRASTRUCTURE"
            title="Modern Facilities Designed for Active Learning"
            subtitle="Verified learning laboratories, academic library, and athletic amenities supporting comprehensive student development."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((facility, idx) => {
              const IconComp = facility.icon;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden border border-[#D4AF37]/20 flex flex-col group hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl"
                >
                  <div className="relative aspect-[16/10] bg-[#0A1E3C] overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#07172F]/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
                      {facility.badge}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white font-serif leading-tight">
                            {facility.title}
                          </h4>
                          <span className="text-xs text-[#D4AF37]">
                            {facility.subtitle}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {facility.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Sir C. R. Reddy Public School</span>
                      <span className="text-[#D4AF37] font-semibold">Eluru Campus</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
