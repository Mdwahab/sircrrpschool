import { SCHOOL_INFO } from "@/config/schoolInfo";

export interface EnquiryFormData {
  parent_name: string;
  student_name: string;
  phone: string;
  email?: string;
  grade_applying: string;
  academic_year: string;
  message?: string;
  consent: boolean;
  honeypot?: string; // Hidden anti-bot spam field
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: EnquiryFormData;
}

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 submissions per minute per IP

export function checkRateLimit(clientIdentifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIdentifier) || [];

  // Filter timestamps within the current sliding window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recent.push(now);
  rateLimitMap.set(clientIdentifier, recent);
  return true;
}

export function sanitizeInput(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip control characters
    .trim();
}

export function validateEnquiryForm(data: Partial<EnquiryFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Honeypot check
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.honeypot = "Spam detection triggered.";
    return { isValid: false, errors };
  }

  // 2. Parent Name (sanitized, 2-80 characters)
  const parentName = sanitizeInput(data.parent_name || "");
  if (!parentName) {
    errors.parent_name = "Parent or guardian name is required.";
  } else if (parentName.length < 2 || parentName.length > 80) {
    errors.parent_name = "Parent name must be between 2 and 80 characters.";
  }

  // 3. Student Name (sanitized, 2-80 characters)
  const studentName = sanitizeInput(data.student_name || "");
  if (!studentName) {
    errors.student_name = "Student name is required.";
  } else if (studentName.length < 2 || studentName.length > 80) {
    errors.student_name = "Student name must be between 2 and 80 characters.";
  }

  // 4. Phone Number (Indian mobile format: 10 digits starting with 6, 7, 8, or 9)
  const phoneClean = (data.phone || "").replace(/[^0-9]/g, "");
  // Allow leading 91 or 0
  const normalizedPhone =
    phoneClean.length === 12 && phoneClean.startsWith("91")
      ? phoneClean.slice(2)
      : phoneClean.length === 11 && phoneClean.startsWith("0")
      ? phoneClean.slice(1)
      : phoneClean;

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!normalizedPhone) {
    errors.phone = "Primary contact mobile number is required.";
  } else if (!phoneRegex.test(normalizedPhone)) {
    errors.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9848012345).";
  }

  // 5. Email (Optional, validated and capped at 100 characters)
  const emailRaw = sanitizeInput(data.email || "");
  let email: string | undefined = undefined;
  if (emailRaw) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailRaw)) {
      errors.email = "Please enter a valid email address.";
    } else if (emailRaw.length > 100) {
      errors.email = "Email must not exceed 100 characters.";
    } else {
      email = emailRaw.toLowerCase();
    }
  }

  // 6. Grade of Interest
  const grade = sanitizeInput(data.grade_applying || "");
  if (!grade) {
    errors.grade_applying = "Please select the class or grade of interest.";
  }

  // 7. Academic Year
  const academicYear = sanitizeInput(data.academic_year || "") || SCHOOL_INFO.admissions.currentAcademicSession;

  // 8. Message / Note (Optional, sanitized, capped at 1000 characters)
  const messageRaw = sanitizeInput(data.message || "");
  const message = messageRaw.length > 1000 ? messageRaw.slice(0, 1000) : messageRaw;

  // 9. Consent
  if (!data.consent) {
    errors.consent = "You must agree to the privacy policy and consent to school communication.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitizedData: isValid
      ? {
          parent_name: parentName,
          student_name: studentName,
          phone: normalizedPhone,
          email: email || undefined,
          grade_applying: grade,
          academic_year: academicYear,
          message: message || undefined,
          consent: true,
        }
      : undefined,
  };
}
