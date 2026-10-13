import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getEnquiriesAdmin, updateEnquiryStatus } from "@/lib/db/service";
import { EnquiryStatus } from "@/lib/db/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const enquiries = await getEnquiriesAdmin();
  return NextResponse.json({ success: true, enquiries });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, notes } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing enquiry ID or status" }, { status: 400 });
  }

  const updated = await updateEnquiryStatus(id, status as EnquiryStatus, notes);
  if (!updated) {
    return NextResponse.json({ error: "Enquiry record not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, enquiry: updated });
}
