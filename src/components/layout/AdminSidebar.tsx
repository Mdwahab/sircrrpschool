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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-20">
      <div>
        {/* Header / Brand */}
        <div className="p-5 border-b border-[#C8D9E6] flex items-center gap-3 bg-[#F5EEEB]">
          <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full border-2 border-[#C8D9E6] shadow-xs overflow-hidden">
            <Image
              src="/images/schoollogo.png"
              alt="Sir C. R. Reddy Crest"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-slate-900 text-sm leading-tight">
              Sir C.R. Reddy
            </h2>
            <span className="text-[10px] text-[#567C8D] font-bold uppercase tracking-wider">
              Administration Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5" aria-label="Admin Navigation">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#C8D9E6]/30 text-[#2F4156] border-l-4 border-[#2F4156] shadow-2xs font-bold"
                    : "text-slate-700 hover:text-[#2F4156] hover:bg-[#F5EEEB]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#2F4156]" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#2F4156] hover:bg-[#F5EEEB] transition-colors border border-transparent hover:border-[#C8D9E6]"
        >
          <ArrowLeft className="w-4 h-4 text-[#567C8D]" />
          <span>View Public Website</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#2F4156] hover:bg-[#F5EEEB] transition-colors cursor-pointer text-left border border-transparent hover:border-[#C8D9E6]"
        >
          <LogOut className="w-4 h-4 text-[#567C8D]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
