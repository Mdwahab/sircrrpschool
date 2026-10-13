import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Achievement } from "@/lib/db/types";
import { Trophy, Calendar, Award, FileText, CheckCircle2 } from "lucide-react";

interface ResultsSectionProps {
  achievements: Achievement[];
}

export function ResultsSection({ achievements }: ResultsSectionProps) {
  return (
    <section id="achievements" className="py-24 bg-[#051020] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="ACADEMIC MERIT &amp; HONORS"
          title="Results &amp; Institutional Achievements"
          subtitle="Celebrating consistent excellence in CBSE Board Examinations, national olympiads, and inter-school sports meets."
        />

        {achievements.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl p-8 border border-slate-800">
            <p className="text-slate-400 text-sm">
              Official board achievement circulars are currently being compiled for publication.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/25 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2548] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{item.category}</span>
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Year: {item.academic_year}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white font-serif mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {item.student_name && (
                    <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium bg-[#0A1E3C] p-2.5 rounded-lg border border-slate-800">
                      <Award className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      <span>Honoree: {item.student_name}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified School Record</span>
                  </span>

                  {item.document_url && (
                    <a
                      href={item.document_url}
                      className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Document Copy</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CBSE Mandate Note */}
        <div className="mt-12 text-center text-xs text-slate-400 max-w-xl mx-auto">
          <em>
            * Published results reflect verified performance records of Sir C. R. Reddy Public School candidates in Central Board of Secondary Education examinations.
          </em>
        </div>
      </div>
    </section>
  );
}
