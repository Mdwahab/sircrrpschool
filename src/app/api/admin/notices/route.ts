import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getAllNoticesAdmin, saveNotice, deleteNotice } from "@/lib/db/service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notices = await getAllNoticesAdmin();
  return NextResponse.json({ success: true, notices });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Notice title is required" }, { status: 400 });
  }

  const saved = await saveNotice(body);
  return NextResponse.json({ success: true, notice: saved });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing notice ID" }, { status: 400 });
  }

  await deleteNotice(id);
  return NextResponse.json({ success: true });
}
