import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { SCHOOL_INFO, getWhatsAppEnquiryUrl } from "@/config/schoolInfo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#030914] text-slate-300 border-t border-[#D4AF37]/25 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Identity & Legacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="Sir C. R. Reddy Public School Crest"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base leading-snug">
                  Sir C. R. Reddy Public School
                </h3>
                <p className="text-xs text-[#D4AF37]">
                  Estd. 1984 • CBSE No. 130072
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              An institution under Sir C. R. Reddy Educational Institutions
              (Governing Body Estd. 1945), dedicated to providing holistic,
              value-based senior secondary education grounded in discipline,
              intellect, and national character.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0A1E3C] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Affiliation: CBSE New Delhi (130072)
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#D4AF37]/30 pb-2 mb-4">
              Institutional Sections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#about"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>About &amp; Founding Legacy</span>
                </a>
              </li>
              <li>
                <a
                  href="#academics"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Academics &amp; Curriculum (LKG – XII)</span>
                </a>
              </li>
              <li>
                <a
                  href="#facilities"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Laboratories &amp; Campus Facilities</span>
                </a>
              </li>
              <li>
                <a
                  href="#principal"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Principal&apos;s Desk</span>
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Campus Photo Gallery</span>
                </a>
              </li>
              <li>
                <a
                  href="#achievements"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Board Examination Results</span>
                </a>
              </li>
              <li>
                <a
                  href="#notices"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Official Circulars &amp; Notices</span>
                </a>
              </li>
              <li>
                <a
                  href="#admissions"
                  className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1.5"
                >
                  <span>Admissions 2025–26 Enquiries</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Contact & Office */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#D4AF37]/30 pb-2 mb-4">
              School Campus &amp; Office
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>
                  {SCHOOL_INFO.address.campus}, {SCHOOL_INFO.address.city},{" "}
                  {SCHOOL_INFO.address.district},{" "}
                  {SCHOOL_INFO.address.state} — Pin:{" "}
                  <strong className="text-white">{SCHOOL_INFO.address.pincode}</strong>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href={`tel:${SCHOOL_INFO.contact.phoneOffice}`}
                  className="hover:text-white transition-colors"
                >
                  {SCHOOL_INFO.contact.phoneOffice}
                </a>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{SCHOOL_INFO.contact.phoneAlternative}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href={`mailto:${SCHOOL_INFO.contact.emailOfficial}`}
                  className="hover:text-white transition-colors"
                >
                  {SCHOOL_INFO.contact.emailOfficial}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="text-slate-400">{SCHOOL_INFO.contact.officeTimings}</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <a
                href={SCHOOL_INFO.contact.websiteOfficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
              >
                <span>Existing Web Portal: sircrrschool.ac.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 4: Admissions & Direct Assistance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#D4AF37]/30 pb-2 mb-4">
              Admissions Desk
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Registrations open for Foundational to Senior Secondary streams
              (Science &amp; Commerce) for the {SCHOOL_INFO.admissions.currentAcademicSession} academic year.
            </p>

            <div className="space-y-2">
              <a
                href="#admissions"
                className="block text-center w-full px-4 py-2 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-105 shadow-md transition-all"
              >
                Submit Admission Enquiry
              </a>
              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full px-4 py-2 rounded-lg bg-[#0F3628] hover:bg-[#154a37] text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
              >
                WhatsApp Admissions Enquiry
              </a>
            </div>

            <div className="mt-5 p-2.5 rounded bg-[#07172F] border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white block mb-0.5">CBSE SARAS Compliance</strong>
              Mandatory Public Disclosure records available for inspection at the school administrative desk.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            &copy; {currentYear} Sir C. R. Reddy Public School, Eluru. Managed by Sir C. R. Reddy Educational Institutions. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-[11px]">
              CBSE Affiliation No: 130072
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
