"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Notice } from "@/lib/db/types";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Academic" as Notice["category"],
    summary: "",
    content: "",
    attachment_name: "",
    attachment_url: "",
    is_published: true,
  });

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/notices");
        const data = await res.json();
        if (!ignore && data.success) {
          setNotices(data.notices);
        }
      } catch {
        if (!ignore) setErrorMsg("Failed to load circulars.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTogglePublish = async (notice: Notice) => {
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...notice,
          is_published: !notice.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) =>
          prev.map((n) => (n.id === notice.id ? data.notice : n))
        );
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete notice: "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      alert("Failed to delete notice.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          summary: form.summary,
          content: form.content,
          attachment_name: form.attachment_name || null,
          attachment_url: form.attachment_url || null,
          is_published: form.is_published,
          publish_date: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to save notice.");
        return;
      }

      setNotices((prev) => [data.notice, ...prev]);
      setModalOpen(false);
      setForm({
        title: "",
        category: "Academic",
        summary: "",
        content: "",
        attachment_name: "",
        attachment_url: "",
        is_published: true,
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
            <Bell className="w-6 h-6 text-[#D4AF37]" />
            <span>Notices &amp; Circulars Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish official announcements, CBSE examination circulars, and downloadable documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Circular</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          <span>Loading circulars database...</span>
        </div>
      ) : notices.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center border border-slate-800 text-slate-400">
          No circular records found. Click &quot;New Circular&quot; to author one.
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#040C18] text-[#D4AF37] uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Notice Title &amp; Summary</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/30">
                        {n.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top max-w-md">
                      <strong className="text-white block font-semibold text-sm mb-0.5">
                        {n.title}
                      </strong>
                      <p className="text-slate-400 text-xs line-clamp-2">
                        {n.summary}
                      </p>
                      {n.attachment_name && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] mt-1.5">
                          <FileText className="w-3 h-3" />
                          <span>{n.attachment_name}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{n.publish_date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(n)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                          n.is_published
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900"
                            : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {n.is_published ? (
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
                        onClick={() => handleDelete(n.id, n.title)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Notice"
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

      {/* Author New Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#07172F] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <h3 className="text-xl font-serif font-bold text-white mb-1">
              Author School Notice / Circular
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter circular metadata. Published circulars are visible immediately on the public website.
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
                  Circular Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CBSE Class X Examination Registration 2025"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as Notice["category"],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Circular">Circular</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Publish Status
                  </label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) =>
                          setForm({ ...form, is_published: e.target.checked })
                        }
                        className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>Publish Immediately</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Brief Summary <span className="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Concise overview displayed on the public notice board..."
                  className="w-full px-3 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Attachment Name (PDF/Doc)
                </label>
                <input
                  type="text"
                  value={form.attachment_name}
                  onChange={(e) =>
                    setForm({ ...form, attachment_name: e.target.value })
                  }
                  placeholder="e.g. CBSE_Exam_Circular_2025.pdf"
                  className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Attachment URL or Supabase Storage Link
                </label>
                <input
                  type="text"
                  value={form.attachment_url}
                  onChange={(e) =>
                    setForm({ ...form, attachment_url: e.target.value })
                  }
                  placeholder="https://... or #"
                  className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs font-mono"
                />
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
                    <span>Save Circular</span>
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
