"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Achievement } from "@/lib/db/types";
import { Calendar, Award, FileText, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import {
  ScrollReveal,
  ScrollStaggerContainer,
  ScrollStaggerItem,
} from "@/components/ui/ScrollAnimation";

interface ResultsSectionProps {
  achievements: Achievement[];
}

export function ResultsSection({ achievements }: ResultsSectionProps) {
  const publishedAchievements = achievements.filter((a) => a.is_published);

  return (
    <section id="results" className="py-20 sm:py-28 bg-white relative scroll-mt-20 overflow-hidden">
      <div id="achievements" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="ACADEMIC MERIT &amp; RECORDS"
          title="Results &amp; Institutional Standing"
          highlight="Institutional Standing"
          subtitle="CBSE Board examination outcomes, academic standards, and verified student achievements."
        />

        {/* Accreditation & Academic Standing Banner: Scroll Reveal */}
        <ScrollReveal className="max-w-4xl mx-auto mb-14 p-5 sm:p-6 rounded-3xl bg-white border border-[#C8D9E6] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EEEB] border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#567C8D]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#567C8D] uppercase tracking-wider font-mono">
                Certified CBSE Board Academic Standing
              </p>
              <p className="text-xs sm:text-sm text-[#2F4156] font-semibold mt-0.5">
                Affiliation No. 130072 | Senior Secondary Level (Classes LKG to XII)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2F4156] bg-[#F5EEEB] px-4 py-2 rounded-full border border-[#C8D9E6] shrink-0 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#567C8D]" />
            <span>Official Institutional Records</span>
          </div>
        </ScrollReveal>

        {publishedAchievements.length === 0 ? (
          <ScrollReveal className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#C8D9E6] text-center shadow-md space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#F5EEEB] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D] mx-auto shadow-xs">
              <Award className="w-7 h-7 text-[#2F4156]" />
            </div>
            <h3 className="font-serif font-bold text-[#2F4156] text-xl sm:text-2xl">
              Official CBSE Board Result Archive
            </h3>
            <p className="text-xs sm:text-sm text-[#567C8D] max-w-lg mx-auto leading-relaxed font-normal">
              Official annual board result gazettes and topper recognitions are published here directly by the school administrative desk following formal CBSE announcements.
            </p>
            <p className="text-xs text-[#567C8D] font-medium">
              To review verified historical score archives, parents may consult the administrative office during working hours.
            </p>
          </ScrollReveal>
        ) : (
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedAchievements.map((item) => (
              <ScrollStaggerItem key={item.id}>
                <div className="bg-white rounded-3xl p-6 border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-xl hover:-translate-y-1.5 h-full group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#2F4156] bg-[#C8D9E6]/35 border border-[#C8D9E6] font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#567C8D]" />
                        <span>{item.academic_year}</span>
                      </span>

                      {item.is_verified_record && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2F4156] bg-[#F5EEEB] px-2.5 py-0.5 rounded-full border border-[#C8D9E6]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#2F4156] group-hover:text-[#567C8D] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs font-bold text-[#567C8D] uppercase tracking-wider mt-1 mb-2">
                      {item.category}
                    </p>

                    <p className="text-xs sm:text-sm text-[#567C8D] leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {item.student_name && (
                      <div className="mt-3.5 pt-2.5 border-t border-[#C8D9E6]/60 text-xs font-medium text-[#567C8D]">
                        <span>Student: <strong className="text-[#2F4156] font-semibold">{item.student_name}</strong></span>
                      </div>
                    )}
                  </div>

                  {item.document_url && (
                    <div className="pt-2">
                      <a
                        href={item.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4156] hover:text-[#567C8D] transition-colors group/link"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Gazette PDF</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        )}
      </div>
    </section>
  );
}
