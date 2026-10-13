"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both administrator email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Check your credentials.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMsg("Network error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseDevAdmin = () => {
    setEmail("admin@sircrrschool.ac.in");
    setPassword("Admin@SirCRR1984");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07172F] via-[#091E3D] to-[#040C18] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 border border-[#D4AF37]/35 shadow-2xl relative">
        {/* Crest & Title */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src="/images/logo.svg"
              alt="Sir C. R. Reddy School Crest"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Administrator Portal
          </h1>
          <p className="text-xs text-[#D4AF37] font-semibold mt-1">
            Sir C. R. Reddy Public School • Eluru
          </p>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Management Access Only</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sircrrschool.ac.in"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-sm font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Development Quick Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-lg bg-[#081830] border border-amber-600/30 text-[11px] text-amber-200/90 mb-3 text-left">
            <p className="font-semibold text-[#D4AF37] mb-1">
              Local Development Preview:
            </p>
            <p className="text-slate-300">
              When live Supabase Auth credentials are not yet configured in <code>.env.local</code>, click below to autofill the pre-authorized development review account:
            </p>
            <button
              type="button"
              onClick={handleUseDevAdmin}
              className="mt-2 text-[#D4AF37] underline font-mono text-[11px] hover:text-white cursor-pointer"
            >
              Fill Dev Admin Credentials (admin@sircrrschool.ac.in)
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to School Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
