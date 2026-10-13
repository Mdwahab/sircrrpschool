import { createServerSupabaseClient, isSupabaseConfigured } from "../supabase/server";
import {
  INITIAL_NOTICES,
  INITIAL_GALLERY_IMAGES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ENQUIRIES,
} from "./mockData";
import { Notice, GalleryImage, Achievement, AdmissionEnquiry, EnquiryStatus } from "./types";

// In-memory runtime cache for development / fallback mode
let memoryNotices: Notice[] = [...INITIAL_NOTICES];
let memoryGallery: GalleryImage[] = [...INITIAL_GALLERY_IMAGES];
let memoryAchievements: Achievement[] = [...INITIAL_ACHIEVEMENTS];
const memoryEnquiries: AdmissionEnquiry[] = [...INITIAL_ENQUIRIES];

// --- NOTICES ---
export async function getPublishedNotices(): Promise<Notice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .eq("is_published", true)
          .order("publish_date", { ascending: false });

        if (!error && data) return data as Notice[];
      }
    } catch {
      // Fallback on error
    }
  }
  return memoryNotices
    .filter((n) => n.is_published)
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
}

export async function getAllNoticesAdmin(): Promise<Notice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) return data as Notice[];
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryNotices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function saveNotice(notice: Partial<Notice> & { title: string }): Promise<Notice> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        if (notice.id) {
          const { data, error } = await supabase
            .from("notices")
            .update({
              title: notice.title,
              category: notice.category,
              summary: notice.summary,
              content: notice.content,
              attachment_url: notice.attachment_url,
              attachment_name: notice.attachment_name,
              is_published: notice.is_published,
              publish_date: notice.publish_date || new Date().toISOString().split("T")[0],
            })
            .eq("id", notice.id)
            .select()
            .single();

          if (!error && data) return data as Notice;
        } else {
          const { data, error } = await supabase
            .from("notices")
            .insert({
              title: notice.title,
              category: notice.category || "General",
              summary: notice.summary || "",
              content: notice.content || "",
              attachment_url: notice.attachment_url || null,
              attachment_name: notice.attachment_name || null,
              is_published: notice.is_published ?? true,
              publish_date: notice.publish_date || new Date().toISOString().split("T")[0],
            })
            .select()
            .single();

          if (!error && data) return data as Notice;
        }
      }
    } catch {
      // Fallback to memory
    }
  }

  // Memory fallback
  if (notice.id) {
    const idx = memoryNotices.findIndex((n) => n.id === notice.id);
    if (idx !== -1) {
      memoryNotices[idx] = {
        ...memoryNotices[idx],
        ...notice,
      } as Notice;
      return memoryNotices[idx];
    }
  }

  const newNotice: Notice = {
    id: `not-${Date.now()}`,
    title: notice.title,
    category: notice.category || "General",
    summary: notice.summary || "",
    content: notice.content || "",
    attachment_url: notice.attachment_url || null,
    attachment_name: notice.attachment_name || null,
    is_published: notice.is_published ?? true,
    publish_date: notice.publish_date || new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  };
  memoryNotices.unshift(newNotice);
  return newNotice;
}

export async function deleteNotice(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("notices").delete().eq("id", id);
        if (!error) return true;
      }
    } catch {
      // Fallback
    }
  }
  memoryNotices = memoryNotices.filter((n) => n.id !== id);
  return true;
}

// --- GALLERY ---
export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        if (!error && data) return data as GalleryImage[];
      }
    } catch {
      // Fallback
    }
  }
  return memoryGallery
    .filter((g) => g.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllGalleryImagesAdmin(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) return data as GalleryImage[];
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryGallery];
}

export async function saveGalleryImage(img: Partial<GalleryImage> & { title: string; image_url: string }): Promise<GalleryImage> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        if (img.id) {
          const { data, error } = await supabase
            .from("gallery_images")
            .update({
              title: img.title,
              category: img.category,
              image_url: img.image_url,
              alt_text: img.alt_text,
              caption: img.caption,
              is_published: img.is_published,
              sort_order: img.sort_order,
            })
            .eq("id", img.id)
            .select()
            .single();

          if (!error && data) return data as GalleryImage;
        } else {
          const { data, error } = await supabase
            .from("gallery_images")
            .insert({
              title: img.title,
              category: img.category || "Campus",
              image_url: img.image_url,
              alt_text: img.alt_text || img.title,
              caption: img.caption || "",
              is_published: img.is_published ?? true,
              sort_order: img.sort_order || 10,
            })
            .select()
            .single();

          if (!error && data) return data as GalleryImage;
        }
      }
    } catch {
      // Fallback
    }
  }

  if (img.id) {
    const idx = memoryGallery.findIndex((g) => g.id === img.id);
    if (idx !== -1) {
      memoryGallery[idx] = { ...memoryGallery[idx], ...img } as GalleryImage;
      return memoryGallery[idx];
    }
  }

  const newImg: GalleryImage = {
    id: `gal-${Date.now()}`,
    title: img.title,
    category: img.category || "Campus",
    image_url: img.image_url,
    alt_text: img.alt_text || img.title,
    caption: img.caption || "",
    is_published: img.is_published ?? true,
    sort_order: img.sort_order || memoryGallery.length + 1,
    is_development_placeholder: false,
    created_at: new Date().toISOString(),
  };
  memoryGallery.unshift(newImg);
  return newImg;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("gallery_images").delete().eq("id", id);
        if (!error) return true;
      }
    } catch {
      // Fallback
    }
  }
  memoryGallery = memoryGallery.filter((g) => g.id !== id);
  return true;
}

// --- ACHIEVEMENTS ---
export async function getPublishedAchievements(): Promise<Achievement[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (!error && data) return data as Achievement[];
      }
    } catch {
      // Fallback
    }
  }
  return memoryAchievements.filter((a) => a.is_published);
}

export async function getAllAchievementsAdmin(): Promise<Achievement[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) return data as Achievement[];
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryAchievements];
}

export async function saveAchievement(item: Partial<Achievement> & { title: string; academic_year: string }): Promise<Achievement> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        if (item.id) {
          const { data, error } = await supabase
            .from("achievements")
            .update({
              academic_year: item.academic_year,
              title: item.title,
              category: item.category,
              description: item.description,
              student_name: item.student_name,
              document_url: item.document_url,
              is_published: item.is_published,
              is_verified_record: item.is_verified_record,
            })
            .eq("id", item.id)
            .select()
            .single();

          if (!error && data) return data as Achievement;
        } else {
          const { data, error } = await supabase
            .from("achievements")
            .insert({
              academic_year: item.academic_year,
              title: item.title,
              category: item.category || "CBSE Board Examination",
              description: item.description || "",
              student_name: item.student_name || null,
              document_url: item.document_url || null,
              is_published: item.is_published ?? true,
              is_verified_record: item.is_verified_record ?? true,
            })
            .select()
            .single();

          if (!error && data) return data as Achievement;
        }
      }
    } catch {
      // Fallback
    }
  }

  if (item.id) {
    const idx = memoryAchievements.findIndex((a) => a.id === item.id);
    if (idx !== -1) {
      memoryAchievements[idx] = { ...memoryAchievements[idx], ...item } as Achievement;
      return memoryAchievements[idx];
    }
  }

  const newAch: Achievement = {
    id: `ach-${Date.now()}`,
    academic_year: item.academic_year,
    title: item.title,
    category: item.category || "CBSE Board Examination",
    description: item.description || "",
    student_name: item.student_name,
    document_url: item.document_url || null,
    is_published: item.is_published ?? true,
    is_verified_record: item.is_verified_record ?? true,
    created_at: new Date().toISOString(),
  };
  memoryAchievements.unshift(newAch);
  return newAch;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("achievements").delete().eq("id", id);
        if (!error) return true;
      }
    } catch {
      // Fallback
    }
  }
  memoryAchievements = memoryAchievements.filter((a) => a.id !== id);
  return true;
}

// --- ADMISSION ENQUIRIES ---
export async function getEnquiriesAdmin(): Promise<AdmissionEnquiry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("admission_enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) return data as AdmissionEnquiry[];
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryEnquiries];
}

export async function submitAdmissionEnquiry(enquiry: Omit<AdmissionEnquiry, "id" | "status" | "created_at">): Promise<AdmissionEnquiry> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("admission_enquiries")
          .insert({
            parent_name: enquiry.parent_name,
            student_name: enquiry.student_name,
            phone: enquiry.phone,
            email: enquiry.email || null,
            grade_applying: enquiry.grade_applying,
            academic_year: enquiry.academic_year,
            message: enquiry.message || null,
            status: "new",
          })
          .select()
          .single();

        if (!error && data) return data as AdmissionEnquiry;
      }
    } catch {
      // Fallback
    }
  }

  const newEnq: AdmissionEnquiry = {
    id: `enq-${Date.now()}`,
    ...enquiry,
    status: "new",
    notes: null,
    created_at: new Date().toISOString(),
  };
  memoryEnquiries.unshift(newEnq);
  return newEnq;
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Promise<AdmissionEnquiry | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("admission_enquiries")
          .update({
            status,
            notes: notes !== undefined ? notes : undefined,
          })
          .eq("id", id)
          .select()
          .single();

        if (!error && data) return data as AdmissionEnquiry;
      }
    } catch {
      // Fallback
    }
  }

  const item = memoryEnquiries.find((e) => e.id === id);
  if (item) {
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    return item;
  }
  return null;
}
