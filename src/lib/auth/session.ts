import { cookies } from "next/headers";
import { createServerSupabaseClient, isSupabaseConfigured } from "../supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
  isDevBypass?: boolean;
}

const DEV_ADMIN_COOKIE = "sircrr_dev_admin_session";

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

  // 1. Dev mode fallback check (fast-path for development review)
  const devSession = cookieStore.get(DEV_ADMIN_COOKIE);
  if (devSession && devSession.value) {
    try {
      if (devSession.value === "authenticated") {
        return {
          id: "admin-dev-001",
          email: "admin@sircrrschool.ac.in",
          role: "admin",
          isDevBypass: true,
        };
      }
      const parsed = JSON.parse(devSession.value);
      if (parsed && parsed.email) {
        return {
          id: parsed.id || "admin-dev-001",
          email: parsed.email,
          role: "admin",
          isDevBypass: true,
        };
      }
    } catch {
      // Ignore parse error
    }
  }

  // 2. If Supabase is configured, check real Supabase Auth
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!error && user && user.email) {
          return {
            id: user.id,
            email: user.email,
            role: "admin",
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  return null;
}

export async function setDevAdminSession(user: { id: string; email: string } = { id: "admin-dev-001", email: "admin@sircrrschool.ac.in" }): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEV_ADMIN_COOKIE, JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_ADMIN_COOKIE);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore
    }
  }
}
