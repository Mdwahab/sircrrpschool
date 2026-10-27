"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Notice } from "@/lib/db/types";
import { Bell, Calendar, Download } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollAnimation";

interface NoticesSectionProps {
  notices: Notice[];
}

const CATEGORIES = ["All", "Academic", "Circular", "Examination", "Event", "General"];

export function NoticesSection({ notices }: NoticesSectionProps) {
  const publishedNotices = notices.filter((n) => n.is_published);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredNotices = publishedNotices.filter((n) =>
    selectedCategory === "All" ? true : n.category === selectedCategory
  );

  return (
    <section id="notices" className="py-20 sm:py-28 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="OFFICIAL CIRCULARS"
          title="School Notices &amp; Announcements"
          highlight="Announcements"
          subtitle="Official institutional circulars, academic notifications, examination timetables, and administrative updates."
        />

        {/* Category Filter Tabs: Scroll Reveal */}
        {publishedNotices.length > 0 && (
          <ScrollReveal className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? publishedNotices.length
                  : publishedNotices.filter((n) => n.category === cat).length;
              if (count === 0 && cat !== "All") return null;

              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-2xs ${
                    isActive
                      ? "bg-[#2F4156] text-white shadow-md"
                      : "bg-[#F5EEEB] text-[#2F4156] hover:text-[#567C8D] border border-[#C8D9E6]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-[#C8D9E6]/30 text-white" : "bg-[#C8D9E6]/40 text-[#2F4156]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </ScrollReveal>
        )}

        {/* Dynamic Notices Grid with Direct Framer Motion Orchestration */}
        <AnimatePresence mode="wait">
          {filteredNotices.length === 0 ? (
            <motion.div
              key="empty-notices"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-[#F5EEEB] rounded-3xl p-8 border border-[#C8D9E6] shadow-xs max-w-md mx-auto space-y-3"
            >
              <Bell className="w-8 h-8 text-[#567C8D] mx-auto" />
              <h4 className="font-serif font-bold text-[#2F4156] text-base">No Notices in this Category</h4>
              <p className="text-[#567C8D] text-xs font-normal">
                Check back soon for fresh institutional notifications.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredNotices.map((notice, idx) => (
                <motion.div
                  key={notice.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C8D9E6] hover:border-[#567C8D] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1.5 h-full group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#2F4156] bg-[#F5EEEB] border border-[#C8D9E6]">
                          <span>{notice.category}</span>
                        </span>

                        <span className="flex items-center gap-1.5 text-xs text-[#567C8D] font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#567C8D]" />
                          <span>{notice.publish_date}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-[#2F4156] group-hover:text-[#567C8D] transition-colors leading-snug mb-2.5">
                        {notice.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-[#567C8D] leading-relaxed font-normal">
                        {notice.summary}
                      </p>
                    </div>

                    {notice.attachment_url && (
                      <div className="mt-5 pt-3.5 border-t border-[#C8D9E6]/60 flex items-center justify-between">
                        <a
                          href={notice.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#2F4156] hover:text-[#567C8D] transition-colors group/link"
                        >
                          <Download className="w-4 h-4 text-[#567C8D]" />
                          <span>{notice.attachment_name || "Download Circular PDF"}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
