"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#academics", label: "Academics" },
  { href: "#facilities", label: "Facilities" },
  { href: "#principal", label: "Principal's Desk" },
  { href: "#gallery", label: "Gallery" },
  { href: "#achievements", label: "Achievements" },
  { href: "#notices", label: "Circulars" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Top Notification / Affiliation Bar */}
      <div className="bg-[#040C18] border-b border-[#D4AF37]/20 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              CBSE Affiliated Senior Secondary School
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Affiliation No. <strong className="text-white">130072</strong>
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              Estd. 1984, Eluru, A.P.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${SCHOOL_INFO.contact.phoneOffice}`}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Office: {SCHOOL_INFO.contact.phoneOffice}
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-[#D4AF37] transition-colors"
              title="Authorized Staff Portal"
            >
              <Lock className="w-3 h-3 text-[#D4AF37]/80" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#07172F]/95 backdrop-blur-md shadow-xl border-b border-[#D4AF37]/25 py-2.5"
            : "bg-[#07172F]/80 backdrop-blur-sm border-b border-[#D4AF37]/15 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg p-1"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.svg"
                alt="Sir C. R. Reddy Public School Crest"
                fill
                priority
                className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg lg:text-xl text-white tracking-wide leading-tight group-hover:text-[#F3CA52] transition-colors">
                Sir C. R. Reddy Public School
              </span>
              <span className="text-[11px] sm:text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                CBSE • Eluru • Estd. 1984
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#admissions"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md shadow-[#D4AF37]/20 transition-all active:scale-95"
            >
              <span>Admissions 2025–26</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#07172F] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2">
                <a
                  href="#admissions"
                  onClick={closeMenu}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-[#07172F] text-sm font-bold uppercase tracking-wider hover:brightness-105"
                >
                  <span>Admission Enquiry 2025–26</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/admin/login"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Authorized Staff Portal</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
