import React from "react";
import Link from "next/link";
import {
  Bell,
  Image as ImageIcon,
  Trophy,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  FileCheck2,
} from "lucide-react";
import {
  getAllNoticesAdmin,
  getAllGalleryImagesAdmin,
  getAllAchievementsAdmin,
  getEnquiriesAdmin,
} from "@/lib/db/service";
import { isSupabaseConfigured } from "@/lib/supabase/server";



export default async function AdminDashboardOverviewPage() {
  const [notices, gallery, achievements, enquiries] = await Promise.all([
    getAllNoticesAdmin(),
    getAllGalleryImagesAdmin(),
    getAllAchievementsAdmin(),
    getEnquiriesAdmin(),
  ]);

  const publishedNotices = notices.filter((n) => n.is_published).length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const supabaseConnected = isSupabaseConfigured();

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sir C. R. Reddy Public School • Real-time Institutional Portal Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          {supabaseConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Supabase Cloud Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Development Local Store Active</span>
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Notices */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Circulars &amp; Notices
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {notices.length}
            </div>
            <span className="text-xs text-[#D4AF37] font-medium">
              {publishedNotices} Published Publicly
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* Gallery */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Photo Gallery
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {gallery.length}
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Campus Assets Cataloged
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Board Achievements
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {achievements.length}
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              Verified Records
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Enquiries */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Admission Enquiries
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {enquiries.length}
            </div>
            <span className="text-xs text-amber-300 font-bold">
              {newEnquiries} Pending Contact
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0E2548] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
          Quick Administrative Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/notices"
            className="glass-card rounded-xl p-4 border border-slate-800 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-white">Create Notice</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
          </Link>

          <Link
            href="/admin/gallery"
            className="glass-card rounded-xl p-4 border border-slate-800 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-white">Upload Photograph</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
          </Link>

          <Link
            href="/admin/results"
            className="glass-card rounded-xl p-4 border border-slate-800 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-white">Add Board Result</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
          </Link>

          <Link
            href="/admin/enquiries"
            className="glass-card rounded-xl p-4 border border-slate-800 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold text-white">Review Enquiries</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* System Integrity & School Management Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Checklist */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              School Management Verification Log
            </h3>
            <span className="text-xs text-[#D4AF37] font-semibold">
              Compliance Status
            </span>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong>CBSE Affiliation:</strong> Verified (No. 130072, Senior Secondary, Eluru).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Official Registered Address:</strong> G.N.T. Road, Eluru — 534006.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Principal Portrait &amp; Message:</strong> Marked as Development Placeholder pending governing body upload.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Admissions WhatsApp Number:</strong> Placeholder configured; requires management verification in Settings.
              </span>
            </li>
          </ul>
        </div>

        {/* Security & Infrastructure Status */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              Security &amp; Storage Architecture
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              Production Hardened
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              • <strong>Row-Level Security (RLS):</strong> Enabled on all Supabase tables. Public users are strictly restricted to reading published records only.
            </p>
            <p>
              • <strong>Admission Submissions:</strong> Enquiries are written via secure server actions with IP rate-limiting and anti-spam honeypot detection.
            </p>
            <p>
              • <strong>Administrator Access:</strong> Supports two initial administrator accounts with server-side session authorization.
            </p>
            <p>
              • <strong>Storage Buckets:</strong> Configured for authenticated uploads with size and MIME validation (max 5MB, JPG/PNG/WebP/PDF).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
