import React from "react";
import { AdminUser } from "@/lib/auth/session";
import { ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

interface AdminHeaderProps {
  user: AdminUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-semibold">Authenticated Role:</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8D9E6]/30 border border-[#C8D9E6] text-[#2F4156] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
          <span>School Administrator</span>
        </span>

        {user.isDevBypass ? (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold"
            title="Authenticated via local dev admin session. Database running in resilient local persistent store (.data/school_store.json) pending live Supabase project configuration."
          >
            <AlertTriangle className="w-3 h-3 text-[#D97706]" />
            <span>Dev Local State</span>
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-900 text-[11px] font-bold"
            title="Connected to production Supabase Auth & PostgreSQL"
          >
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span>Supabase Cloud Auth</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <UserCheck className="w-3.5 h-3.5 text-[#567C8D]" />
          <span className="font-bold text-slate-900">{user.email}</span>
        </div>
      </div>
    </header>
  );
}
