import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, isSupabaseReachable } from "./server";

/**
 * Server-only administrative Supabase client using the Service Role Key.
 *
 * SECURITY NON-NEGOTIABLES:
 * - NEVER import or execute this file in client-side code or browser components.
 * - Used exclusively for privileged server-side operations (e.g. inserting/updating enquiries,
 *   bypassing restrictive public RLS read checks).
 */
export async function createAdminSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const live = await isSupabaseReachable();
  if (!live) {
    return null;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes("your-supabase-service-role-key")) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
