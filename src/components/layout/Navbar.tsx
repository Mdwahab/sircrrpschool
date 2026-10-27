"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  Award,
  FileText,
  Image as ImageIcon,
  Phone,
  UserCheck,
  MapPin,
  Clock,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SCHOOL_INFO } from "@/config/schoolInfo";

interface NavItem {
  href: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const DESKTOP_NAV_LINKS: NavItem[] = [
  { href: "#about", label: "About" },
  { href: "#academics", label: "Academics" },
  { href: "#facilities", label: "Facilities" },
  { href: "#results", label: "Results" },
  { href: "#gallery", label: "Gallery" },
  { href: "#notices", label: "Notices" },
  { href: "#contact", label: "Contact" },
];

const DRAWER_EXPLORE_LINKS: NavItem[] = [
  {
    href: "#about",
    label: "About School",
    description: "Legacy, Vision & Founding Ethos since 1984",
    icon: Building2,
  },
  {
    href: "#academics",
    label: "Academics & Curriculum",
    description: "CBSE Syllabus, Expert Faculty & Methodology",
    icon: GraduationCap,
  },
  {
    href: "#facilities",
    label: "Campus Facilities",
    description: "Science Labs, Digital Classrooms & Sports Grounds",
    icon: FlaskConical,
  },
  {
    href: "#principal",
    label: "Principal's Desk",
    description: "Institutional Leadership & Educational Focus",
    icon: UserCheck,
  },
  {
    href: "#results",
    label: "Merit & Board Results",
    description: "Annual CBSE Examination Archive & Standing",
    icon: Award,
  },
  {
    href: "#gallery",
    label: "Photo Gallery",
    description: "Campus Moments, Annual Days & Infrastructure",
    icon: ImageIcon,
  },
  {
    href: "#notices",
    label: "Circulars & Notices",
    description: "Official Schedules, Exam Dates & Announcements",
    icon: FileText,
  },
  {
    href: "#contact",
    label: "Contact & Location",
    description: "Campus Address, Route Map & Office Hours",
    icon: MapPin,
  },
];

interface NavbarProps {
  settings?: Record<string, string>;
}

export function Navbar({ settings }: NavbarProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const phoneOffice = settings?.phoneOffice || SCHOOL_INFO.contact.phoneOffice;
  const currentSession = settings?.currentAcademicSession || SCHOOL_INFO.admissions.currentAcademicSession;
  const campusAddress = settings?.campusAddress || SCHOOL_INFO.address.campus;

  // Auto-sync public view with fresh server settings whenever tab is focused
  useEffect(() => {
    const handleFocus = () => {
      router.refresh();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      if (window.scrollY < 200) {
        setActiveSection("");
        return;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection("#contact");
        return;
      }

      const sectionIds = ["about", "academics", "facilities", "results", "gallery", "notices", "contact"];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom > 120) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        setMenuOpen(false);
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
          const navOffset = 76;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#C8D9E6] shadow-xs py-2.5 sm:py-3"
            : "bg-white/85 backdrop-blur-sm border-b border-[#C8D9E6]/60 py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#567C8D] rounded-xl p-1 shrink-0"
          >
            <div className="relative w-12 h-12 shrink-0 rounded-full bg-white border-2 border-[#C8D9E6] shadow-xs flex items-center justify-center overflow-hidden group-hover:border-[#567C8D] group-hover:shadow-md transition-all duration-300">
              <Image
                src="/images/schoollogo.png"
                alt="Sir C. R. Reddy Public School Logo"
                width={48}
                height={48}
                priority
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col whitespace-nowrap">
              <span className="font-serif font-bold text-base sm:text-lg lg:text-[19px] text-[#2F4156] tracking-tight leading-tight transition-colors">
                Sir C. R. Reddy <span className="text-[#567C8D] font-bold">Public School</span>
              </span>
              <span className="text-xs text-[#567C8D] font-semibold tracking-wider uppercase leading-tight mt-0.5 flex items-center gap-1.5 font-mono">
                <span>CBSE, Eluru</span>
                <span className="text-[#C8D9E6] font-bold">|</span>
                <span>Estd. 1984</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-1 bg-[#F5EEEB]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C8D9E6] shadow-2xs"
            aria-label="Main Navigation"
          >
            {DESKTOP_NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#567C8D] ${
                    isActive
                      ? "text-white"
                      : "text-[#2F4156] hover:text-[#567C8D] hover:bg-white/60"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-[#2F4156] shadow-xs -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs & Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#admissions"
              onClick={(e) => handleNavClick(e, "#admissions")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group whitespace-nowrap"
            >
              <span>Admissions Open</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 shrink-0 rounded-xl bg-white hover:bg-[#F5EEEB] border border-[#C8D9E6] hover:border-[#567C8D] text-[#2F4156] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#567C8D] active:scale-95 flex items-center justify-center shadow-2xs group cursor-pointer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="navigation-drawer"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center shrink-0">
                <span
                  className={`block h-[2.5px] w-5 shrink-0 rounded-full bg-[#2F4156] group-hover:bg-[#567C8D] transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-[6.75px] bg-[#567C8D]" : ""
                  }`}
                />
                <span
                  className={`block h-[2.5px] w-5 shrink-0 rounded-full bg-[#2F4156] group-hover:bg-[#567C8D] transition-all duration-200 ${
                    menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-[2.5px] w-5 shrink-0 rounded-full bg-[#2F4156] group-hover:bg-[#567C8D] transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-[6.75px] bg-[#567C8D]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Off-Canvas Slide-Over Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Campus Navigation Drawer"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-[#2F4156]/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            <div
              ref={drawerRef}
              className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-screen max-w-md bg-white border-l border-[#C8D9E6] shadow-2xl flex flex-col"
              >
                {/* Drawer Header */}
                <div className="p-5 sm:p-6 border-b border-[#C8D9E6] flex items-center justify-between bg-gradient-to-r from-[#F5EEEB] to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#C8D9E6] shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src="/images/schoollogo.png"
                        alt="Sir C. R. Reddy Public School Logo"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-base text-[#2F4156] leading-tight">
                        Sir C. R. Reddy
                      </h2>
                      <p className="text-xs text-[#567C8D] font-semibold tracking-wider uppercase mt-0.5">
                        Public School | CBSE 130072
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeMenu}
                    className="w-10 h-10 rounded-xl text-[#2F4156] hover:text-[#567C8D] bg-[#F5EEEB] hover:bg-white border border-[#C8D9E6] transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Close navigation drawer"
                  >
                    <div className="w-5 h-5 relative flex items-center justify-center">
                      <span className="block h-[2px] w-5 rounded-full bg-current rotate-45 absolute" />
                      <span className="block h-[2px] w-5 rounded-full bg-current -rotate-45 absolute" />
                    </div>
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-7">
                  {/* Highlight Admissions Card */}
                  <div className="rounded-2xl p-5 bg-[#F5EEEB] border border-[#C8D9E6] shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4156] uppercase tracking-wider">
                        <span suppressHydrationWarning>Admissions Open {currentSession}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#2F4156] text-[10px] font-bold border border-[#C8D9E6]">
                        CBSE Affiliated
                      </span>
                    </div>
                    <p className="text-xs text-[#567C8D] mb-4 leading-relaxed">
                      Nurturing academic excellence, moral integrity, and leadership for Grades LKG through Class XII.
                    </p>
                    <a
                      href="#admissions"
                      onClick={(e) => handleNavClick(e, "#admissions")}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all group"
                    >
                      <span>Submit Admission Enquiry</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Directory Links */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#567C8D] px-1 mb-2.5">
                      Campus Directory &amp; Sections
                    </h3>

                    <div className="space-y-1">
                      {DRAWER_EXPLORE_LINKS.map((item, index) => {
                        const Icon = item.icon || Building2;
                        return (
                          <motion.a
                            key={item.href}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.04 }}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EEEB] border border-transparent hover:border-[#C8D9E6] transition-all duration-200"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-lg bg-[#C8D9E6]/30 group-hover:bg-[#567C8D] border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] group-hover:text-white transition-colors shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-[#2F4156] group-hover:text-[#567C8D] transition-colors">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <p className="text-xs text-[#567C8D] transition-colors leading-tight mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#567C8D] group-hover:translate-x-1 transition-all shrink-0" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Direct Contact */}
                  <div className="space-y-3 pt-3 border-t border-[#C8D9E6]/60">
                    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#567C8D] px-1">
                      Direct Contact &amp; Assistance
                    </h3>

                    <div className="grid grid-cols-1 gap-2">
                      <a
                        href={`tel:${phoneOffice.replace(/\s+/g, "")}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#F5EEEB] hover:bg-white border border-[#C8D9E6] transition-all"
                      >
                        <Phone className="w-4 h-4 text-[#567C8D] shrink-0" />
                        <div className="text-left">
                          <p className="text-xs text-[#567C8D] uppercase tracking-wider font-semibold">Office Telephone</p>
                          <p suppressHydrationWarning className="text-xs font-bold text-[#2F4156] font-mono">{phoneOffice}</p>
                        </div>
                      </a>
                    </div>

                    <div className="flex items-start gap-2.5 px-2 py-1.5 text-xs text-[#567C8D]">
                      <Clock className="w-3.5 h-3.5 text-[#567C8D] shrink-0 mt-0.5" />
                      <span>Office Hours: {SCHOOL_INFO.contact.officeTimings}</span>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 sm:p-5 border-t border-[#C8D9E6] bg-[#F5EEEB] text-center shrink-0">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#2F4156] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D] shrink-0" />
                    <span suppressHydrationWarning>CBSE Affiliation No. 130072 | {campusAddress}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
