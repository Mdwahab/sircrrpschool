import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/validation/enquiry";
import { getEnquiryById } from "@/lib/db/service";
import { sendAdmissionEnquiryNotification } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    if (!checkRateLimit(`retry_${ip}`)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many retry attempts. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { enquiryId } = body;

    if (!enquiryId || typeof enquiryId !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid Enquiry Reference ID is required." },
        { status: 400 }
      );
    }

    const enquiry = await getEnquiryById(enquiryId);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: "Enquiry record not found." },
        { status: 404 }
      );
    }

    const emailResult = await sendAdmissionEnquiryNotification(enquiry);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || "Failed to deliver email notification.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification email dispatched successfully.",
      isSimulated: emailResult.simulated ?? false,
    });
  } catch (err: unknown) {
    console.error("[RETRY EMAIL API ERROR]", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during retry." },
      { status: 500 }
    );
  }
}
