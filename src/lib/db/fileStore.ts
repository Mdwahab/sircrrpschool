import fs from "fs";
import path from "path";
import {
  INITIAL_NOTICES,
  INITIAL_GALLERY_IMAGES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ENQUIRIES,
} from "./mockData";
import { Notice, GalleryImage, Achievement, AdmissionEnquiry } from "./types";
import { SCHOOL_INFO } from "@/config/schoolInfo";

interface SchoolDatabaseStore {
  notices: Notice[];
  gallery: GalleryImage[];
  achievements: Achievement[];
  enquiries: AdmissionEnquiry[];
  settings: Record<string, string>;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "school_store.json");

const DEFAULT_SETTINGS: Record<string, string> = {
  phoneOffice: SCHOOL_INFO.contact.phoneOffice,
  phoneAlternative: SCHOOL_INFO.contact.phoneAlternative,
  emailOfficial: SCHOOL_INFO.contact.emailOfficial,
  whatsAppEnquiryNumber: SCHOOL_INFO.contact.whatsAppEnquiryNumber,
  currentAcademicSession: SCHOOL_INFO.admissions.currentAcademicSession, // "2025–2026"
  campusAddress: SCHOOL_INFO.address.campus,
  pincode: SCHOOL_INFO.address.pincode,
  affiliationNumber: "130072",
  board: "CBSE (Central Board of Secondary Education), New Delhi",
  schoolLevel: "Senior Secondary Level (Class LKG to Class XII)",
  foundationYear: "1984 (Managing Committee Founded 1945)",
};

let memoryCache: SchoolDatabaseStore | null = null;
let lastMtimeMs = 0;

function ensureDataFile(): SchoolDatabaseStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const stats = fs.statSync(DATA_FILE);
      // If we have a cached version and file has not changed on disk, return cache
      if (memoryCache && stats.mtimeMs === lastMtimeMs) {
        return memoryCache;
      }

      // Read fresh file from disk
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content) as Partial<SchoolDatabaseStore>;
      memoryCache = {
        notices: Array.isArray(parsed.notices) ? parsed.notices : [...INITIAL_NOTICES],
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [...INITIAL_GALLERY_IMAGES],
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [...INITIAL_ACHIEVEMENTS],
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [...INITIAL_ENQUIRIES],
        settings: parsed.settings && typeof parsed.settings === "object" ? { ...DEFAULT_SETTINGS, ...parsed.settings } : { ...DEFAULT_SETTINGS },
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
      lastMtimeMs = stats.mtimeMs;
      return memoryCache;
    }
  } catch (err) {
    console.warn("[FILE STORE] Error reading store from disk, initializing from defaults:", err);
  }

  // Initialize new store if file didn't exist
  memoryCache = {
    notices: [...INITIAL_NOTICES],
    gallery: [...INITIAL_GALLERY_IMAGES],
    achievements: [...INITIAL_ACHIEVEMENTS],
    enquiries: [...INITIAL_ENQUIRIES],
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: new Date().toISOString(),
  };

  saveStoreSync(memoryCache);
  return memoryCache;
}

function saveStoreSync(store: SchoolDatabaseStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
    try {
      lastMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {
      lastMtimeMs = Date.now();
    }
  } catch (err) {
    console.error("[FILE STORE] Failed to write store to disk:", err);
  }
}

// Exported Store Accessors
export function getStore(): SchoolDatabaseStore {
  return ensureDataFile();
}

export function saveStore(store: SchoolDatabaseStore) {
  store.updatedAt = new Date().toISOString();
  saveStoreSync(store);
  memoryCache = store;
}
