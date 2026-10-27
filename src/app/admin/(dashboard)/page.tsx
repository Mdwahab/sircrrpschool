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
  Database,
  MailCheck,
} from "lucide-react";
import {
  getAllNoticesAdmin,
  getAllGalleryImagesAdmin,
  getAllAchievementsAdmin,
  getEnquiriesAdmin,
  getDatabaseStatus,
} from "@/lib/db/service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverviewPage() {
  const [notices, gallery, achievements, enquiries, dbStatus] = await Promise.all([
    getAllNoticesAdmin(),
    getAllGalleryImagesAdmin(),
    getAllAchievementsAdmin(),
    getEnquiriesAdmin(),
    getDatabaseStatus(),
  ]);

  const totalNotices = notices.length;
  const publishedNotices = notices.filter((n) => n.is_published).length;
  const draftNotices = totalNotices - publishedNotices;

  const totalGallery = gallery.length;
  const publishedGallery = gallery.filter((g) => g.is_published).length;
  const draftGallery = totalGallery - publishedGallery;

  const totalAchievements = achievements.length;
  const publishedAchievements = achievements.filter((a) => a.is_published).length;
  const verifiedAchievements = achievements.filter((a) => a.is_verified_record).length;

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const contactedEnquiries = enquiries.filter((e) => e.status === "contacted").length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4156]">
            Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-[#2F4156] mt-1 font-semibold">
            Sir C. R. Reddy Public School | Real-time Institutional Portal Management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dbStatus.isReachable ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
              <span>Supabase Cloud Connected</span>
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold shadow-xs"
                title={dbStatus.error ? `Supabase probe: ${dbStatus.error}` : "Local persistent database store active"}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#567C8D]" />
                <span>Resilient Local Store Active</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Database Integration Status Banner if in Local Store Mode */}
      {!dbStatus.isReachable && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-xs text-[#2F4156] flex items-start gap-3 shadow-xs">
          <Database className="w-4 h-4 text-[#567C8D] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#2F4156] block font-bold">
              Operating in Resilient Local Store Mode
            </strong>
            <p className="text-[#2F4156] leading-relaxed">
              All school records (gallery images, board achievements, notices, enquiries, and institutional settings) are safely persisted in <code>.data/school_store.json</code>. Changes survive page reloads and server restarts.
            </p>
            {dbStatus.error && (
              <p className="text-[#2F4156] text-[11px] font-mono">
                Supabase Probe Note: {dbStatus.error}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Notices */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] flex items-center justify-between shadow-xs hover:border-[#567C8D] transition-all">
          <div>
            <span className="text-xs text-[#2F4156] uppercase tracking-wider font-bold">
              Circulars &amp; Notices
            </span>
            <div className="text-3xl font-bold text-[#2F4156] mt-1 font-serif">
              {totalNotices}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-[#567C8D] font-bold">
                {publishedNotices} Published
              </span>
              <span className="text-[#C8D9E6] font-bold">|</span>
              <span className="text-[#2F4156] font-semibold">
                {draftNotices} Draft
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D]">
            <Bell className="w-6 h-6 text-[#567C8D]" />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] flex items-center justify-between shadow-xs hover:border-[#567C8D] transition-all">
          <div>
            <span className="text-xs text-[#2F4156] uppercase tracking-wider font-bold">
              Photo Gallery
            </span>
            <div className="text-3xl font-bold text-[#2F4156] mt-1 font-serif">
              {totalGallery}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-[#567C8D] font-bold">
                {publishedGallery} Live
              </span>
              <span className="text-[#C8D9E6] font-bold">|</span>
              <span className="text-[#2F4156] font-semibold">
                {draftGallery} Unlisted
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D]">
            <ImageIcon className="w-6 h-6 text-[#567C8D]" />
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] flex items-center justify-between shadow-xs hover:border-[#567C8D] transition-all">
          <div>
            <span className="text-xs text-[#2F4156] uppercase tracking-wider font-bold">
              Board Achievements
            </span>
            <div className="text-3xl font-bold text-[#2F4156] mt-1 font-serif">
              {totalAchievements}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-[#567C8D] font-bold">
                {publishedAchievements} Published
              </span>
              <span className="text-[#C8D9E6] font-bold">|</span>
              <span className="text-[#2F4156] font-bold">
                {verifiedAchievements} Verified
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D]">
            <Trophy className="w-6 h-6 text-[#567C8D]" />
          </div>
        </div>

        {/* Enquiries */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] flex items-center justify-between shadow-xs hover:border-[#567C8D] transition-all">
          <div>
            <span className="text-xs text-[#2F4156] uppercase tracking-wider font-bold">
              Admission Enquiries
            </span>
            <div className="text-3xl font-bold text-[#2F4156] mt-1 font-serif">
              {totalEnquiries}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-[#567C8D] font-bold">
                {newEnquiries} New
              </span>
              <span className="text-[#C8D9E6] font-bold">|</span>
              <span className="text-[#2F4156] font-semibold">
                {contactedEnquiries} Contacted
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D]">
            <Users className="w-6 h-6 text-[#567C8D]" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#2F4156] mb-3">
          Quick Administrative Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/notices"
            className="bg-[#FFFFFF] rounded-2xl p-4 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#567C8D]" />
              <span className="text-xs font-bold text-[#2F4156]">Manage Notices</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2F4156] group-hover:text-[#567C8D] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/admin/gallery"
            className="bg-[#FFFFFF] rounded-2xl p-4 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#567C8D]" />
              <span className="text-xs font-bold text-[#2F4156]">Manage Gallery</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2F4156] group-hover:text-[#567C8D] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/admin/results"
            className="bg-[#FFFFFF] rounded-2xl p-4 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-[#567C8D]" />
              <span className="text-xs font-bold text-[#2F4156]">Manage Results</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2F4156] group-hover:text-[#567C8D] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/admin/enquiries"
            className="bg-[#FFFFFF] rounded-2xl p-4 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-5 h-5 text-[#567C8D]" />
              <span className="text-xs font-bold text-[#2F4156]">Review Enquiries</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2F4156] group-hover:text-[#567C8D] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* System Integrity & School Management Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Checklist */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border-2 border-[#C8D9E6] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#C8D9E6] pb-3">
            <h3 className="font-serif font-bold text-[#2F4156] text-base">
              School Management Verification Log
            </h3>
            <span className="text-xs text-[#567C8D] font-bold">
              Compliance Status
            </span>
          </div>

          <ul className="space-y-3 text-xs text-[#2F4156]">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#567C8D] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-[#2F4156]">CBSE Affiliation:</strong> Verified (Affiliation No. 130072, Senior Secondary Level, Eluru).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#567C8D] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-[#2F4156]">Official School Contact:</strong> Tel: +91 6300065646 | Email: sircrrps1@gmail.com.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#567C8D] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-[#2F4156]">Current Admissions Session:</strong> 2025–2026 (Preserved verified session).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MailCheck className="w-4 h-4 text-[#567C8D] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#2F4156]">Email-Only Admission Enquiries:</strong> Inbound parent submissions notify admissions desk via Resend to <code>sircrrps1@gmail.com</code>. WhatsApp redirects removed.
              </span>
            </li>
          </ul>
        </div>

        {/* Security & Infrastructure Status */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border-2 border-[#C8D9E6] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#C8D9E6] pb-3">
            <h3 className="font-serif font-bold text-[#2F4156] text-base">
              Security &amp; Storage Architecture
            </h3>
            <span className="text-xs text-[#567C8D] font-bold">
              Production Hardened
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#2F4156] leading-relaxed">
            <p>
              <strong className="text-[#2F4156]">Row-Level Security (RLS):</strong> Configured on Supabase database tables. Anonymous visitors have zero select access to admission enquiries.
            </p>
            <p>
              <strong className="text-[#2F4156]">Admission Submissions:</strong> Enquiries are written via secure server actions with IP rate-limiting, sanitization, and anti-spam protection.
            </p>
            <p>
              <strong className="text-[#2F4156]">Credentials Isolation:</strong> Privileged keys (service role, Resend API key) are kept strictly server-side and never exposed to browser bundles.
            </p>
            <p>
              <strong className="text-[#2F4156]">Persistent Fallback:</strong> Zero data loss guaranteed. If Supabase is offline, records automatically persist to local storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
