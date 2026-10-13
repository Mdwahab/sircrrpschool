"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { GalleryImage } from "@/lib/db/types";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Campus" as GalleryImage["category"],
    image_url: "",
    alt_text: "",
    caption: "",
    sort_order: 10,
    is_published: true,
  });

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        if (!ignore && data.success) {
          setImages(data.images);
        }
      } catch {
        if (!ignore) setErrorMsg("Failed to load gallery items.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTogglePublish = async (img: GalleryImage) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...img,
          is_published: !img.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? data.image : i))
        );
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete gallery photograph: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert("Failed to delete gallery item.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to add gallery item.");
        return;
      }

      setImages((prev) => [data.image, ...prev]);
      setModalOpen(false);
      setForm({
        title: "",
        category: "Campus",
        image_url: "",
        alt_text: "",
        caption: "",
        sort_order: 10,
        is_published: true,
      });
    } catch {
      setErrorMsg("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
            <span>Photo Gallery Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated campus photographs, category tags, captions, and publication status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-[#07172F] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photograph</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          <span>Loading gallery catalog...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center border border-slate-800 text-slate-400">
          No gallery items found. Click &quot;Add Photograph&quot; to register a campus visual.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="glass-card rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#0A1E3C] overflow-hidden">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#07172F]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{img.category}</span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-white font-serif leading-snug">
                    {img.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(img)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                    img.is_published
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {img.is_published ? (
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

                <button
                  type="button"
                  onClick={() => handleDelete(img.id, img.title)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photograph Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#07172F] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <h3 className="text-xl font-serif font-bold text-white mb-1">
              Register Campus Photograph
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Add verified photographic media and metadata to the school gallery database.
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
                  Title / Subject <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Physics Experimental Lab"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
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
                        category: e.target.value as GalleryImage["category"],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
                  >
                    <option value="Campus">Campus</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Academics">Academics</option>
                    <option value="Sports">Sports</option>
                    <option value="Events">Events</option>
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
                        className="rounded text-[#D4AF37]"
                      />
                      <span>Publish Immediately</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Image URL or Path <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  placeholder="/images/science-lab.svg or https://..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                  placeholder="Descriptive text for screen readers"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Detailed description shown in lightbox..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs"
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
                    <span>Save Photograph</span>
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
