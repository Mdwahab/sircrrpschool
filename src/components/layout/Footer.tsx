"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";

interface FooterProps {
  settings?: Record<string, string>;
}

export function Footer({ settings }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const campusAddress = settings?.campusAddress || SCHOOL_INFO.address.campus;
  const pincode = settings?.pincode || SCHOOL_INFO.address.pincode;
  const phoneOffice = settings?.phoneOffice || SCHOOL_INFO.contact.phoneOffice;
  const phoneAlternative = settings?.phoneAlternative || SCHOOL_INFO.contact.phoneAlternative;
  const emailOfficial = settings?.emailOfficial || SCHOOL_INFO.contact.emailOfficial;
  const currentSession = settings?.currentAcademicSession || SCHOOL_INFO.admissions.currentAcademicSession;

  return (
    <footer className="bg-[#2F4156] text-[#C8D9E6] relative pt-8 pb-6 border-t-2 border-[#567C8D] overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 mb-6">
          {/* Col 1: Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0 bg-white rounded-full border border-[#C8D9E6] shadow-xs overflow-hidden">
                <Image
                  src="/images/schoollogo.png"
                  alt="Sir C. R. Reddy Public School Crest"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="leading-tight">
                <h3 className="font-serif font-bold text-white text-base whitespace-nowrap">
                  Sir C. R. Reddy <span className="text-[#C8D9E6]">Public School</span>
                </h3>
                <p className="text-[11px] text-[#C8D9E6]/70 font-mono">
                  Estd. 1984 | CBSE Affiliation No: 130072
                </p>
              </div>
            </div>

            <p className="text-[#C8D9E6]/80 leading-relaxed font-normal text-xs pr-4">
              Under Sir C. R. Reddy Educational Institutions (Estd. 1945). Dedicated to values-grounded CBSE senior secondary education in Eluru, Andhra Pradesh.
            </p>

            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1E2B3A] border border-[#567C8D]/60 text-white text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8D9E6]" />
                <span>Senior Secondary Co-Educational</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#3E556E] pb-1.5 mb-2 font-serif">
              Institutional Sections
            </h4>
            <ul className="space-y-1.5 text-xs text-[#C8D9E6]/80">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About &amp; Founding Legacy
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-white transition-colors">
                  Academics &amp; Curriculum (LKG – XII)
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">
                  Laboratories &amp; Campus Facilities
                </a>
              </li>
              <li>
                <a href="#principal" className="hover:text-white transition-colors">
                  Principal&apos;s Desk
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-white transition-colors">
                  CBSE Board Examination Results
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Photo &amp; Media Gallery
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-white transition-colors">
                  Circulars &amp; Schedules
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Admissions & Compliance (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#3E556E] pb-1.5 mb-2 font-serif">
              Admissions &amp; SARAS
            </h4>
            <ul className="space-y-1.5 text-xs text-[#C8D9E6]/80">
              <li>
                <a
                  href="#admissions"
                  className="text-white font-semibold hover:text-[#C8D9E6] transition-colors"
                  suppressHydrationWarning
                >
                  Admissions {currentSession}
                </a>
              </li>
              <li>
                <a href="#admissions" className="hover:text-white transition-colors">
                  Prospectus &amp; Eligibility
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-white transition-colors">
                  CBSE SARAS Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Administrative Desk Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#3E556E] pb-1.5 mb-2 font-serif">
              Administrative Desk
            </h4>
            <div className="space-y-2 text-xs text-[#C8D9E6]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8D9E6] shrink-0 mt-0.5" />
                <span className="leading-snug" suppressHydrationWarning>
                  {campusAddress}, Eluru – {pincode}, A.P.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8D9E6] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`tel:${phoneOffice.replace(/\s+/g, "")}`} className="hover:text-white font-mono font-bold text-white transition-colors" suppressHydrationWarning>
                    {phoneOffice}
                  </a>
                  <a href={`tel:${phoneAlternative.replace(/\s+/g, "")}`} className="hover:text-white font-mono text-[#C8D9E6]/70 transition-colors" suppressHydrationWarning>
                    +91 {phoneAlternative} (Admissions)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8D9E6] shrink-0 mt-0.5" />
                <a href={`mailto:${emailOfficial}`} className="hover:text-white font-mono text-[#C8D9E6] transition-colors" suppressHydrationWarning>
                  {emailOfficial}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C8D9E6] shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.contact.officeTimings}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="pt-4 border-t border-[#3E556E] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#C8D9E6]/70">
          <p>
            &copy; {currentYear} Sir C. R. Reddy Public School, Eluru. All Rights Reserved.
          </p>

          <p className="flex items-center gap-2 font-mono text-[11px] text-[#C8D9E6]/70">
            <span>CBSE Affiliation No: 130072</span>
            <span className="text-[#567C8D]">|</span>
            <span>Co-Educational Senior Secondary</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
