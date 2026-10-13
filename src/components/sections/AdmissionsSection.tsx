"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SCHOOL_INFO, getWhatsAppEnquiryUrl } from "@/config/schoolInfo";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  PhoneCall,
  Send,
  FileCheck,
  Shield,
  ExternalLink,
} from "lucide-react";

export function AdmissionsSection() {
  const [formData, setFormData] = useState({
    parent_name: "",
    student_name: "",
    phone: "",
    email: "",
    grade_applying: "",
    message: "",
    consent: false,
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    enquiryId: string;
    studentName: string;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear specific field error when typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    // Client-side quick checks
    if (!formData.parent_name.trim()) {
      setFieldErrors((p) => ({ ...p, parent_name: "Parent name is required." }));
      return;
    }
    if (!formData.student_name.trim()) {
      setFieldErrors((p) => ({ ...p, student_name: "Student name is required." }));
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFieldErrors((p) => ({
        ...p,
        phone: "Enter a valid 10-digit Indian mobile number (e.g., 9848012345).",
      }));
      return;
    }
    if (!formData.grade_applying) {
      setFieldErrors((p) => ({
        ...p,
        grade_applying: "Please select the class or grade of interest.",
      }));
      return;
    }
    if (!formData.consent) {
      setFieldErrors((p) => ({
        ...p,
        consent: "You must consent to school admissions communication.",
      }));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          academic_year: SCHOOL_INFO.admissions.currentAcademicSession,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setErrorMsg(data.error || "Submission failed. Please check your entries.");
        return;
      }

      // Success
      setSuccessData({
        enquiryId: data.enquiryId,
        studentName: data.studentName,
        message: data.message,
      });

      // Reset form
      setFormData({
        parent_name: "",
        student_name: "",
        phone: "",
        email: "",
        grade_applying: "",
        message: "",
        consent: false,
        honeypot: "",
      });
    } catch {
      setErrorMsg("A network error occurred. Please contact the school office directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admissions" className="py-24 bg-[#051020] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="ADMISSIONS 2025–2026"
          title="Begin Your Journey at Sir C. R. Reddy"
          subtitle="Registrations open for Foundational, Preparatory, Middle, Secondary, and Senior Secondary (Science &amp; Commerce) streams."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left Column: Guidelines, Criteria, and WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/30 shadow-xl space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-[#0E2548] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                Current Session: {SCHOOL_INFO.admissions.currentAcademicSession}
              </span>

              <h3 className="text-xl font-serif font-bold text-white">
                Admission Procedure
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Stage 1:</strong> Submit the online admission enquiry form or visit the administrative desk in person.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Stage 2:</strong> Collect prospectus and schedule an interactive student interaction / counseling session.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Stage 3:</strong> Document verification: Birth Certificate, previous class marks memo, and Transfer Certificate (TC).
                  </span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-700/60">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Prefer Direct WhatsApp Assistance?
                </h4>
                <a
                  href={getWhatsAppEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F3628] hover:bg-[#154a37] text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Chat on Official WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {/* School Office Contact Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 text-xs text-slate-300 space-y-2">
              <strong className="text-white block text-sm font-serif">
                Admissions Cell Office Hours:
              </strong>
              <p>Monday – Saturday: 8:30 AM to 4:30 PM</p>
              <p>Helpline: {SCHOOL_INFO.contact.phoneOffice} / {SCHOOL_INFO.contact.phoneAlternative}</p>
              <p>Email: {SCHOOL_INFO.contact.emailOfficial}</p>
              <div className="pt-2">
                <a
                  href={SCHOOL_INFO.contact.websiteOfficial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline text-[11px]"
                >
                  <span>Access Existing Portal (sircrrschool.ac.in)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/35 shadow-2xl relative">
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-bold text-white">
                  Admission Enquiry Form
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Fill in candidate details below. Our admissions coordinator will get in touch with registration steps.
                </p>
              </div>

              {/* Success Confirmation Modal / Banner */}
              {successData ? (
                <div className="p-6 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-white font-serif">
                        Enquiry Successfully Submitted
                      </h4>
                      <p className="text-xs text-emerald-300">
                        Reference ID: <strong className="font-mono text-white">{successData.enquiryId}</strong>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-emerald-100">
                    Thank you. We have received your admission enquiry for <strong>{successData.studentName}</strong>. Our school office will review the enquiry and contact you via phone or email during working hours.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSuccessData(null)}
                      className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold hover:bg-[#143566] transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Anti-spam honeypot (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={handleChange}
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Student & Parent Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Student Full Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        name="student_name"
                        value={formData.student_name}
                        onChange={handleChange}
                        placeholder="e.g. K. Satya Teja"
                        required
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border ${
                          fieldErrors.student_name ? "border-red-500" : "border-slate-700"
                        } text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all`}
                      />
                      {fieldErrors.student_name && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.student_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Parent / Guardian Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleChange}
                        placeholder="e.g. K. Venkateswara Rao"
                        required
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border ${
                          fieldErrors.parent_name ? "border-red-500" : "border-slate-700"
                        } text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all`}
                      />
                      {fieldErrors.parent_name && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.parent_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Primary Contact Mobile <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile (e.g. 9848012345)"
                        required
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border ${
                          fieldErrors.phone ? "border-red-500" : "border-slate-700"
                        } text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="parent@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border ${
                          fieldErrors.email ? "border-red-500" : "border-slate-700"
                        } text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all`}
                      />
                      {fieldErrors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Class of Interest */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Class / Grade of Interest <span className="text-[#D4AF37]">*</span>
                    </label>
                    <select
                      name="grade_applying"
                      value={formData.grade_applying}
                      onChange={handleChange}
                      required
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border ${
                        fieldErrors.grade_applying ? "border-red-500" : "border-slate-700"
                      } text-white text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all`}
                    >
                      <option value="">-- Select Grade or Stream --</option>
                      {SCHOOL_INFO.admissions.gradesOffered.map((grade) => (
                        <option key={grade.id} value={grade.name}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.grade_applying && (
                      <p className="text-[11px] text-red-400 mt-1">{fieldErrors.grade_applying}</p>
                    )}
                  </div>

                  {/* Message / Academic Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Specific Enquiries or Prior School Details <span className="text-slate-500">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mention prior syllabus (CBSE/State Board), medium of instruction, or bus transport queries..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  {/* Privacy & Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded text-[#D4AF37] bg-[#081830] border-slate-700 focus:ring-[#D4AF37]"
                      />
                      <span className="text-xs text-slate-300 leading-normal">
                        I authorize Sir C. R. Reddy Public School to contact me via phone, email, or WhatsApp regarding admissions. I acknowledge that submissions are stored securely in accordance with school data privacy standards. <span className="text-[#D4AF37]">*</span>
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="text-[11px] text-red-400 mt-1 pl-6">{fieldErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] text-sm font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Securely...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Admission Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your personal data is encrypted in transit and never shared with third parties.</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
