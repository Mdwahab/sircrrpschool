"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote, ShieldCheck, AlertCircle } from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";
import {
  ScrollReveal,
  ScrollStaggerContainer,
  ScrollStaggerItem,
  ScrollImageReveal,
} from "@/components/ui/ScrollAnimation";

interface PrincipalSectionProps {
  settings?: Record<string, string>;
}

export function PrincipalSection({ settings }: PrincipalSectionProps = {}) {
  const principalName = settings?.principalName || SCHOOL_INFO.principal.namePlaceholder;
  const principalMessage =
    settings?.principalMessage ||
    "At Sir C. R. Reddy Public School, our endeavor is to nurture every child into a confident, disciplined, and enlightened individual capable of navigating modern global challenges while remaining firmly anchored in cultural and moral values.";

  return (
    <section id="principal" className="py-20 sm:py-28 bg-[#F5EEEB] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="LEADERSHIP &amp; DIRECTION"
          title="From the Principal's Desk"
          highlight="Principal's Desk"
          subtitle="Guiding young minds towards intellectual brilliance, ethical courage, and responsible citizenship."
        />

        <ScrollReveal className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#C8D9E6] shadow-md hover:shadow-xl transition-all duration-300 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Principal Insignia / Portrait Column */}
            <ScrollImageReveal className="md:col-span-5 flex flex-col items-center text-center" delay={0.1}>
              <div style={{ position: "relative" }} className="relative w-full max-w-[260px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5EEEB] border-2 border-[#C8D9E6] shadow-sm group transition-all duration-300 hover:shadow-lg hover:border-[#567C8D] hover:-translate-y-1">
                <Image
                  src="/images/principal-placeholder.svg"
                  alt="Office of the Principal Insignia - Sir C. R. Reddy Public School"
                  fill
                  sizes="260px"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="mt-4">
                <h3 suppressHydrationWarning className="font-serif font-bold text-lg text-[#2F4156]">
                  {principalName}
                </h3>
                <p className="text-xs text-[#567C8D] font-semibold mt-0.5">
                  Office of the Principal, Eluru Campus
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2F4156] bg-[#F5EEEB] px-3 py-1 rounded-full border border-[#C8D9E6]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
                  <span>CBSE Affiliated Administration</span>
                </div>
              </div>
            </ScrollImageReveal>

            {/* Principal Message Column */}
            <ScrollStaggerContainer className="md:col-span-7 space-y-5">
              <ScrollStaggerItem>
                <div className="w-12 h-12 rounded-2xl bg-[#2F4156] flex items-center justify-center text-white shadow-sm">
                  <Quote className="w-6 h-6 text-[#C8D9E6]" />
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4156] leading-snug">
                  Nurturing Character, Intellect &amp;{" "}
                  <span className="bg-gradient-to-r from-[#2F4156] via-[#3E5C6B] to-[#567C8D] bg-clip-text text-transparent font-extrabold">
                    Global Competence
                  </span>
                </h4>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="space-y-3.5 text-sm sm:text-base text-[#567C8D] leading-relaxed font-normal">
                  <p className="italic font-serif text-[#2F4156] text-base border-l-2 border-[#567C8D] pl-3 py-1 bg-[#F5EEEB] rounded-r-lg">
                    &ldquo;{principalMessage}&rdquo;
                  </p>

                  <p>
                    We recognize that education extends beyond textbooks. Our faculty members employ interactive learning methodologies that foster critical thinking, collaborative inquiry, and a lifelong thirst for knowledge.
                  </p>

                  <p>
                    With dedicated laboratory infrastructure, sports grounds, and a disciplined academic atmosphere, we prepare our scholars for academic and personal growth.
                  </p>
                </div>
              </ScrollStaggerItem>

              {/* Explicit Verification Note */}
              {!SCHOOL_INFO.principal.isPhotoVerified && (
                <ScrollStaggerItem>
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5EEEB] border border-[#C8D9E6] text-xs text-[#2F4156]">
                      <AlertCircle className="w-4 h-4 text-[#567C8D] shrink-0" />
                      <span>Official photographic portrait and signed message awaiting final school management confirmation.</span>
                    </div>
                  </div>
                </ScrollStaggerItem>
              )}
            </ScrollStaggerContainer>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
