import React from "react";
import { AdminUser } from "@/lib/auth/session";
import { ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

interface AdminHeaderProps {
  user: AdminUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-[#07172F] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Authenticated Role:</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>School Administrator</span>
        </span>

        {user.isDevBypass && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-medium" title="Running in local preview mode without live Supabase keys">
            <AlertTriangle className="w-3 h-3" />
            <span>Dev Local State</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A1E3C] border border-slate-700/60 text-slate-300">
          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-medium text-white">{user.email}</span>
        </div>
      </div>
    </header>
  );
}
