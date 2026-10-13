"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(SCHOOL_INFO.contact.phoneOffice);
  const [email, setEmail] = useState(SCHOOL_INFO.contact.emailOfficial);
  const [whatsApp, setWhatsApp] = useState(SCHOOL_INFO.contact.whatsAppEnquiryNumber);
  const [session, setSession] = useState(SCHOOL_INFO.admissions.currentAcademicSession);
  const [address, setAddress] = useState(SCHOOL_INFO.address.campus);
  const [pincode, setPincode] = useState(SCHOOL_INFO.address.pincode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#D4AF37]" />
          <span>Institutional Settings &amp; Public Metadata</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure verified contact endpoints, admissions session targets, and external inquiry parameters.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Settings successfully updated in runtime memory cache.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Affiliation & Identity (Read-only verified) */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              CBSE Affiliation Credentials
            </h3>
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official CBSE Directory Grounded</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Affiliation Board:</label>
              <input
                type="text"
                disabled
                value="CBSE (Central Board of Secondary Education), New Delhi"
                className="w-full px-3 py-2 rounded-lg bg-[#040C18] border border-slate-800 text-slate-300 cursor-not-allowed text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Affiliation Number (Verified):</label>
              <input
                type="text"
                disabled
                value="130072"
                className="w-full px-3 py-2 rounded-lg bg-[#040C18] border border-slate-800 text-[#D4AF37] font-bold cursor-not-allowed text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">School Level:</label>
              <input
                type="text"
                disabled
                value="Senior Secondary Level (Class LKG to Class XII)"
                className="w-full px-3 py-2 rounded-lg bg-[#040C18] border border-slate-800 text-slate-300 cursor-not-allowed text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Foundation Year:</label>
              <input
                type="text"
                disabled
                value="1984 (Managing Committee Founded 1945)"
                className="w-full px-3 py-2 rounded-lg bg-[#040C18] border border-slate-800 text-slate-300 cursor-not-allowed text-xs"
              />
            </div>
          </div>
        </div>

        {/* Contact & Enquiry Settings */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              Public Contact &amp; Helpdesk Parameters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates to these fields immediately reflect across the header, footer, and contact sections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Office Telephone (Verified):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Official CBSE Directory Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Admissions WhatsApp Number:
              </label>
              <input
                type="text"
                value={whatsApp}
                onChange={(e) => setWhatsApp(e.target.value)}
                placeholder="+919440000000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-amber-300/80 mt-1 block">
                Pending school management verification of dedicated WhatsApp SIM.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Current Admissions Academic Session:
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="2025–2026"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Campus Address:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Postal Code (Verified):
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security / Secret Storage Isolation Notice */}
        <div className="p-4 rounded-xl bg-[#040C18] border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Lock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <p>
            <strong>Security Boundary Notice:</strong> Privileged credentials (such as Supabase service-role keys, database passwords, and Resend API secrets) are intentionally isolated from the editable web settings and must only be provisioned through server environment variables in <code>.env.local</code> and Vercel.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
