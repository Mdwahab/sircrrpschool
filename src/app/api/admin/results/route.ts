import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getAllAchievementsAdmin, saveAchievement, deleteAchievement } from "@/lib/db/service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const achievements = await getAllAchievementsAdmin();
  return NextResponse.json({ success: true, achievements });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title?.trim() || !body.academic_year?.trim()) {
    return NextResponse.json({ error: "Title and Academic Year are required" }, { status: 400 });
  }

  const saved = await saveAchievement(body);
  try {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/results");
  } catch (err) {
    console.warn("[REVALIDATE ERROR]", err);
  }
  return NextResponse.json({ success: true, achievement: saved });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing achievement ID" }, { status: 400 });
  }

  await deleteAchievement(id);
  try {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/results");
  } catch (err) {
    console.warn("[REVALIDATE ERROR]", err);
  }
  return NextResponse.json({ success: true });
}
