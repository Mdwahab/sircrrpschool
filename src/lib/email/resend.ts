import { Resend } from "resend";
import { SCHOOL_INFO } from "@/config/schoolInfo";
import { AdmissionEnquiry } from "../db/types";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export async function sendAdmissionEnquiryNotification(
  enquiry: AdmissionEnquiry
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.SCHOOL_ENQUIRY_NOTIFICATION_EMAIL || SCHOOL_INFO.contact.emailOfficial;

  // In development without a live API key or with default placeholder, simulate safely and report clearly
  const isPlaceholderKey = !apiKey || apiKey === "re_your_api_key_here" || apiKey.includes("your_api_key");
  if (isPlaceholderKey) {
    console.info(
      `[DEV EMAIL SIMULATION] Admission enquiry recorded for ${enquiry.student_name} (${enquiry.grade_applying}). Intended recipient: ${toEmail}. Set a live RESEND_API_KEY in .env.local for production delivery.`
    );
    return {
      success: true,
      simulated: true,
      messageId: `sim-${Date.now()}`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const emailFrom = process.env.RESEND_FROM_EMAIL || "Sir C. R. Reddy Public School <onboarding@resend.dev>";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #2F4156; padding: 24px; }
            .card { background-color: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 2px solid #C8D9E6; overflow: hidden; box-shadow: 0 4px 12px rgba(47,65,86,0.08); }
            .header { background-color: #2F4156; color: #FFFFFF; padding: 20px 24px; border-bottom: 4px solid #567C8D; }
            .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; }
            .header p { margin: 4px 0 0 0; color: #C8D9E6; font-size: 13px; font-weight: 500; }
            .body { padding: 24px; }
            .field-row { margin-bottom: 14px; border-bottom: 1px solid #C8D9E6; padding-bottom: 10px; }
            .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #567C8D; font-weight: 700; }
            .field-val { font-size: 15px; color: #2F4156; font-weight: 600; margin-top: 3px; }
            .field-val a { color: #567C8D; text-decoration: none; font-weight: 700; }
            .message-box { background: #F5EEEB; border-left: 4px solid #567C8D; padding: 12px 16px; border-radius: 4px; font-style: italic; color: #2F4156; }
            .footer { background-color: #F5EEEB; border-top: 1px solid #C8D9E6; padding: 14px 24px; font-size: 12px; color: #2F4156; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>Sir C. R. Reddy Public School</h2>
              <p>New Admission Enquiry Notification | Session ${enquiry.academic_year}</p>
            </div>
            <div class="body">
              <div class="field-row">
                <div class="field-label">Student Name</div>
                <div class="field-val">${escapeHtml(enquiry.student_name)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Class / Grade of Interest</div>
                <div class="field-val">${escapeHtml(enquiry.grade_applying)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Parent / Guardian Name</div>
                <div class="field-val">${escapeHtml(enquiry.parent_name)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Contact Phone Number</div>
                <div class="field-val"><a href="tel:${escapeHtml(enquiry.phone)}">${escapeHtml(enquiry.phone)}</a></div>
              </div>
              ${enquiry.email ? `
              <div class="field-row">
                <div class="field-label">Parent Email</div>
                <div class="field-val"><a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a></div>
              </div>
              ` : ""}
              ${enquiry.message ? `
              <div class="field-row" style="border-bottom: none;">
                <div class="field-label">Parent Message / Note</div>
                <div class="message-box">${escapeHtml(enquiry.message)}</div>
              </div>
              ` : ""}
            </div>
            <div class="footer">
              Enquiry ID: ${enquiry.id} | Received on ${new Date(enquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST<br/>
              Log in to the Admin Portal to update the candidate status.
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: [toEmail],
      subject: `[Admission Enquiry] ${enquiry.student_name} (${enquiry.grade_applying}) - Session ${enquiry.academic_year}`,
      html: htmlContent,
    });

    if (error) {
      console.error("[RESEND ERROR]", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[EMAIL DISPATCH EXCEPTION]", err);
    return { success: false, error: message };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
