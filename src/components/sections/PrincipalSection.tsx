import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { Quote } from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";

export function PrincipalSection() {
  return (
    <section id="principal" className="py-24 bg-[#051020] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="LEADERSHIP &amp; DIRECTION"
          title="From the Principal's Desk"
          subtitle="Guiding young minds towards intellectual brilliance, ethical courage, and responsible citizenship."
        />

        <div className="max-w-5xl mx-auto glass-card rounded-2xl p-6 sm:p-10 border border-[#D4AF37]/30 shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Principal Photo Column */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden bg-[#0A1E3C] border-2 border-[#D4AF37]/40 shadow-xl group">
                <Image
                  src="/images/principal-placeholder.svg"
                  alt="Principal, Sir C. R. Reddy Public School Portrait Placeholder"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-serif font-bold text-lg text-white">
                  {SCHOOL_INFO.principal.namePlaceholder}
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                  Principal, Senior Secondary Wing
                </p>
                <div className="mt-2.5">
                  <VerificationBadge
                    verified={SCHOOL_INFO.principal.isMessageVerified}
                    label="Official Address Pending Management Submission"
                    notes="The formal inaugural message and authorized principal portrait will be published upon approval from the governing committee."
                  />
                </div>
              </div>
            </div>

            {/* Address Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Quote className="w-5 h-5" />
              </div>

              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                Fostering Character, Curiosity, and Compassion
              </h4>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p className="italic bg-[#0A1E3C]/40 p-4 rounded-xl border border-slate-700/60 text-slate-200">
                  &ldquo;At Sir C. R. Reddy Public School, our endeavor is to nurture every child into a confident, disciplined, and enlightened individual capable of navigating modern global challenges while remaining firmly anchored in cultural and moral values.&rdquo;
                </p>

                <p className="text-xs text-slate-400">
                  <em>
                    [Official address text pending final management authorization. The verified inaugural address will be published under the authority of the School Managing Committee, Sir C. R. Reddy Educational Institutions, Eluru.]
                  </em>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#D4AF37] font-bold block">
                    Sir C. R. Reddy Public School
                  </span>
                  <span className="text-[11px] text-slate-400">
                    CBSE Affiliated Senior Secondary School • Eluru
                  </span>
                </div>

                <a
                  href="#admissions"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold hover:underline"
                >
                  <span>Admission Enquiry &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
