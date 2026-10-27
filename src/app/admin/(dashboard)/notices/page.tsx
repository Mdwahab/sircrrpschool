"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Edit2,
} from "lucide-react";
import { Notice } from "@/lib/db/types";
import { AdminFileUpload } from "@/components/ui/AdminFileUpload";

const CATEGORIES: Notice["category"][] = [
  "Academic",
  "Examination",
  "Circular",
  "Event",
  "General",
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

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

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/notices", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to load circulars`);
      }

      setNotices(Array.isArray(data.notices) ? data.notices : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load notices.";
      setErrorMsg(message);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/admin/notices");
        const data = await res.json();
        if (!ignore && data.success) {
          setNotices(Array.isArray(data.notices) ? data.notices : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load notices.";
          setErrorMsg(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchNotices();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: "Academic",
      summary: "",
      content: "",
      attachment_name: "",
      attachment_url: "",
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setEditingItem(notice);
    setForm({
      title: notice.title,
      category: notice.category,
      summary: notice.summary,
      content: notice.content || "",
      attachment_name: notice.attachment_name || "",
      attachment_url: notice.attachment_url || "",
      is_published: notice.is_published,
    });
    setModalOpen(true);
  };

  const handleTogglePublish = async (notice: Notice) => {
    try {
      const res = await fetch("/api/admin/notices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notice.id, is_published: !notice.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) =>
          prev.map((n) =>
            n.id === notice.id ? { ...n, is_published: !n.is_published } : n
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
    if (!window.confirm(`Are you sure you want to delete notice: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert(data.error || "Failed to delete notice.");
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
      const payload = editingItem ? { ...form, id: editingItem.id } : form;
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to save notice.");
        return;
      }

      if (editingItem) {
        setNotices((prev) =>
          prev.map((n) => (n.id === editingItem.id ? data.notice : n))
        );
      } else {
        setNotices((prev) => [data.notice, ...prev]);
      }

      setModalOpen(false);
      setEditingItem(null);
    } catch {
      setErrorMsg("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotices = notices.filter((n) =>
    activeCategory === "All" ? true : n.category === activeCategory
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2F4156] flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#567C8D]" />
            <span>Notices &amp; Official Circulars</span>
          </h1>
          <p className="text-xs text-[#2F4156] mt-1 font-semibold">
            Publish academic schedules, examination circulars, and administrative institutional notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#FFFFFF] hover:border-[#567C8D] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh circulars"
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
            <span>Create Notice</span>
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
            {cat} {cat === "All" ? `(${notices.length})` : `(${notices.filter((n) => n.category === cat).length})`}
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
          <span className="font-semibold">Loading official circulars and notices...</span>
        </div>
      ) : filteredNotices.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border-2 border-[#C8D9E6] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#C8D9E6] mx-auto flex items-center justify-center text-[#567C8D]">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-[#2F4156] font-serif font-bold text-base">No notices found</h3>
          <p className="text-[#2F4156] text-xs max-w-md mx-auto">
            {activeCategory === "All"
              ? "No notices or circulars are currently registered. Click \"Create Notice\" to draft a new circular."
              : `No notices found in category "${activeCategory}".`}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs border border-[#2F4156]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Notice</span>
          </button>
        </div>
      ) : (
        /* Notices List */
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-[#FFFFFF] rounded-2xl p-5 border-2 border-[#C8D9E6] hover:border-[#567C8D] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs min-w-0 overflow-hidden"
            >
              <div className="space-y-1.5 max-w-3xl min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]">
                    {notice.category}
                  </span>
                  <span className="text-xs text-[#2F4156] flex items-center gap-1 font-mono font-bold">
                    <Calendar className="w-3 h-3 text-[#567C8D]" />
                    <span>{notice.publish_date}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2F4156] font-serif leading-snug break-words [overflow-wrap:anywhere]">
                  {notice.title}
                </h3>
                <p className="text-xs text-[#2F4156] leading-relaxed break-words [overflow-wrap:anywhere]">
                  {notice.summary}
                </p>

                {notice.attachment_name && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#2F4156] min-w-0 font-bold">
                    <FileText className="w-3.5 h-3.5 text-[#567C8D] flex-shrink-0" />
                    <span className="underline break-words [overflow-wrap:anywhere] min-w-0">{notice.attachment_name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center border-t sm:border-t-0 border-[#C8D9E6] pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(notice)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    notice.is_published
                      ? "bg-[#FFFFFF] text-[#2F4156] border-2 border-[#567C8D]"
                      : "bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]"
                  }`}
                >
                  {notice.is_published ? (
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
                  onClick={() => handleOpenEdit(notice)}
                  className="p-2 rounded-xl bg-[#FFFFFF] text-[#2F4156] hover:bg-[#FFFFFF] border border-[#C8D9E6] transition-colors cursor-pointer"
                  title="Edit notice"
                >
                  <Edit2 className="w-4 h-4 text-[#2F4156]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(notice.id, notice.title)}
                  className="p-2 rounded-xl bg-[#FFFFFF] text-[#567C8D] hover:bg-[#567C8D] hover:text-[#2F4156] border border-[#C8D9E6] transition-colors cursor-pointer"
                  title="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-[#C8D9E6] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-serif font-bold text-[#2F4156] mb-1">
              {editingItem ? "Edit Circular / Notice" : "Create Official School Notice"}
            </h3>
            <p className="text-xs text-[#2F4156] mb-5">
              Draft and publish circulars, academic notices, and CBSE exam schedules to the website.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Title / Subject <span className="text-[#567C8D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CBSE Senior Secondary Pre-Board Schedule 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-semibold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                    Publish Status
                  </label>
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
                      <span>Publish Immediately</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Brief Summary <span className="text-[#567C8D]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Short 1-2 sentence overview shown in the circulars feed..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Full Details / Content (Optional)
                </label>
                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Extended body text with specific instructions, dates, or guidelines..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-[#C8D9E6]">
                <AdminFileUpload
                  label="Official Circular / Attachment File"
                  helperText="Choose PDF, Word document, Excel, or image from your local file manager (Max 15 MB)"
                  bucket="documents"
                  value={form.attachment_url}
                  fileName={form.attachment_name}
                  onChange={(url, originalName) =>
                    setForm((prev) => ({
                      ...prev,
                      attachment_url: url,
                      attachment_name: prev.attachment_name.trim()
                        ? prev.attachment_name
                        : (originalName || ""),
                    }))
                  }
                  onFileNameChange={(name) =>
                    setForm((prev) => ({
                      ...prev,
                      attachment_name: prev.attachment_name.trim()
                        ? prev.attachment_name
                        : name,
                    }))
                  }
                />

                {form.attachment_url && (
                  <div>
                    <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                      Display Attachment Title (Shown to Parents)
                    </label>
                    <input
                      type="text"
                      value={form.attachment_name}
                      onChange={(e) =>
                        setForm({ ...form, attachment_name: e.target.value })
                      }
                      placeholder="e.g. CBSE Examination Schedule 2025.pdf"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none font-medium"
                    />
                  </div>
                )}
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
                    <span>{editingItem ? "Update Notice" : "Save Notice"}</span>
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
