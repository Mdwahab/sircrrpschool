"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";
import { Achievement } from "@/lib/db/types";

export default function AdminResultsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    academic_year: "2024–2025",
    category: "CBSE Board Examination" as Achievement["category"],
    description: "",
    student_name: "",
    document_url: "",
    is_published: true,
    is_verified_record: true,
  });

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/results");
        const data = await res.json();
        if (!ignore && data.success) {
          setAchievements(data.achievements);
        }
      } catch {
        if (!ignore) setErrorMsg("Failed to load achievements.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTogglePublish = async (item: Achievement) => {
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          is_published: !item.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === item.id ? data.achievement : a))
        );
      }
    } catch {
      alert("Failed to toggle publish status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete achievement record: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/results?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      alert("Failed to delete achievement.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.academic_year.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          student_name: form.student_name || null,
          document_url: form.document_url || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to save achievement.");
        return;
      }

      setAchievements((prev) => [data.achievement, ...prev]);
      setModalOpen(false);
      setForm({
        title: "",
        academic_year: "2024–2025",
        category: "CBSE Board Examination",
        description: "",
        student_name: "",
        document_url: "",
        is_published: true,
        is_verified_record: true,
      });
    } catch {
      setErrorMsg("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            <span>Board Examination Results &amp; Achievements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain verified academic records, national olympiad honors, and athletic championships.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          <span>Loading achievements...</span>
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center border border-slate-800 text-slate-400">
          No achievement records cataloged yet.
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#040C18] text-[#D4AF37] uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Category &amp; Year</th>
                  <th className="py-3.5 px-4 font-bold">Achievement Record</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {achievements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/30 block w-max mb-1">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.academic_year}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top max-w-md">
                      <strong className="text-white block font-semibold text-sm mb-1">
                        {item.title}
                      </strong>
                      <p className="text-slate-400 text-xs line-clamp-2">
                        {item.description}
                      </p>
                      {item.student_name && (
                        <div className="inline-flex items-center gap-1.5 text-amber-200/90 text-xs mt-1.5">
                          <Award className="w-3 h-3 text-[#D4AF37]" />
                          <span>Recipient: {item.student_name}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                          item.is_published
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#07172F] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <h3 className="text-xl font-serif font-bold text-white mb-1">
              Add Verified School Achievement
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Only verified board results and approved inter-school distinctions may be published.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Achievement Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CBSE Class X Examination — 100% Pass Distinction"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Academic Year <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.academic_year}
                    onChange={(e) =>
                      setForm({ ...form, academic_year: e.target.value })
                    }
                    placeholder="2024–2025"
                    className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as Achievement["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                  >
                    <option value="CBSE Board Examination">CBSE Board Examination</option>
                    <option value="Olympiad & Academics">Olympiad &amp; Academics</option>
                    <option value="Sports & Athletics">Sports &amp; Athletics</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Recipient Name / Batch Cohort
                </label>
                <input
                  type="text"
                  value={form.student_name}
                  onChange={(e) =>
                    setForm({ ...form, student_name: e.target.value })
                  }
                  placeholder="e.g. Class X Board Candidates / Senior Athletic Squad"
                  className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Detailed description of distinction..."
                  className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                    className="rounded text-[#D4AF37]"
                  />
                  <span>Publish Record Publicly</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Achievement</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
