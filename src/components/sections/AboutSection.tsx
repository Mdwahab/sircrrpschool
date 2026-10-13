import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheck, Target, Compass, Award } from "lucide-react";


export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#051020] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#0A1E3C]/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="OUR HERITAGE &amp; VISION"
          title="Rooted in History, Dedicated to Excellence"
          subtitle="Four decades of academic distinction under the historic Sir C. R. Reddy Educational Institutions."
        />

        {/* Founder Tribute & Historical Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden glass-card p-2 shadow-2xl border border-[#D4AF37]/30">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0A1E3C]">
                <Image
                  src="/images/founder-portrait.svg"
                  alt="Dr. Sir Cattamanchi Ramalinga Reddy Tribute Portrait"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase block">
                  Patron &amp; Namesake
                </span>
                <span className="text-xs text-slate-400">
                  Dr. Sir Cattamanchi Ramalinga Reddy (1880–1951)
                </span>
              </div>
            </div>
          </div>

          {/* Text Editorial Column */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 leading-relaxed text-base">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2548] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sir C.R. Reddy Educational Institutions (Managing Committee Estd. 1945)</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
              A Noble Educational Legacy in Eluru
            </h3>

            <p>
              Sir C. R. Reddy Public School was founded in <strong>1984</strong> in Eluru, Andhra Pradesh, under the aegis of the Sir C. R. Reddy Educational Institutions, whose pioneer managing committee was established in 1945. Named in honor of the eminent educationist, scholar, and founding Vice-Chancellor of Andhra University, <strong>Dr. Sir Cattamanchi Ramalinga Reddy</strong>, the institution upholds his timeless conviction that education must combine intellectual vigor with uncompromising ethical character.
            </p>

            <p>
              Affiliated with the <strong>Central Board of Secondary Education (CBSE No. 130072)</strong>, New Delhi, up to the Senior Secondary level, the school offers a continuous educational pathway from the foundational pre-primary stage through Class XII, preparing scholars for national competitive examinations, higher university studies, and responsible citizenship.
            </p>

            <div className="p-4 rounded-xl bg-[#081830] border-l-4 border-[#D4AF37] text-sm text-amber-100">
              <p className="font-serif italic">
                &ldquo;True education illuminates not only the intellect with scientific truths, but molds the spirit to serve society with courage, truth, and humanity.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Vision, Mission, and Core Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vision */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 flex flex-col justify-between hover:border-[#D4AF37]/45 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-inner">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-serif">
                Our Vision
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                To be a premier center of holistic schooling that inspires students to achieve academic mastery, scientific inquiry, aesthetic sensibility, and patriotic integrity within an atmosphere of disciplined discovery.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-[#D4AF37] font-semibold">
              Holistic Growth &amp; National Spirit
            </div>
          </div>

          {/* Card 2: Mission */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 flex flex-col justify-between hover:border-[#D4AF37]/45 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-inner">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-serif">
                Our Mission
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                To deliver child-centric, experientially grounded CBSE curriculum education, fostering critical thinking, modern scientific skills, physical vigor, and empathetic character through committed mentorship.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-[#D4AF37] font-semibold">
              Excellence Through Mentorship
            </div>
          </div>

          {/* Card 3: Values */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 flex flex-col justify-between hover:border-[#D4AF37]/45 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-serif">
                Core Philosophy
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Guided by the institution&apos;s foundational principle — <em>&ldquo;Quality Service &amp; Value Based Education&rdquo;</em> — we prioritize moral rectitude, communal harmony, environmental stewardship, and humility.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-[#D4AF37] font-semibold">
              Value-Based Educational Foundation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
