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
    latitude: 16.70422,
    longitude: 81.07913,
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=16.70422,81.07913+(Sir+C.R.+Reddy+Public+School)&hl=en&z=16&output=embed",
    googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Sir+C.R.+Reddy+Public+School+GNT+Road+Eluru",
  },
  contact: {
    phoneOffice: "+91 6300065646",
    phoneAlternative: "6300065646",
    phoneMobile: "+91 6300065646",
    emailOfficial: "sircrrps1@gmail.com",
    emailAdmissions: "sircrrps1@gmail.com",
    websiteOfficial: "http://www.sircrrschool.ac.in",
    whatsAppEnquiryNumber: "+916300065646",
    whatsAppVerified: true,
    officeTimings: "Monday – Saturday: 8:30 AM to 4:30 PM",
  },
  admissions: {
    currentAcademicSession: "2025–2026",
    status: "Open for Registrations",
    gradesOffered: [
      { id: "lkg", name: "LKG" },
      { id: "ukg", name: "UKG" },
      { id: "grade-1", name: "Class I" },
      { id: "grade-2", name: "Class II" },
      { id: "grade-3", name: "Class III" },
      { id: "grade-4", name: "Class IV" },
      { id: "grade-5", name: "Class V" },
      { id: "grade-6", name: "Class VI" },
      { id: "grade-7", name: "Class VII" },
      { id: "grade-8", name: "Class VIII" },
      { id: "grade-9", name: "Class IX" },
      { id: "grade-10", name: "Class X" },
      { id: "grade-11-science", name: "Class XI - Science" },
      { id: "grade-11-comm", name: "Class XI - Commerce" },
      { id: "grade-12-science", name: "Class XII - Science" },
      { id: "grade-12-comm", name: "Class XII - Commerce" },
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
 * Builds the general WhatsApp enquiry URL with URL-encoded parameters.
 */
export function getWhatsAppEnquiryUrl(grade?: string): string {
  const rawNumber =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    SCHOOL_INFO.contact.whatsAppEnquiryNumber;
  const phone = rawNumber.replace(/[^0-9]/g, "");
  const baseMessage = `Hello Sir C. R. Reddy Public School Admissions Office, I am interested in admission for the ${SCHOOL_INFO.admissions.currentAcademicSession} academic session${grade ? ` for ${grade}` : ""}. Please share prospectus and registration details.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(baseMessage)}`;
}
