"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";
import { ScrollReveal } from "@/components/ui/ScrollAnimation";

interface ContactSectionProps {
  settings?: Record<string, string>;
}

export function ContactSection({ settings }: ContactSectionProps = {}) {
  const campusAddress = settings?.campusAddress || SCHOOL_INFO.address.campus;
  const pincode = settings?.pincode || SCHOOL_INFO.address.pincode;
  const phoneOffice = settings?.phoneOffice || SCHOOL_INFO.contact.phoneOffice;
  const phoneAlternative = settings?.phoneAlternative || SCHOOL_INFO.contact.phoneAlternative;
  const emailOfficial = settings?.emailOfficial || SCHOOL_INFO.contact.emailOfficial;

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#FFFFFF] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CAMPUS LOCATION &amp; CONTACT"
          title="Connect with Sir C. R. Reddy Public School"
          highlight="Sir C. R. Reddy Public School"
          subtitle="Located on G.N.T. Road in Eluru, Andhra Pradesh. We welcome prospective students, parents, and visitors."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Contact Details Card: Bottom-to-Top Reveal */}
          <ScrollReveal
            delay={0.05}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#C8D9E6] shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#C8D9E6]/60">
                <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full border-2 border-[#C8D9E6] shadow-xs overflow-hidden">
                  <Image
                    src="/images/schoollogo.png"
                    alt="Sir C. R. Reddy Public School Logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#2F4156] text-lg leading-snug">
                    Sir C. R. Reddy Public School
                  </h3>
                  <p className="text-xs text-[#567C8D] font-bold">
                    CBSE Affiliation No. 130072
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#2F4156]/80">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EEEB] border border-[#C8D9E6] text-[#567C8D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#567C8D]" />
                  </div>
                  <div>
                    <strong className="text-[#2F4156] block font-semibold mb-0.5">Campus Address:</strong>
                    <span suppressHydrationWarning className="leading-relaxed">{campusAddress}, Eluru – {pincode}, Andhra Pradesh, India.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EEEB] border border-[#C8D9E6] text-[#567C8D] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#567C8D]" />
                  </div>
                  <div>
                    <strong className="text-[#2F4156] block font-semibold mb-0.5">Administrative Office:</strong>
                    <div className="flex flex-col gap-1">
                      <a suppressHydrationWarning href={`tel:${phoneOffice.replace(/\s+/g, "")}`} className="hover:text-[#567C8D] font-mono font-bold text-[#2F4156] transition-colors">
                        {phoneOffice}
                      </a>
                      <a suppressHydrationWarning href={`tel:${phoneAlternative.replace(/\s+/g, "")}`} className="hover:text-[#567C8D] font-mono text-[#2F4156]/70 transition-colors">
                        +91 {phoneAlternative} (Admissions Helpline)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EEEB] border border-[#C8D9E6] text-[#567C8D] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#567C8D]" />
                  </div>
                  <div>
                    <strong className="text-[#2F4156] block font-semibold mb-0.5">Official Email:</strong>
                    <a suppressHydrationWarning href={`mailto:${emailOfficial}`} className="hover:text-[#567C8D] font-mono text-[#2F4156] transition-colors">
                      {emailOfficial}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EEEB] border border-[#C8D9E6] text-[#567C8D] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#567C8D]" />
                  </div>
                  <div>
                    <strong className="text-[#2F4156] block font-semibold mb-0.5">Office Working Hours:</strong>
                    <span>{SCHOOL_INFO.contact.officeTimings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C8D9E6]/60 flex flex-col gap-2.5">
              <a
                href={SCHOOL_INFO.address.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white font-bold text-xs shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] border border-[#2F4156]"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Google Maps Driving Directions</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Interactive Google Map Embed: Bottom-to-Top Reveal */}
          <ScrollReveal
            delay={0.15}
            className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#C8D9E6] shadow-md min-h-[400px] flex flex-col hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 bg-[#F5EEEB] border-b border-[#C8D9E6] flex items-center justify-between text-xs font-semibold text-[#2F4156]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#567C8D]" />
                <span>Sir C. R. Reddy Public School Campus Map, Eluru</span>
              </div>
              <span className="text-[11px] font-mono text-[#2F4156]/60">16.7042° N, 81.0791° E</span>
            </div>

            <div className="relative flex-1 w-full min-h-[350px]">
              <iframe
                title="Sir C. R. Reddy Public School Campus Location"
                src={SCHOOL_INFO.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
