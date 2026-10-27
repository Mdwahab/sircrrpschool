import { NextRequest, NextResponse } from "next/server";
import { validateEnquiryForm, checkRateLimit } from "@/lib/validation/enquiry";
import { submitAdmissionEnquiry } from "@/lib/db/service";
import { sendAdmissionEnquiryNotification } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    // 1. IP rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please wait a minute before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse body
    const body = await req.json();

    // 3. Validate
    const validation = validateEnquiryForm(body);
    if (!validation.isValid || !validation.sanitizedData) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
          error: "Please correct the highlighted errors in the form.",
        },
        { status: 400 }
      );
    }

    const { sanitizedData } = validation;

    // 4. Save to database / persistent store
    const enquiry = await submitAdmissionEnquiry({
      parent_name: sanitizedData.parent_name,
      student_name: sanitizedData.student_name,
      phone: sanitizedData.phone,
      email: sanitizedData.email,
      grade_applying: sanitizedData.grade_applying,
      academic_year: sanitizedData.academic_year,
      message: sanitizedData.message,
    });

    // 5. Send notification email to school admissions desk
    let emailResult: { success: boolean; simulated?: boolean; error?: string } = {
      success: false,
      simulated: false,
      error: undefined,
    };
    try {
      emailResult = await sendAdmissionEnquiryNotification(enquiry);
    } catch (emailErr) {
      console.error("[ENQUIRY API] Email dispatch exception:", emailErr);
      emailResult = {
        success: false,
        simulated: false,
        error: emailErr instanceof Error ? emailErr.message : "Notification dispatch failed",
      };
    }

    const emailStatus = emailResult.simulated
      ? "simulated"
      : emailResult.success
      ? "sent"
      : "failed";

    // 6. Return secure confirmation response (Do NOT return database secrets or internals)
    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        studentName: enquiry.student_name,
        gradeApplying: enquiry.grade_applying,
        academicYear: enquiry.academic_year,
        isPersistedInSupabase: enquiry.isPersistedInSupabase,
        emailStatus,
        emailError: emailResult.error,
        message:
          "Admission enquiry successfully recorded in school admissions records.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[ENQUIRY API ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your admission enquiry. Please call the school office directly.",
      },
      { status: 500 }
    );
  }
}
