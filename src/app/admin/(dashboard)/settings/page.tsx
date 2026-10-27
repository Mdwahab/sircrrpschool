"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2,
} from "lucide-react";
import { SCHOOL_INFO } from "@/config/schoolInfo";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [phoneOffice, setPhoneOffice] = useState(SCHOOL_INFO.contact.phoneOffice);
  const [emailOfficial, setEmailOfficial] = useState(SCHOOL_INFO.contact.emailOfficial);
  const [whatsAppNumber, setWhatsAppNumber] = useState(SCHOOL_INFO.contact.whatsAppEnquiryNumber);
  const [session, setSession] = useState(SCHOOL_INFO.admissions.currentAcademicSession);
  const [address, setAddress] = useState(SCHOOL_INFO.address.campus);
  const [pincode, setPincode] = useState(SCHOOL_INFO.address.pincode);
  const [dbMode, setDbMode] = useState<string>("Local Persistent Store");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/settings", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to load settings`);
      }

      const s = data.settings || {};
      if (s.phoneOffice) setPhoneOffice(s.phoneOffice);
      if (s.emailOfficial) setEmailOfficial(s.emailOfficial);
      if (s.whatsAppEnquiryNumber) setWhatsAppNumber(s.whatsAppEnquiryNumber);
      if (s.currentAcademicSession) setSession(s.currentAcademicSession);
      if (s.campusAddress) setAddress(s.campusAddress);
      if (s.pincode) setPincode(s.pincode);

      if (data.databaseStatus?.storeType) {
        setDbMode(data.databaseStatus.storeType);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load settings.";
      setErrorMsg(msg);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!ignore && data.success && data.settings) {
          const s = data.settings;
          if (s.phoneOffice) setPhoneOffice(s.phoneOffice);
          if (s.emailOfficial) setEmailOfficial(s.emailOfficial);
          if (s.whatsAppEnquiryNumber) setWhatsAppNumber(s.whatsAppEnquiryNumber);
          if (s.currentAcademicSession) setSession(s.currentAcademicSession);
          if (s.campusAddress) setAddress(s.campusAddress);
          if (s.pincode) setPincode(s.pincode);

          if (data.databaseStatus?.storeType) {
            setDbMode(data.databaseStatus.storeType);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load settings.";
          setErrorMsg(msg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOffice,
          emailOfficial,
          whatsAppEnquiryNumber: whatsAppNumber,
          currentAcademicSession: session,
          campusAddress: address,
          pincode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to persist settings.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to persist settings.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2F4156] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#567C8D]" />
            <span>Institutional Settings &amp; Public Metadata</span>
          </h1>
          <p className="text-xs text-[#2F4156] mt-1 font-semibold">
            Configure verified contact endpoints, admissions session targets, and external inquiry parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#FFFFFF] hover:border-[#567C8D] transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50 shadow-xs"
          title="Reload saved settings"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#567C8D] ${loading ? "animate-spin" : ""}`} />
          <span>Reload</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#567C8D] text-[#2F4156] text-xs flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#567C8D] flex-shrink-0" />
          <span>Settings successfully saved to persistent database storage!</span>
        </div>
      )}

      {errorMsg && !loading && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#567C8D] text-[#2F4156] text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#567C8D] flex-shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={loadSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] font-bold text-xs cursor-pointer transition-colors border border-[#2F4156]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-[#2F4156] text-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#567C8D]" />
          <span className="font-semibold">Loading persistent institutional parameters...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Active Data Persistence Backend */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] flex items-center justify-between text-xs shadow-xs">
            <span className="text-[#2F4156] flex items-center gap-2 font-bold">
              <Building2 className="w-4 h-4 text-[#567C8D]" />
              <span>Current Database Persistence Engine:</span>
            </span>
            <span className="font-mono text-[#2F4156] font-bold">{dbMode}</span>
          </div>

          {/* Affiliation & Identity (Read-only verified) */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border-2 border-[#C8D9E6] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#C8D9E6] pb-3">
              <h3 className="font-serif font-bold text-[#2F4156] text-base">
                CBSE Affiliation Credentials
              </h3>
              <span className="inline-flex items-center gap-1 text-[#2F4156] bg-[#FFFFFF] border border-[#C8D9E6] px-2.5 py-0.5 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
                <span>Official CBSE Directory Grounded</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#2F4156] font-bold mb-1">Affiliation Board:</label>
                <input
                  type="text"
                  disabled
                  value="CBSE (Central Board of Secondary Education), New Delhi"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] text-[#2F4156] font-medium cursor-not-allowed text-xs"
                />
              </div>
              <div>
                <label className="block text-[#2F4156] font-bold mb-1">Affiliation Number (Verified):</label>
                <input
                  type="text"
                  disabled
                  value="130072"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#567C8D] text-[#2F4156] font-bold cursor-not-allowed text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[#2F4156] font-bold mb-1">School Level:</label>
                <input
                  type="text"
                  disabled
                  value="Senior Secondary Level (Class LKG to Class XII)"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] text-[#2F4156] font-medium cursor-not-allowed text-xs"
                />
              </div>
              <div>
                <label className="block text-[#2F4156] font-bold mb-1">Foundation Year:</label>
                <input
                  type="text"
                  disabled
                  value="1984 (Managing Committee Founded 1945)"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] text-[#2F4156] font-medium cursor-not-allowed text-xs"
                />
              </div>
            </div>
          </div>

          {/* Contact & Enquiry Settings */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border-2 border-[#C8D9E6] space-y-4 shadow-xs">
            <div className="border-b border-[#C8D9E6] pb-3">
              <h3 className="font-serif font-bold text-[#2F4156] text-base">
                Public Contact &amp; Helpdesk Parameters
              </h3>
              <p className="text-xs text-[#2F4156] mt-0.5">
                Updates to these fields immediately reflect across the school header, footer, and admissions components.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Office Telephone (Verified):
                </label>
                <input
                  type="text"
                  required
                  value={phoneOffice}
                  onChange={(e) => setPhoneOffice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Official CBSE Directory Email:
                </label>
                <input
                  type="email"
                  required
                  value={emailOfficial}
                  onChange={(e) => setEmailOfficial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Current Admissions Academic Session:
                </label>
                <input
                  type="text"
                  required
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="2025–2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] font-bold text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] font-mono outline-none"
                />
                <span className="text-[10px] text-[#2F4156] mt-1 block font-semibold">
                  Preserved active school session: 2025–2026.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Optional WhatsApp Helpline (Non-mandatory):
                </label>
                <input
                  type="text"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  placeholder="+916300065646"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
                <span className="text-[10px] text-[#2F4156] mt-1 block font-semibold">
                  Note: Email is the sole official notification method for admission enquiries. WhatsApp is not required.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Campus Address:
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Postal Code (Verified):
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-mono outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* Security / Secret Storage Isolation Notice */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-xs text-[#2F4156] flex items-start gap-3 shadow-xs">
            <Lock className="w-4 h-4 text-[#567C8D] flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#2F4156]">Security Boundary Notice:</strong> Privileged credentials (such as Supabase service-role keys, database passwords, and Resend API secrets) are isolated from editable web form fields and must only be provisioned through server environment variables in <code>.env.local</code>.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md cursor-pointer transition-all disabled:opacity-50 border border-[#2F4156]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#2F4156]" />
              ) : (
                <Save className="w-4 h-4 text-[#2F4156]" />
              )}
              <span>{saving ? "Saving Settings..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
