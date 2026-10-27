import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, isSupabaseReachable } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DOC_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileNameLower = file.name.toLowerCase();
    const isImage =
      IMAGE_MIME_TYPES.includes(file.type) ||
      IMAGE_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));
    const isDoc =
      DOCUMENT_MIME_TYPES.includes(file.type) ||
      DOCUMENT_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));

    if (!isImage && !isDoc) {
      return NextResponse.json(
        { error: "Invalid file format. Supported files: PDF, Word (DOC/DOCX), Excel, and Images (JPEG, PNG, WebP)." },
        { status: 400 }
      );
    }

    const maxAllowedSize = isDoc ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxAllowedSize) {
      return NextResponse.json(
        { error: `File exceeds the ${isDoc ? "10 MB" : "5 MB"} maximum size limit.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || (isDoc ? "pdf" : "jpg");
    const bucketName = isDoc ? "documents" : "gallery";
    const prefix = isDoc ? "circular" : "campus";
    const cleanFileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // 1. If Supabase is configured and reachable, attempt Supabase Storage upload
    if (isSupabaseConfigured() && (await isSupabaseReachable())) {
      try {
        const adminSupabase = await createAdminSupabaseClient();
        if (adminSupabase) {
          const { data: uploadData, error: uploadError } = await adminSupabase.storage
            .from(bucketName)
            .upload(cleanFileName, buffer, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = adminSupabase.storage
              .from(bucketName)
              .getPublicUrl(cleanFileName);

            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              filename: cleanFileName,
              originalName: file.name,
              storage: "supabase",
              bucket: bucketName,
            });
          } else if (uploadError) {
            console.warn(`[UPLOAD API] Supabase ${bucketName} storage upload error:`, uploadError.message);
          }
        }
      } catch (sbErr) {
        console.warn(`[UPLOAD API] Supabase ${bucketName} storage upload exception:`, sbErr);
      }
    }

    // 2. Resilient local fallback: save to public/uploads/[gallery | documents]
    const subFolder = isDoc ? "documents" : "gallery";
    const uploadDir = path.join(process.cwd(), "public", "uploads", subFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const targetPath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${subFolder}/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanFileName,
      originalName: file.name,
      storage: "local",
      bucket: subFolder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload processing failed";
    console.error("[UPLOAD API ERROR]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
