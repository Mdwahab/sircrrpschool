"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PREMIUM_EASE } from "@/components/ui/ScrollAnimation";

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
    <div className="min-h-screen bg-[#F5EEEB] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: PREMIUM_EASE }}
        className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#C8D9E6] shadow-xl relative"
      >
        {/* Crest & Title */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#C8D9E6] shadow-sm overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/images/schoollogo.png"
              alt="Sir C. R. Reddy School Crest"
              width={64}
              height={64}
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4156]">
            Administrator Portal
          </h1>
          <p className="text-xs text-[#567C8D] font-bold mt-1">
            Sir C. R. Reddy Public School, Eluru
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8D9E6]/30 border border-[#C8D9E6] text-[11px] text-[#2F4156] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
            <span>Authorized Management Access Only</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#F5EEEB] border border-[#567C8D]/40 text-[#2F4156] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#567C8D]" />
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sircrrschool.ac.in"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5EEEB]/30 border border-[#C8D9E6] text-[#2F4156] placeholder-[#2F4156]/40 text-sm focus:bg-white focus:border-[#567C8D] focus:ring-2 focus:ring-[#C8D9E6] transition-all outline-none font-medium"
              />
              <Mail className="w-4 h-4 text-[#567C8D] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5EEEB]/30 border border-[#C8D9E6] text-[#2F4156] placeholder-[#2F4156]/40 text-sm focus:bg-white focus:border-[#567C8D] focus:ring-2 focus:ring-[#C8D9E6] transition-all outline-none font-medium"
              />
              <Lock className="w-4 h-4 text-[#567C8D] absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] border border-[#2F4156]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Development Quick Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-[#C8D9E6]/60 text-center">
          <div className="p-3.5 rounded-xl bg-[#F5EEEB]/50 border border-[#C8D9E6] text-[11px] text-[#2F4156]/80 mb-3 text-left">
            <p className="font-bold text-[#2F4156] mb-1">
              Local Development Preview:
            </p>
            <p className="text-[#2F4156]/75">
              When live Supabase Auth credentials are not yet configured in <code>.env.local</code>, click below to autofill the pre-authorized development review account:
            </p>
            <button
              type="button"
              onClick={handleUseDevAdmin}
              className="mt-2 text-[#567C8D] font-bold text-[11px] hover:text-[#2F4156] cursor-pointer"
            >
              Fill Dev Admin Credentials (admin@sircrrschool.ac.in)
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#2F4156]/80 hover:text-[#2F4156] font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#567C8D]" />
            <span>Return to School Public Website</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
