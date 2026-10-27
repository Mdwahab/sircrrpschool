import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getAllGalleryImagesAdmin, saveGalleryImage, deleteGalleryImage } from "@/lib/db/service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const images = await getAllGalleryImagesAdmin();
  return NextResponse.json({ success: true, images });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title?.trim() || !body.image_url?.trim()) {
    return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
  }

  const saved = await saveGalleryImage(body);
  try {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/gallery");
  } catch (err) {
    console.warn("[REVALIDATE ERROR]", err);
  }
  return NextResponse.json({ success: true, image: saved });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing image ID" }, { status: 400 });
  }

  await deleteGalleryImage(id);
  try {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/gallery");
  } catch (err) {
    console.warn("[REVALIDATE ERROR]", err);
  }
  return NextResponse.json({ success: true });
}
