import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/session";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  await clearAdminSession();
  return NextResponse.redirect(new URL("/admin/login", "http://localhost:3000"));
}
