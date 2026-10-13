import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Notice } from "@/lib/db/types";
import { Bell, Calendar, Download, ArrowRight } from "lucide-react";

interface NoticesSectionProps {
  notices: Notice[];
}

export function NoticesSection({ notices }: NoticesSectionProps) {
  // Only show published circulars
  const publishedNotices = notices.filter((n) => n.is_published);

  return (
    <section id="notices" className="py-24 bg-[#07172F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="OFFICIAL CIRCULARS"
          title="School Notices &amp; Announcements"
          subtitle="Stay informed with official circulars, examination schedules, academic calendars, and administrative notifications."
        />

        {publishedNotices.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto glass-card rounded-2xl p-8 border border-slate-800">
            <Bell className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-serif mb-1">
              No Active Notices
            </h3>
            <p className="text-xs text-slate-400">
              There are currently no new circulars published. Please check back soon or contact the school office.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {publishedNotices.map((notice) => (
              <div
                key={notice.id}
                className="glass-card rounded-xl p-5 sm:p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/30">
                      {notice.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{notice.publish_date}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-serif group-hover:text-[#F3CA52] transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                {notice.attachment_url && (
                  <div className="flex-shrink-0 self-end sm:self-center">
                    <a
                      href={notice.attachment_url}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0E2548] hover:bg-[#143566] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Circular</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 mb-3">
            Parents seeking previous circulars or academic archives may request them from the administrative office.
          </p>
          <a
            href={`tel:${"08812-251650"}`}
            className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-semibold hover:underline"
          >
            <span>Contact Administrative Office: 08812-251650</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
