"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SCHOOL_INFO } from "@/config/schoolInfo";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Phone,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollStaggerContainer,
  ScrollStaggerItem,
} from "@/components/ui/ScrollAnimation";

interface AdmissionsSectionProps {
  settings?: Record<string, string>;
}

const ADMISSION_STEPS = [
  {
    step: "01",
    title: "Online Inquiry Submission",
    desc: "Submit candidate particulars using the official admission form for administrative review.",
  },
  {
    step: "02",
    title: "Document Verification",
    desc: "Present student's birth certificate, Aadhaar card, previous academic records, and passport photos.",
  },
  {
    step: "03",
    title: "Parental Counseling & Interaction",
    desc: "Informal, constructive discussion with academic coordinators to understand developmental progress.",
  },
  {
    step: "04",
    title: "Formal Enrollment & Welcome",
    desc: "Completion of admission formalities, syllabus orientation, and academic scheduling.",
  },
];

export function AdmissionsSection({ settings }: AdmissionsSectionProps = {}) {
  const currentSession = settings?.currentAcademicSession || SCHOOL_INFO.admissions.currentAcademicSession;
  const campusAddress = settings?.campusAddress || SCHOOL_INFO.address.campus;
  const admissionsHelpline = settings?.phoneAlternative || settings?.phoneOffice || SCHOOL_INFO.contact.phoneAlternative;

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
    parentName: string;
    phone: string;
    email?: string;
    gradeApplying: string;
    message?: string;
    emailStatus: "sent" | "simulated" | "failed";
    emailError?: string;
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
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectGrade = (gradeName: string) => {
    setFormData((prev) => ({ ...prev, grade_applying: gradeName }));
    if (fieldErrors.grade_applying) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.grade_applying;
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!formData.student_name.trim()) {
      errors.student_name = "Student name is required.";
    } else if (formData.student_name.trim().length < 2) {
      errors.student_name = "Student name must be at least 2 characters.";
    }

    if (!formData.parent_name.trim()) {
      errors.parent_name = "Parent or guardian name is required.";
    } else if (formData.parent_name.trim().length < 2) {
      errors.parent_name = "Parent name must be at least 2 characters.";
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    const normalizedPhone =
      cleanPhone.length === 12 && cleanPhone.startsWith("91")
        ? cleanPhone.slice(2)
        : cleanPhone.length === 11 && cleanPhone.startsWith("0")
        ? cleanPhone.slice(1)
        : cleanPhone;

    if (!normalizedPhone) {
      errors.phone = "Mobile phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9848012345).";
    }

    if (!formData.grade_applying) {
      errors.grade_applying = "Please select the class / grade of interest.";
    }

    if (!formData.consent) {
      errors.consent = "You must agree to the privacy consent to submit.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg("Please correct the highlighted errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: normalizedPhone,
          academic_year: currentSession,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setSuccessData({
        enquiryId: data.enquiryId || `ENQ-${Date.now().toString().slice(-6)}`,
        studentName: formData.student_name,
        parentName: formData.parent_name,
        phone: normalizedPhone,
        email: formData.email,
        gradeApplying: formData.grade_applying,
        message: formData.message,
        emailStatus: data.emailStatus || "sent",
        emailError: data.emailError,
      });

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please call the admissions desk.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admissions" className="py-20 sm:py-28 bg-[#F5EEEB] relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={`ACADEMIC SESSION ${currentSession}`}
          title="Admissions Open for Foundational to Class XI"
          highlight="Foundational to Class XI"
          subtitle="Join an established four-decade legacy of CBSE academic instruction, character building, and holistic growth in Eluru."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: 4-Step Roadmap & Official Desk Info: Sequential Stagger */}
          <ScrollStaggerContainer className="lg:col-span-5 space-y-6">
            <ScrollStaggerItem>
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white text-[#2F4156] border border-[#C8D9E6] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
                <span>4-Step Admissions Procedure</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#2F4156] leading-snug">
                How to Enroll Your Child
              </h3>
              <p className="text-xs sm:text-sm text-[#2F4156]/80 mt-1.5 leading-relaxed font-normal">
                The admissions process is straightforward, structured, and focused on your child&apos;s educational progress.
              </p>
            </ScrollStaggerItem>

            {/* 4 Steps Timeline */}
            <div className="space-y-3">
              {ADMISSION_STEPS.map((s, idx) => (
                <ScrollStaggerItem key={idx}>
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#C8D9E6] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <span className="w-10 h-10 rounded-xl bg-[#2F4156] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-[#C8D9E6]/30">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#2F4156] font-serif">
                        {s.title}
                      </h4>
                      <p className="text-xs text-[#2F4156]/75 mt-0.5 leading-relaxed font-normal">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </ScrollStaggerItem>
              ))}
            </div>

            {/* Admissions Office Contact Info */}
            <ScrollStaggerItem>
              <div className="p-6 rounded-2xl bg-white border border-[#C8D9E6] shadow-xs space-y-2.5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 text-[#567C8D] font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-[#567C8D]" />
                  <span>Admissions Counter Contact</span>
                </div>
                <p className="text-xs text-[#2F4156]/80 leading-relaxed font-normal">
                  Parents are also welcome to visit the school administrative office in person between 8:30 AM and 4:30 PM (Monday to Saturday) on <span suppressHydrationWarning>{campusAddress}</span>, Eluru.
                </p>
                <p className="text-xs font-mono font-bold text-[#2F4156] pt-1">
                  Admissions Phone: <span suppressHydrationWarning className="text-[#567C8D] font-bold">+91 {admissionsHelpline}</span>
                </p>
              </div>
            </ScrollStaggerItem>
          </ScrollStaggerContainer>

          {/* Right Column: Admissions Form / Confirmation: Smooth Bottom-to-Top Reveal */}
          <ScrollReveal delay={0.1} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#C8D9E6] shadow-md hover:shadow-lg transition-all duration-300">
            {successData ? (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#C8D9E6]/30 border-2 border-[#567C8D] text-[#567C8D] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="text-2xl font-serif font-bold text-[#2F4156]">
                    Admission Enquiry Recorded
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2F4156]/80 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#2F4156]">{successData.parentName}</strong>. Your enquiry for{" "}
                    <strong className="text-[#2F4156]">{successData.studentName}</strong> ({successData.gradeApplying}) has been securely logged into school records.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5EEEB] border border-[#C8D9E6] text-left max-w-md mx-auto text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#2F4156]/75 font-semibold">Reference Code:</span>
                    <span className="font-mono font-bold text-[#2F4156]">{successData.enquiryId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2F4156]/75 font-semibold">Contact Phone:</span>
                    <span className="font-mono font-bold text-[#2F4156]">+91 {successData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2F4156]/75 font-semibold">Academic Session:</span>
                    <span className="font-bold text-[#2F4156]">{currentSession}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#C8D9E6]/70">
                    <span className="text-[#2F4156]/75 font-semibold">Notification Status:</span>
                    <span className="font-mono text-[#567C8D] font-bold">Email Dispatched to Admissions Desk</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSuccessData(null)}
                    className="px-6 py-2.5 rounded-xl border border-[#C8D9E6] hover:border-[#2F4156] text-[#2F4156] hover:bg-[#F5EEEB] font-bold text-xs transition-colors cursor-pointer bg-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#C8D9E6]/60 pb-3">
                  <h4 className="text-xl font-serif font-bold text-[#2F4156]">
                    Official Admission Enquiry Form
                  </h4>
                  <p className="text-xs text-[#2F4156]/70 mt-0.5">
                    Fields marked with an asterisk (<span className="text-[#567C8D] font-bold">*</span>) are mandatory.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-[#F5EEEB] border border-[#567C8D]/40 text-xs text-[#2F4156] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#567C8D]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Anti-spam hidden honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2F4156]">
                      Student Full Name <span className="text-[#567C8D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleChange}
                      placeholder="e.g. Master Anirudh Reddy"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#2F4156] placeholder:text-[#2F4156]/40 bg-[#F5EEEB]/40 transition-colors focus:bg-white focus:border-[#567C8D] focus:outline-none ${
                        fieldErrors.student_name ? "border-[#567C8D] ring-1 ring-[#567C8D]" : "border-[#C8D9E6]"
                      }`}
                    />
                    {fieldErrors.student_name && (
                      <p className="text-[11px] text-[#567C8D] font-semibold">{fieldErrors.student_name}</p>
                    )}
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2F4156]">
                      Parent / Guardian Name <span className="text-[#567C8D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="parent_name"
                      value={formData.parent_name}
                      onChange={handleChange}
                      placeholder="e.g. Srikanth Reddy"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#2F4156] placeholder:text-[#2F4156]/40 bg-[#F5EEEB]/40 transition-colors focus:bg-white focus:border-[#567C8D] focus:outline-none ${
                        fieldErrors.parent_name ? "border-[#567C8D] ring-1 ring-[#567C8D]" : "border-[#C8D9E6]"
                      }`}
                    />
                    {fieldErrors.parent_name && (
                      <p className="text-[11px] text-[#567C8D] font-semibold">{fieldErrors.parent_name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2F4156]">
                      Contact Mobile <span className="text-[#567C8D]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-[#2F4156]/70 font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9848012345"
                        maxLength={10}
                        className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#2F4156] placeholder:text-[#2F4156]/40 bg-[#F5EEEB]/40 transition-colors focus:bg-white focus:border-[#567C8D] focus:outline-none font-mono ${
                          fieldErrors.phone ? "border-[#567C8D] ring-1 ring-[#567C8D]" : "border-[#C8D9E6]"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-[#567C8D] font-semibold">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2F4156]">
                      Email Address <span className="text-[#2F4156]/50 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8D9E6] focus:border-[#567C8D] text-xs sm:text-sm text-[#2F4156] placeholder:text-[#2F4156]/40 bg-[#F5EEEB]/40 transition-colors focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grade Selector Chips */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#2F4156]">
                      Class / Grade of Interest <span className="text-[#567C8D]">*</span>
                    </label>
                    {formData.grade_applying && (
                      <span className="text-[11px] font-bold text-[#567C8D] font-mono">
                        Selected: {formData.grade_applying}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border border-[#C8D9E6] rounded-xl bg-[#F5EEEB]/40">
                    {SCHOOL_INFO.admissions.gradesOffered.map((grade) => {
                      const isSelected = formData.grade_applying === grade.name;
                      return (
                        <button
                          key={grade.id}
                          type="button"
                          onClick={() => handleSelectGrade(grade.name)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#2F4156] text-white shadow-2xs border border-[#2F4156]"
                              : "bg-white text-[#2F4156] hover:text-[#567C8D] hover:border-[#567C8D] border border-[#C8D9E6]"
                          }`}
                        >
                          {grade.name}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.grade_applying && (
                    <p className="text-[11px] text-[#567C8D] font-semibold">{fieldErrors.grade_applying}</p>
                  )}
                </div>

                {/* Additional Note */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2F4156]">
                    Specific Queries / Remarks <span className="text-[#2F4156]/50 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mention any queries regarding curriculum, transport routes, or previous school transfer..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#C8D9E6] focus:border-[#567C8D] text-xs sm:text-sm text-[#2F4156] placeholder:text-[#2F4156]/40 bg-[#F5EEEB]/40 transition-colors focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Consent */}
                <div className="space-y-0.5">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#C8D9E6] text-[#2F4156] focus:ring-[#567C8D]"
                    />
                    <span className="text-xs text-[#2F4156]/80 leading-relaxed">
                      I consent to receive official school communication regarding admissions and schedules.
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <p className="text-[11px] text-[#567C8D] font-semibold pl-5">{fieldErrors.consent}</p>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] border border-[#2F4156]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Admission Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Admission Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
