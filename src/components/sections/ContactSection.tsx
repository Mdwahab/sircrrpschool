import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import { SCHOOL_INFO, getWhatsAppEnquiryUrl } from "@/config/schoolInfo";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#07172F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CAMPUS LOCATION &amp; CONTACT"
          title="Connect with Sir C. R. Reddy Public School"
          subtitle="Located on G.N.T. Road in Eluru, Andhra Pradesh. We welcome prospective students, parents, and visitors."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-700/60">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="/images/logo.svg"
                    alt="Sir C. R. Reddy Public School Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    Sir C. R. Reddy Public School
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-semibold">
                    CBSE Affiliation No. 130072
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Campus Address</strong>
                    <span>
                      {SCHOOL_INFO.address.campus}, {SCHOOL_INFO.address.city},{" "}
                      {SCHOOL_INFO.address.district},{" "}
                      {SCHOOL_INFO.address.state} — Pin:{" "}
                      <strong className="text-white font-semibold">{SCHOOL_INFO.address.pincode}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Telephone Enquiries</strong>
                    <a
                      href={`tel:${SCHOOL_INFO.contact.phoneOffice}`}
                      className="text-[#D4AF37] hover:underline font-semibold block"
                    >
                      {SCHOOL_INFO.contact.phoneOffice}
                    </a>
                    <span className="text-xs text-slate-400">
                      Alternative: {SCHOOL_INFO.contact.phoneAlternative}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Official Email</strong>
                    <a
                      href={`mailto:${SCHOOL_INFO.contact.emailOfficial}`}
                      className="text-[#D4AF37] hover:underline"
                    >
                      {SCHOOL_INFO.contact.emailOfficial}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E2548] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Office &amp; Visitor Hours</strong>
                    <span>{SCHOOL_INFO.contact.officeTimings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60 space-y-2.5">
              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F3628] hover:bg-[#154a37] text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-md"
              >
                <span>WhatsApp Admissions Desk</span>
              </a>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Managed by Sir C. R. Reddy Educational Institutions</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="lg:col-span-7 glass-card rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl flex flex-col min-h-[420px]">
            <div className="p-4 bg-[#081830] border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-serif">
                  Eluru Campus Map &amp; Directions
                </h4>
                <p className="text-xs text-slate-400">
                  G.N.T. Road, Vatluru / Santhi Nagar, Eluru, Andhra Pradesh
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Sir+C+R+Reddy+College+Eluru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex-1 w-full bg-[#051020]">
              <iframe
                title="Sir C. R. Reddy Campus Map Location"
                src={SCHOOL_INFO.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] contrast-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
