export type EnquiryStatus = "new" | "contacted" | "enrolled" | "closed";

export interface Notice {
  id: string;
  title: string;
  category: "Academic" | "Examination" | "Circular" | "Event" | "General";
  summary: string;
  content?: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
  is_published: boolean;
  publish_date: string;
  archived_at?: string | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: "Campus" | "Laboratories" | "Academics" | "Sports" | "Events";
  image_url: string;
  alt_text: string;
  caption: string;
  is_published: boolean;
  sort_order: number;
  is_development_placeholder?: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  academic_year: string;
  title: string;
  category: "CBSE Board Examination" | "Olympiad & Academics" | "Sports & Athletics" | "Co-Curricular";
  description: string;
  student_name?: string | null;
  document_url?: string | null;
  is_published: boolean;
  is_verified_record: boolean;
  created_at: string;
}

export interface AdmissionEnquiry {
  id: string;
  parent_name: string;
  student_name: string;
  phone: string;
  email?: string | null;
  grade_applying: string;
  academic_year: string;
  message?: string | null;
  status: EnquiryStatus;
  notes?: string | null;
  created_at: string;
}

export interface SchoolSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin";
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity: string;
  entity_id?: string;
  timestamp: string;
}
