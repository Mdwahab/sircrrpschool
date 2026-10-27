import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getSchoolSettings, saveSchoolSettings, getDatabaseStatus } from "@/lib/db/service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [settings, dbStatus] = await Promise.all([
    getSchoolSettings(),
    getDatabaseStatus(),
  ]);

  return NextResponse.json({
    success: true,
    settings,
    databaseStatus: dbStatus,
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const updated = await saveSchoolSettings(body);
  try {
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/settings", "page");
  } catch (err) {
    console.warn("[REVALIDATE ERROR]", err);
  }
  return NextResponse.json({ success: true, settings: updated });
}
