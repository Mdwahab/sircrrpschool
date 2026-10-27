"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Award,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit2,
} from "lucide-react";
import { Achievement } from "@/lib/db/types";
import { AdminFileUpload } from "@/components/ui/AdminFileUpload";

const CATEGORIES: Achievement["category"][] = [
  "CBSE Board Examination",
  "Olympiad & Academics",
  "Sports & Athletics",
  "Co-Curricular",
];

export default function AdminResultsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "CBSE Board Examination" as Achievement["category"],
    academic_year: "2025–2026",
    student_name: "",
    description: "",
    document_url: "",
    is_published: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/results", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to load results`);
      }

      setAchievements(Array.isArray(data.achievements) ? data.achievements : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load achievements.";
      setErrorMsg(message);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchAchievements = async () => {
      try {
        const res = await fetch("/api/admin/results");
        const data = await res.json();
        if (!ignore && data.success) {
          setAchievements(Array.isArray(data.achievements) ? data.achievements : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load achievements.";
          setErrorMsg(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchAchievements();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: "CBSE Board Examination",
      academic_year: "2025–2026",
      student_name: "",
      description: "",
      document_url: "",
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      academic_year: item.academic_year,
      student_name: item.student_name || "",
      description: item.description,
      document_url: item.document_url || "",
      is_published: item.is_published,
    });
    setModalOpen(true);
  };

  const handleTogglePublish = async (item: Achievement) => {
    try {
      const res = await fetch("/api/admin/results", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === item.id ? { ...a, is_published: !a.is_published } : a
          )
        );
      } else {
        alert(data.error || "Failed to update publication status.");
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete achievement record: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/results?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.error || "Failed to delete record.");
      }
    } catch {
      alert("Failed to delete record.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = editingItem ? { ...form, id: editingItem.id } : form;
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to save achievement.");
        return;
      }

      if (editingItem) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === editingItem.id ? data.achievement : a))
        );
      } else {
        setAchievements((prev) => [data.achievement, ...prev]);
      }

      setModalOpen(false);
      setEditingItem(null);
    } catch {
      setErrorMsg("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAchievements = achievements.filter((a) =>
    activeCategory === "All" ? true : a.category === activeCategory
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2F4156] flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#567C8D]" />
            <span>Board Examination Results &amp; Honors</span>
          </h1>
          <p className="text-xs text-[#2F4156] mt-1 font-semibold">
            Maintain certified Class X and XII pass records, merit distinctions, and accredited academic milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#FFFFFF] hover:border-[#567C8D] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh achievements"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#567C8D] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer border border-[#2F4156]"
          >
            <Plus className="w-4 h-4 text-[#2F4156]" />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-[#567C8D] text-[#2F4156] shadow-xs"
                : "bg-[#FFFFFF] text-[#2F4156] hover:bg-[#FFFFFF] border-2 border-[#C8D9E6]"
            }`}
          >
            {cat} {cat === "All" ? `(${achievements.length})` : `(${achievements.filter((a) => a.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Actionable Error State with Retry */}
      {errorMsg && !loading && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#567C8D] text-[#2F4156] text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#567C8D] flex-shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] font-bold text-xs cursor-pointer transition-colors border border-[#2F4156]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center text-[#2F4156] text-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#567C8D]" />
          <span className="font-semibold">Loading verified achievement registry...</span>
        </div>
      ) : filteredAchievements.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border-2 border-[#C8D9E6] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#C8D9E6] mx-auto flex items-center justify-center text-[#567C8D]">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-[#2F4156] font-serif font-bold text-base">No achievements found</h3>
          <p className="text-[#2F4156] text-xs max-w-md mx-auto">
            {activeCategory === "All"
              ? "No achievement records are currently registered. Click \"Add Achievement\" to record verified board or school honors."
              : `No achievements recorded under "${activeCategory}".`}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs border border-[#2F4156]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Record</span>
          </button>
        </div>
      ) : (
        /* Achievements Table/List */
        <div className="space-y-4">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs min-w-0 overflow-hidden"
            >
              <div className="space-y-1.5 max-w-3xl min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FFFFFF] text-[#567C8D] border border-[#C8D9E6]">
                    Session {item.academic_year}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]">
                    {item.category}
                  </span>
                  {item.student_name && (
                    <span className="text-xs text-[#2F4156] flex items-center gap-1 min-w-0 break-words [overflow-wrap:anywhere] font-bold">
                      <Award className="w-3.5 h-3.5 text-[#567C8D] flex-shrink-0" />
                      <span>{item.student_name}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#2F4156] font-serif leading-snug break-words [overflow-wrap:anywhere]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#2F4156] leading-relaxed break-words [overflow-wrap:anywhere]">
                  {item.description}
                </p>

                {item.document_url && (
                  <div className="pt-1">
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#2F4156] hover:text-[#567C8D] font-bold flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-[#567C8D]" />
                      <span>View Attached Verification Document</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center border-t sm:border-t-0 border-[#C8D9E6] pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    item.is_published
                      ? "bg-[#FFFFFF] text-[#2F4156] border-2 border-[#567C8D]"
                      : "bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]"
                  }`}
                >
                  {item.is_published ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-[#567C8D]" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-[#2F4156]" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-[#FFFFFF] text-[#2F4156] hover:bg-[#FFFFFF] border border-[#C8D9E6] transition-colors cursor-pointer"
                  title="Edit achievement"
                >
                  <Edit2 className="w-4 h-4 text-[#2F4156]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-xl bg-[#FFFFFF] text-[#567C8D] hover:bg-[#567C8D] hover:text-[#2F4156] border border-[#C8D9E6] transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Achievement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-[#C8D9E6] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-serif font-bold text-[#2F4156] mb-1">
              {editingItem ? "Edit Achievement Record" : "Add Board Result / Honor"}
            </h3>
            <p className="text-xs text-[#2F4156] mb-5">
              Record verified school academic achievements and board examination distinction milestones.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Title / Milestone <span className="text-[#567C8D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CBSE Class X Board Examination — 100% Pass Record"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                    Academic Session <span className="text-[#567C8D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                    placeholder="2025–2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-mono focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-semibold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Recipient / Batch / Student Name
                </label>
                <input
                  type="text"
                  value={form.student_name}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                  placeholder="e.g. Class X Secondary Examination Batch or Student Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Description / Milestone Summary
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Verified details of the honor, distinction count, or examination marks overview..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
              </div>

              <div className="pt-2 border-t border-[#C8D9E6]">
                <AdminFileUpload
                  label="Document / Verification PDF (Optional)"
                  helperText="Choose merit gazette, scorecard, or certificate from your file manager (Max 15 MB)"
                  bucket="documents"
                  value={form.document_url}
                  onChange={(url) =>
                    setForm((prev) => ({
                      ...prev,
                      document_url: url,
                    }))
                  }
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2F4156] font-semibold">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                    className="rounded text-[#567C8D] focus:ring-[#567C8D]"
                  />
                  <span>Publish to Public Website Immediately</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-[#C8D9E6]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#F5EEEB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 shadow-sm transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{editingItem ? "Update Record" : "Save Record"}</span>
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
