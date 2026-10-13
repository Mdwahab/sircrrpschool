"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#040C18]/95 backdrop-blur-xl border-b border-[#D4AF37]/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] py-2.5"
          : "bg-[#07172F]/90 backdrop-blur-lg border-b border-[#D4AF37]/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)] py-3.5"
      }`}
    >
      {/* Top golden hairline gradient */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-xl p-1 flex-shrink-0"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37]/40 via-white/5 to-[#D4AF37]/20 ring-1 ring-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:ring-[#D4AF37] transition-all duration-300">
            <Image
              src="/images/logo.svg"
              alt="Sir C. R. Reddy Public School Crest"
              width={40}
              height={40}
              priority
              className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-serif font-bold text-base sm:text-lg lg:text-[19px] text-white tracking-wide leading-tight group-hover:text-[#F3CA52] transition-colors whitespace-nowrap">
              Sir C. R. Reddy Public School
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#D4AF37] font-semibold tracking-[0.18em] uppercase leading-tight mt-0.5 whitespace-nowrap">
              CBSE • Eluru • Estd. 1984
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Floating Glass Pill Container) */}
        <nav
          className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-md shadow-inner"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D4AF37] rounded-full group-hover:w-3/5 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="#admissions"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all duration-200 active:scale-95 group whitespace-nowrap"
          >
            <span>Admissions 2025–26</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#07172F] group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-[#D4AF37]/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07172F]/98 backdrop-blur-2xl border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[#D4AF37]/40 text-xs">→</span>
              </a>
            ))}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2">
              <a
                href="#admissions"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-sm font-bold uppercase tracking-wider hover:brightness-105 shadow-md shadow-[#D4AF37]/25"
              >
                <span>Admission Enquiry 2025–26</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
