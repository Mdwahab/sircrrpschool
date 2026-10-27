"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Paperclip,
} from "lucide-react";

interface AdminFileUploadProps {
  label?: string;
  helperText?: string;
  accept?: string;
  bucket?: "documents" | "gallery";
  value: string;
  onChange: (url: string, originalName?: string) => void;
  fileName?: string;
  onFileNameChange?: (name: string) => void;
  showManualUrl?: boolean;
}

export function AdminFileUpload({
  label = "Attach File From Device",
  helperText = "Choose any PDF, Word document, Excel spreadsheet, or image (Max 15 MB)",
  accept = ".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/webp,image/svg+xml",
  bucket = "documents",
  value,
  onChange,
  fileName,
  onFileNameChange,
  showManualUrl = true,
}: AdminFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file from device.");
      }

      // Update URL
      onChange(data.url, file.name);

      // Auto-populate Title/Name if empty or if callback provided
      if (onFileNameChange) {
        onFileNameChange(file.name);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload processing failed.";
      setErrorMsg(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange("", "");
    if (onFileNameChange) {
      onFileNameChange("");
    }
    setErrorMsg(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider">
          {label}
        </label>
        {showManualUrl && (
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] font-semibold text-[#567C8D] hover:text-[#2F4156] transition-colors cursor-pointer"
          >
            {showManualInput ? "Hide manual URL" : "Or enter URL manually"}
          </button>
        )}
      </div>

      {/* Hidden Native File Input: Opens File Explorer / Native Chooser */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={uploading}
        className="hidden"
        id={`admin-file-picker-${bucket}`}
      />

      {/* Case 1: An attachment / file is already chosen */}
      {value ? (
        <div className="p-3.5 rounded-2xl bg-[#F5EEEB]/70 border-2 border-[#C8D9E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#C8D9E6] flex items-center justify-center text-[#567C8D] shrink-0 shadow-2xs">
              <FileText className="w-5 h-5 text-[#567C8D]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#2F4156] truncate">
                {fileName || value.split("/").pop()}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#567C8D] bg-white px-2 py-0.5 rounded-md border border-[#C8D9E6]/60 truncate max-w-[200px] sm:max-w-[280px]">
                  <Check className="w-3 h-3 text-[#567C8D]" />
                  <span className="truncate">{value}</span>
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#567C8D] hover:text-[#2F4156] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#C8D9E6] hover:border-[#567C8D] text-xs font-bold text-[#2F4156] hover:text-[#567C8D] transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3 h-3 text-[#567C8D]" />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-white border border-[#C8D9E6] hover:border-[#567C8D] text-[#567C8D] hover:text-[#2F4156] transition-colors cursor-pointer shadow-2xs"
              title="Remove Attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Case 2: Dropzone / Picker Button to choose file */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-4 rounded-2xl border-2 border-dashed transition-all duration-200 text-center flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? "border-[#567C8D] bg-[#C8D9E6]/20 scale-[0.99]"
              : "border-[#C8D9E6] bg-[#FFFFFF] hover:border-[#567C8D] hover:bg-[#F5EEEB]/30"
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#567C8D]" />
              <p className="text-xs font-bold text-[#2F4156]">
                Uploading file from your device...
              </p>
              <span className="text-[11px] text-[#567C8D]">
                Processing and generating secure public link
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#F5EEEB] border border-[#C8D9E6] flex items-center justify-center text-[#567C8D] mb-0.5">
                <Paperclip className="w-5 h-5 text-[#567C8D]" />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F4156] hover:bg-[#1E2B3A] text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Upload className="w-4 h-4 text-[#C8D9E6]" />
                  <span>Choose File from Device / File Manager</span>
                </button>
                <p className="text-[11px] text-[#567C8D] mt-2">
                  Or drag &amp; drop your file here directly
                </p>
              </div>

              <span className="text-[10px] text-[#567C8D]/80">
                {helperText}
              </span>
            </>
          )}
        </div>
      )}

      {/* Optional Manual URL Input Fallback */}
      {showManualInput && (
        <div className="pt-2 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-[#567C8D] uppercase tracking-wider mb-1">
            Manual Attachment Link / URL
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /uploads/documents/circular.pdf or https://..."
            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-mono focus:bg-[#FFFFFF] focus:border-[#567C8D] outline-none"
          />
        </div>
      )}

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-[#F5EEEB] border border-[#567C8D] flex items-center gap-2 text-xs text-[#2F4156] font-medium animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-[#567C8D] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
