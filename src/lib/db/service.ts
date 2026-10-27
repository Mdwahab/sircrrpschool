import { createServerSupabaseClient, isSupabaseConfigured, getSupabaseIntegrationStatus } from "../supabase/server";
import { createAdminSupabaseClient } from "../supabase/admin";
import { getStore, saveStore } from "./fileStore";
import { Notice, GalleryImage, Achievement, AdmissionEnquiry, EnquiryStatus } from "./types";

// Timeout helper for Supabase queries to guarantee they never block
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error("Supabase query timeout")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutHandle);
  });
}

// --- DATABASE STATUS ---
export async function getDatabaseStatus() {
  const status = await getSupabaseIntegrationStatus();
  return {
    ...status,
    storeType: status.isReachable ? "Supabase PostgreSQL Cloud" : "Persistent Local Storage (.data/school_store.json)",
  };
}

// --- NOTICES ---
export async function getPublishedNotices(): Promise<Notice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createServerSupabaseClient()) || (await createAdminSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("notices")
          .select("*")
          .eq("is_published", true)
          .order("publish_date", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: Notice[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as Notice[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getPublishedNotices fallback:", err);
    }
  }

  const store = getStore();
  return store.notices
    .filter((n) => n.is_published)
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
}

export async function getAllNoticesAdmin(): Promise<Notice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: Notice[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as Notice[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getAllNoticesAdmin fallback:", err);
    }
  }

  const store = getStore();
  return [...store.notices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function saveNotice(notice: Partial<Notice> & { title: string }): Promise<Notice> {
  const store = getStore();
  const timestamp = new Date().toISOString();
  const publishDate = notice.publish_date || timestamp.split("T")[0];

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        if (notice.id) {
          const query = supabase
            .from("notices")
            .update({
              title: notice.title,
              category: notice.category,
              summary: notice.summary,
              content: notice.content,
              attachment_url: notice.attachment_url,
              attachment_name: notice.attachment_name,
              is_published: notice.is_published,
              publish_date: publishDate,
              updated_at: timestamp,
            })
            .eq("id", notice.id)
            .select()
            .single();

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: Notice | null; error: unknown }>);
          if (!error && data) {
            // Sync to local store
            const idx = store.notices.findIndex((n) => n.id === notice.id);
            if (idx !== -1) store.notices[idx] = data as Notice;
            else store.notices.unshift(data as Notice);
            saveStore(store);
            return data as Notice;
          }
        } else {
          const query = supabase
            .from("notices")
            .insert({
              title: notice.title,
              category: notice.category || "General",
              summary: notice.summary || "",
              content: notice.content || "",
              attachment_url: notice.attachment_url || null,
              attachment_name: notice.attachment_name || null,
              is_published: notice.is_published ?? true,
              publish_date: publishDate,
            })
            .select()
            .single();

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: Notice | null; error: unknown }>);
          if (!error && data) {
            store.notices.unshift(data as Notice);
            saveStore(store);
            return data as Notice;
          }
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase saveNotice fallback:", err);
    }
  }

  // Persistent Local Store
  if (notice.id) {
    const idx = store.notices.findIndex((n) => n.id === notice.id);
    if (idx !== -1) {
      store.notices[idx] = {
        ...store.notices[idx],
        ...notice,
        updated_at: timestamp,
      } as Notice;
      saveStore(store);
      return store.notices[idx];
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
    publish_date: publishDate,
    created_at: timestamp,
  };
  store.notices.unshift(newNotice);
  saveStore(store);
  return newNotice;
}

export async function deleteNotice(id: string): Promise<boolean> {
  const store = getStore();

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase.from("notices").delete().eq("id", id);
        await withTimeout(query as unknown as Promise<{ error: unknown }>);
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase deleteNotice fallback:", err);
    }
  }

  store.notices = store.notices.filter((n) => n.id !== id);
  saveStore(store);
  return true;
}

// --- GALLERY ---
export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createServerSupabaseClient()) || (await createAdminSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("gallery_images")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: GalleryImage[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as GalleryImage[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getPublishedGalleryImages fallback:", err);
    }
  }

  const store = getStore();
  return store.gallery
    .filter((g) => g.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllGalleryImagesAdmin(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: GalleryImage[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as GalleryImage[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getAllGalleryImagesAdmin fallback:", err);
    }
  }

  const store = getStore();
  return [...store.gallery];
}

export async function saveGalleryImage(
  img: Partial<GalleryImage> & { title: string; image_url: string }
): Promise<GalleryImage> {
  const store = getStore();
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        if (img.id) {
          const query = supabase
            .from("gallery_images")
            .update({
              title: img.title,
              category: img.category,
              image_url: img.image_url,
              alt_text: img.alt_text,
              caption: img.caption,
              is_published: img.is_published,
              sort_order: img.sort_order,
              updated_at: timestamp,
            })
            .eq("id", img.id)
            .select()
            .single();

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: GalleryImage | null; error: unknown }>);
          if (!error && data) {
            const idx = store.gallery.findIndex((g) => g.id === img.id);
            if (idx !== -1) store.gallery[idx] = data as GalleryImage;
            else store.gallery.unshift(data as GalleryImage);
            saveStore(store);
            return data as GalleryImage;
          }
        } else {
          const query = supabase
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

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: GalleryImage | null; error: unknown }>);
          if (!error && data) {
            store.gallery.unshift(data as GalleryImage);
            saveStore(store);
            return data as GalleryImage;
          }
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase saveGalleryImage fallback:", err);
    }
  }

  if (img.id) {
    const idx = store.gallery.findIndex((g) => g.id === img.id);
    if (idx !== -1) {
      store.gallery[idx] = {
        ...store.gallery[idx],
        ...img,
        updated_at: timestamp,
      } as GalleryImage;
      saveStore(store);
      return store.gallery[idx];
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
    sort_order: img.sort_order || store.gallery.length + 1,
    is_development_placeholder: false,
    created_at: timestamp,
  };
  store.gallery.unshift(newImg);
  saveStore(store);
  return newImg;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const store = getStore();

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase.from("gallery_images").delete().eq("id", id);
        await withTimeout(query as unknown as Promise<{ error: unknown }>);
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase deleteGalleryImage fallback:", err);
    }
  }

  store.gallery = store.gallery.filter((g) => g.id !== id);
  saveStore(store);
  return true;
}

// --- ACHIEVEMENTS & BOARD RESULTS ---
export async function getPublishedAchievements(): Promise<Achievement[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createServerSupabaseClient()) || (await createAdminSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("achievements")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: Achievement[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as Achievement[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getPublishedAchievements fallback:", err);
    }
  }

  const store = getStore();
  return store.achievements.filter((a) => a.is_published);
}

export async function getAllAchievementsAdmin(): Promise<Achievement[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase
          .from("achievements")
          .select("*")
          .order("created_at", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: Achievement[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as Achievement[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getAllAchievementsAdmin fallback:", err);
    }
  }

  const store = getStore();
  return [...store.achievements];
}

export async function saveAchievement(
  item: Partial<Achievement> & { title: string; academic_year: string }
): Promise<Achievement> {
  const store = getStore();
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        if (item.id) {
          const query = supabase
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
              updated_at: timestamp,
            })
            .eq("id", item.id)
            .select()
            .single();

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: Achievement | null; error: unknown }>);
          if (!error && data) {
            const idx = store.achievements.findIndex((a) => a.id === item.id);
            if (idx !== -1) store.achievements[idx] = data as Achievement;
            else store.achievements.unshift(data as Achievement);
            saveStore(store);
            return data as Achievement;
          }
        } else {
          const query = supabase
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

          const { data, error } = await withTimeout(query as unknown as Promise<{ data: Achievement | null; error: unknown }>);
          if (!error && data) {
            store.achievements.unshift(data as Achievement);
            saveStore(store);
            return data as Achievement;
          }
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase saveAchievement fallback:", err);
    }
  }

  if (item.id) {
    const idx = store.achievements.findIndex((a) => a.id === item.id);
    if (idx !== -1) {
      store.achievements[idx] = {
        ...store.achievements[idx],
        ...item,
        updated_at: timestamp,
      } as Achievement;
      saveStore(store);
      return store.achievements[idx];
    }
  }

  const newAch: Achievement = {
    id: `ach-${Date.now()}`,
    academic_year: item.academic_year,
    title: item.title,
    category: item.category || "CBSE Board Examination",
    description: item.description || "",
    student_name: item.student_name || null,
    document_url: item.document_url || null,
    is_published: item.is_published ?? true,
    is_verified_record: item.is_verified_record ?? true,
    created_at: timestamp,
  };
  store.achievements.unshift(newAch);
  saveStore(store);
  return newAch;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const store = getStore();

  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createAdminSupabaseClient()) || (await createServerSupabaseClient());
      if (supabase) {
        const query = supabase.from("achievements").delete().eq("id", id);
        await withTimeout(query as unknown as Promise<{ error: unknown }>);
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase deleteAchievement fallback:", err);
    }
  }

  store.achievements = store.achievements.filter((a) => a.id !== id);
  saveStore(store);
  return true;
}

// --- ADMISSION ENQUIRIES ---
export async function getEnquiriesAdmin(): Promise<AdmissionEnquiry[]> {
  try {
    const adminSupabase = await createAdminSupabaseClient();
    if (adminSupabase) {
      const query = adminSupabase
        .from("admission_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await withTimeout(query as unknown as Promise<{ data: AdmissionEnquiry[] | null; error: unknown }>);
      if (!error && data && Array.isArray(data)) {
        return data as AdmissionEnquiry[];
      }
    }
  } catch (err) {
    console.warn("[DB SERVICE] Admin client fetch failed, checking server client:", err);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const query = supabase
          .from("admission_enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        const { data, error } = await withTimeout(query as unknown as Promise<{ data: AdmissionEnquiry[] | null; error: unknown }>);
        if (!error && data && Array.isArray(data)) {
          return data as AdmissionEnquiry[];
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase server client fetch failed:", err);
    }
  }

  const store = getStore();
  return [...store.enquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getEnquiryById(id: string): Promise<AdmissionEnquiry | null> {
  try {
    const adminSupabase = await createAdminSupabaseClient();
    if (adminSupabase) {
      const query = adminSupabase
        .from("admission_enquiries")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      const { data, error } = await withTimeout(query as unknown as Promise<{ data: AdmissionEnquiry | null; error: unknown }>);
      if (!error && data) {
        return data as AdmissionEnquiry;
      }
    }
  } catch (err) {
    console.warn("[DB SERVICE] getEnquiryById admin fetch error:", err);
  }

  const store = getStore();
  const match = store.enquiries.find((e) => e.id === id);
  return match || null;
}

export async function submitAdmissionEnquiry(
  enquiry: Omit<AdmissionEnquiry, "id" | "status" | "created_at">
): Promise<AdmissionEnquiry & { isPersistedInSupabase: boolean }> {
  const generatedId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const store = getStore();

  // 1. Try Admin Supabase Client
  try {
    const adminSupabase = await createAdminSupabaseClient();
    if (adminSupabase) {
      const query = adminSupabase
        .from("admission_enquiries")
        .insert({
          id: generatedId,
          parent_name: enquiry.parent_name,
          student_name: enquiry.student_name,
          phone: enquiry.phone,
          email: enquiry.email || null,
          grade_applying: enquiry.grade_applying,
          academic_year: enquiry.academic_year,
          message: enquiry.message || null,
          status: "new",
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select()
        .single();

      const { data, error } = await withTimeout(query as unknown as Promise<{ data: AdmissionEnquiry | null; error: { message?: string } | null }>);

      if (!error && data) {
        const result = { ...(data as AdmissionEnquiry), isPersistedInSupabase: true };
        store.enquiries.unshift(result);
        saveStore(store);
        return result;
      } else if (error) {
        console.warn("[DB SERVICE] Supabase Admin insert error:", error.message);
      }
    }
  } catch (err) {
    console.warn("[DB SERVICE] Supabase Admin client exception:", err);
  }

  // 2. Try Standard Server Client
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const query = supabase
          .from("admission_enquiries")
          .insert({
            id: generatedId,
            parent_name: enquiry.parent_name,
            student_name: enquiry.student_name,
            phone: enquiry.phone,
            email: enquiry.email || null,
            grade_applying: enquiry.grade_applying,
            academic_year: enquiry.academic_year,
            message: enquiry.message || null,
            status: "new",
            created_at: timestamp,
            updated_at: timestamp,
          });

        const { error } = await withTimeout(query as unknown as Promise<{ error: { message?: string } | null }>);

        if (!error) {
          const result: AdmissionEnquiry & { isPersistedInSupabase: boolean } = {
            id: generatedId,
            ...enquiry,
            status: "new",
            notes: null,
            created_at: timestamp,
            isPersistedInSupabase: true,
          };
          store.enquiries.unshift(result);
          saveStore(store);
          return result;
        } else {
          console.warn("[DB SERVICE] Supabase Server client insert error:", error.message);
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase Server client exception:", err);
    }
  }

  // 3. Resilient Local File Store (NEVER lose an enquiry)
  const fallbackEnq: AdmissionEnquiry & { isPersistedInSupabase: boolean } = {
    id: `enq-${Date.now()}`,
    ...enquiry,
    status: "new",
    notes: null,
    created_at: timestamp,
    isPersistedInSupabase: false,
  };
  store.enquiries.unshift(fallbackEnq);
  saveStore(store);
  console.info(`[DB SERVICE] Enquiry saved to resilient store (ID: ${fallbackEnq.id})`);
  return fallbackEnq;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  notes?: string
): Promise<AdmissionEnquiry | null> {
  const store = getStore();
  const timestamp = new Date().toISOString();

  try {
    const adminSupabase = await createAdminSupabaseClient();
    if (adminSupabase) {
      const query = adminSupabase
        .from("admission_enquiries")
        .update({
          status,
          notes: notes !== undefined ? notes : undefined,
          updated_at: timestamp,
        })
        .eq("id", id)
        .select()
        .single();

      const { data, error } = await withTimeout(query as unknown as Promise<{ data: AdmissionEnquiry | null; error: unknown }>);
      if (!error && data) {
        const item = store.enquiries.find((e) => e.id === id);
        if (item) {
          item.status = status;
          if (notes !== undefined) item.notes = notes;
          saveStore(store);
        }
        return data as AdmissionEnquiry;
      }
    }
  } catch (err) {
    console.warn("[DB SERVICE] Update status via admin client failed:", err);
  }

  const item = store.enquiries.find((e) => e.id === id);
  if (item) {
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    saveStore(store);
    return item;
  }
  return null;
}

// --- INSTITUTIONAL SETTINGS ---
export async function getSchoolSettings(): Promise<Record<string, string>> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = (await createServerSupabaseClient()) || (await createAdminSupabaseClient());
      if (supabase) {
        const query = supabase.from("school_settings").select("*");
        const { data, error } = await withTimeout(query as unknown as Promise<{ data: Array<{ key: string; value: string | Record<string, unknown> }> | null; error: unknown }>);
        if (!error && data && Array.isArray(data) && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach((row) => {
            let val = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
            if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
              try {
                const parsed = JSON.parse(val);
                if (typeof parsed === "string") val = parsed;
              } catch {
                val = val.slice(1, -1);
              }
            }
            map[row.key] = val;
          });
          const store = getStore();
          store.settings = { ...store.settings, ...map };
          saveStore(store);
          return store.settings;
        }
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase getSchoolSettings fallback:", err);
    }
  }

  const store = getStore();
  const cleanedSettings: Record<string, string> = {};
  for (const [k, v] of Object.entries(store.settings || {})) {
    let cleanV = v;
    if (typeof cleanV === "string" && cleanV.startsWith('"') && cleanV.endsWith('"') && cleanV.length >= 2) {
      try {
        const parsed = JSON.parse(cleanV);
        if (typeof parsed === "string") cleanV = parsed;
      } catch {
        cleanV = cleanV.slice(1, -1);
      }
    }
    cleanedSettings[k] = cleanV;
  }
  return cleanedSettings;
}

export async function saveSchoolSettings(updates: Record<string, string>): Promise<Record<string, string>> {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...updates,
  };
  saveStore(store);

  if (isSupabaseConfigured()) {
    try {
      const adminSupabase = await createAdminSupabaseClient();
      if (adminSupabase) {
        const rows = Object.entries(updates).map(([key, value]) => ({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString(),
        }));
        const query = adminSupabase.from("school_settings").upsert(rows);
        await withTimeout(query as unknown as Promise<{ error: unknown }>);
      }
    } catch (err) {
      console.warn("[DB SERVICE] Supabase saveSchoolSettings fallback:", err);
    }
  }

  return { ...store.settings };
}
