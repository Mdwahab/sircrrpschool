"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Image as ImageIcon,
  Trophy,
  Users,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/admin/notices", label: "Notices & Circulars", icon: Bell },
  { href: "/admin/gallery", label: "Photo Gallery", icon: ImageIcon },
  { href: "/admin/results", label: "Board Results & Honors", icon: Trophy },
  { href: "/admin/enquiries", label: "Admission Enquiries", icon: Users },
  { href: "/admin/settings", label: "Institutional Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <aside className="w-64 bg-[#040C18] border-r border-[#D4AF37]/25 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Sir C. R. Reddy Crest"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-white text-sm leading-tight">
              Sir C.R. Reddy
            </h2>
            <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
              Administration Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1" aria-label="Admin Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-[#0A1E3C]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>View Public Website</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
