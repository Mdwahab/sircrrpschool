"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { GalleryImage } from "@/lib/db/types";
import { AdminFileUpload } from "@/components/ui/AdminFileUpload";

const CATEGORIES: GalleryImage["category"][] = [
  "Campus",
  "Laboratories",
  "Academics",
  "Sports",
  "Events",
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Campus" as GalleryImage["category"],
    image_url: "",
    alt_text: "",
    caption: "",
    is_published: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/gallery", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to load gallery`);
      }

      setImages(Array.isArray(data.images) ? data.images : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load gallery images.";
      setErrorMsg(message);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        if (!ignore && data.success) {
          setImages(Array.isArray(data.images) ? data.images : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load gallery images.";
          setErrorMsg(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchImages();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTogglePublish = async (img: GalleryImage) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: img.id, is_published: !img.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id ? { ...i, is_published: !i.is_published } : i
          )
        );
      } else {
        alert(data.error || "Failed to update publish state.");
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete photograph: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(data.error || "Failed to delete image.");
      }
    } catch {
      alert("Failed to delete image.");
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
        setErrorMsg(data.error || "Failed to save photo.");
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
        is_published: true,
      });
    } catch {
      setErrorMsg("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredImages = images.filter((img) =>
    activeCategory === "All" ? true : img.category === activeCategory
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2F4156] flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#567C8D]" />
            <span>Campus Photo Gallery Registry</span>
          </h1>
          <p className="text-xs text-[#2F4156] mt-1 font-semibold">
            Curate verified photographs of school laboratories, sports facilities, library, and student events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#FFFFFF] hover:border-[#567C8D] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#567C8D] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer border border-[#2F4156]"
          >
            <Plus className="w-4 h-4 text-[#2F4156]" />
            <span>Add Photograph</span>
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
            {cat} {cat === "All" ? `(${images.length})` : `(${images.filter((i) => i.category === cat).length})`}
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
          <span className="font-semibold">Loading verified gallery catalog...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border-2 border-[#C8D9E6] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#C8D9E6] mx-auto flex items-center justify-center text-[#567C8D]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-[#2F4156] font-serif font-bold text-base">No photographs found</h3>
          <p className="text-[#2F4156] text-xs max-w-md mx-auto">
            {activeCategory === "All"
              ? "No campus photographs are currently registered. Click \"Add Photograph\" to upload an official campus photo."
              : `No photographs found in the "${activeCategory}" category.`}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs border border-[#2F4156]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Photo</span>
          </button>
        </div>
      ) : (
        /* Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-[#FFFFFF] rounded-2xl overflow-hidden border-2 border-[#C8D9E6] flex flex-col justify-between shadow-xs hover:border-[#567C8D] transition-all hover:shadow-md"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#FFFFFF] overflow-hidden">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || img.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#2F4156]/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[10px] font-bold text-[#2F4156] border border-[#C8D9E6] flex items-center gap-1 shadow-xs">
                    <Tag className="w-3 h-3 text-[#567C8D]" />
                    <span>{img.category}</span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#2F4156] font-serif leading-snug">
                    {img.title}
                  </h3>
                  <p className="text-xs text-[#2F4156] line-clamp-2">
                    {img.caption || "No caption provided"}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t-2 border-[#C8D9E6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(img)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                    img.is_published
                      ? "bg-[#FFFFFF] text-[#2F4156] border-2 border-[#567C8D]"
                      : "bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]"
                  }`}
                >
                  {img.is_published ? (
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
                  onClick={() => handleDelete(img.id, img.title)}
                  className="p-1.5 rounded-lg text-[#2F4156] hover:text-[#567C8D] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-[#C8D9E6] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-serif font-bold text-[#2F4156] mb-1">
              Register Campus Photograph
            </h3>
            <p className="text-xs text-[#2F4156] mb-5">
              Add verified photographic media and metadata to the school gallery database.
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
                  placeholder="e.g. Senior Physics Experimental Lab"
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
                        category: e.target.value as GalleryImage["category"],
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

              {/* Upload image file or specify URL */}
              <AdminFileUpload
                label="Photograph File or Upload *"
                helperText="Supports JPEG, PNG, WebP, SVG from your device / local file manager (Max 10 MB)"
                bucket="gallery"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                value={form.image_url}
                fileName={form.title}
                onChange={(url, originalName) =>
                  setForm((prev) => ({
                    ...prev,
                    image_url: url,
                    alt_text: prev.alt_text || (originalName ? originalName.replace(/\.[^/.]+$/, "") : ""),
                    title: prev.title || (originalName ? originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : ""),
                  }))
                }
              />

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Alt Text (Screen Readers)
                </label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                  placeholder="Descriptive text for accessibility"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Brief descriptive note displayed on the website lightbox..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t-2 border-[#C8D9E6]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#F5EEEB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.title || !form.image_url}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 shadow-sm transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
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
