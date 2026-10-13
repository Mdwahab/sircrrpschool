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
    const emailResult = await sendAdmissionEnquiryNotification(enquiry);

    // 6. Return secure confirmation response (Do NOT return database internals or other submissions)
    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        studentName: enquiry.student_name,
        academicYear: enquiry.academic_year,
        emailNotified: emailResult.success,
        isSimulated: emailResult.simulated ?? false,
        message:
          "Admission enquiry successfully submitted. The admissions office has been notified and will contact you shortly.",
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
