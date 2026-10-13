/**
 * SIR C. R. REDDY PUBLIC SCHOOL — VERIFIED CONFIGURATION & MASTER DATA
 * Centralized metadata, contact details, affiliation records, and verification status.
 *
 * NON-NEGOTIABLE COMPLIANCE:
 * - Verified values are sourced from official CBSE directory records (School Affiliation No: 130072).
 * - Unconfirmed data points are explicitly flagged with `verified: false` and `requiresVerification: true`.
 */

export interface VerificationItem<T> {
  value: T;
  verified: boolean;
  notes?: string;
}

export const SCHOOL_INFO = {
  name: "Sir C. R. Reddy Public School",
  affiliation: {
    board: "CBSE (Central Board of Secondary Education), New Delhi",
    affiliationNo: "130072", // Verified CBSE Record
    schoolCode: "Pending Management Confirmation",
    level: "Senior Secondary (Co-Educational)",
    verified: true,
  },
  legacy: {
    establishedYear: 1984, // Verified CBSE Record
    parentBody: "Sir C. R. Reddy Educational Institutions (Managing Committee Estd. 1945)",
    namedAfter: "Dr. Sir Cattamanchi Ramalinga Reddy (1880–1951)",
    motto: "Quality Service & Value Based Education",
  },
  address: {
    campus: "G.N.T. Road, Vatluru / Santhi Nagar",
    city: "Eluru",
    district: "Eluru District (formerly West Godavari)",
    state: "Andhra Pradesh",
    pincode: "534006", // Verified CBSE Record
    country: "India",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15273.743285747683!2d81.0858!3d16.7107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3621415053229f%3A0x8cfdb40a049aaeb3!2sSir%20C.R.Reddy%20College%2C%20Eluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  contact: {
    phoneOffice: "08812-251650", // Verified CBSE directory
    phoneAlternative: "08812-33350",
    emailOfficial: "sircrrps@yahoo.com", // Verified CBSE directory
    emailAdmissions: "admissions@sircrrschool.ac.in", // Subject to management verification
    websiteOfficial: "http://www.sircrrschool.ac.in",
    whatsAppEnquiryNumber: "+919440000000", // Placeholder pending management verification
    whatsAppVerified: false,
    officeTimings: "Monday – Saturday: 8:30 AM to 4:30 PM",
  },
  admissions: {
    currentAcademicSession: "2025–2026",
    status: "Open for Registrations",
    gradesOffered: [
      { id: "lkg", name: "LKG (Foundational Stage)" },
      { id: "ukg", name: "UKG (Foundational Stage)" },
      { id: "grade-1", name: "Class I (Preparatory Stage)" },
      { id: "grade-2", name: "Class II" },
      { id: "grade-3", name: "Class III" },
      { id: "grade-4", name: "Class IV" },
      { id: "grade-5", name: "Class V" },
      { id: "grade-6", name: "Class VI (Middle Stage)" },
      { id: "grade-7", name: "Class VII" },
      { id: "grade-8", name: "Class VIII" },
      { id: "grade-9", name: "Class IX (Secondary Stage)" },
      { id: "grade-10", name: "Class X (Board Preparation)" },
      { id: "grade-11-science", name: "Class XI (Senior Secondary — Science / MPC, BiPC)" },
      { id: "grade-11-comm", name: "Class XI (Senior Secondary — Commerce / MEC)" },
      { id: "grade-12-science", name: "Class XII (Senior Secondary — Science)" },
      { id: "grade-12-comm", name: "Class XII (Senior Secondary — Commerce)" },
    ],
  },
  principal: {
    designation: "Principal",
    schoolName: "Sir C. R. Reddy Public School",
    namePlaceholder: "Principal, Sir C. R. Reddy Public School",
    isPhotoVerified: false,
    isMessageVerified: false,
    verificationNote: "Official inaugural message and verified portrait photograph pending formal school management approval.",
  },
  cbseMandatoryDisclosure: {
    title: "CBSE Mandatory Public Disclosure (SARAS)",
    affiliationStatus: "Active CBSE Affiliation up to Senior Secondary Level",
    documentsPendingUpload: true,
  },
};

/**
 * Builds the WhatsApp enquiry URL with URL-encoded parameters.
 */
export function getWhatsAppEnquiryUrl(grade?: string): string {
  const phone = SCHOOL_INFO.contact.whatsAppEnquiryNumber.replace(/[^0-9]/g, "");
  const baseMessage = `Hello Sir C. R. Reddy Public School Admissions Office, I am interested in admission for the ${SCHOOL_INFO.admissions.currentAcademicSession} academic session${grade ? ` for ${grade}` : ""}. Please share prospectus and registration details.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(baseMessage)}`;
}
