"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, BookOpen, Award, CheckCircle2, PhoneCall } from "lucide-react";
import { SCHOOL_INFO, getWhatsAppEnquiryUrl } from "@/config/schoolInfo";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#07172F] via-[#091E3D] to-[#051020] pt-12 pb-20">
      {/* Background Architectural Accent & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#D4AF37]/15 rounded-full blur-[140px]" />
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-[#1E497A]/25 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Affiliation & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E2548]/90 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>CBSE Affiliation No. 130072 • Senior Secondary</span>
            </div>

            {/* Main School Title */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.12]">
              Sir C. R. Reddy{" "}
              <span className="gold-text-gradient block mt-1">
                Public School
              </span>
            </h1>

            {/* Approved Motto / Subtitle */}
            <p className="text-lg sm:text-xl font-medium text-amber-200/90 tracking-wide">
              &ldquo;{SCHOOL_INFO.legacy.motto}&rdquo;
            </p>

            {/* Editorial Introduction */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Established in 1984 under the venerable Sir C. R. Reddy Educational Institutions in Eluru, Andhra Pradesh. Empowering generations with rigorous CBSE academics, modern experimental laboratories, and uncompromising moral grounding.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#admissions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-sm font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/25 transition-all transform active:scale-95"
              >
                <span>Admission Enquiry 2025–26</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#0E2548] text-white hover:bg-[#143566] border border-[#D4AF37]/35 text-sm font-semibold transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Explore Our Heritage</span>
              </a>

              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-sm font-semibold transition-all"
                title="Direct enquiry on WhatsApp"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="sm:hidden lg:inline">WhatsApp Helpdesk</span>
              </a>
            </div>

            {/* Verified Quick Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-700/50 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>LKG to Class XII (CBSE)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Science &amp; Commerce</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>40+ Years of Excellence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow & Card */}
              <div className="relative rounded-2xl overflow-hidden glass-card shadow-2xl p-2.5 group">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#0A1E3C] border border-[#D4AF37]/25">
                  <Image
                    src="/images/campus-main.svg"
                    alt="Sir C. R. Reddy Public School Main Campus"
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Corner Badge */}
                  <div className="absolute top-3 left-3 bg-[#07172F]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Eluru Campus</span>
                  </div>
                </div>

                {/* Card Sub-Details */}
                <div className="p-4 bg-[#07172F]/90 rounded-xl mt-2.5 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Main Academic Complex
                      </h3>
                      <p className="text-xs text-slate-400">
                        G.N.T. Road, Vatluru, Eluru — 534006
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#0A1E3C] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
                      CBSE 130072
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-300/80 text-[11px]">
                      <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Sir C.R. Reddy Educational Trust
                    </span>
                    <a
                      href="#facilities"
                      className="text-[#D4AF37] font-semibold hover:underline"
                    >
                      View Facilities &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
