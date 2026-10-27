import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface ReachabilityCache {
  isReachable: boolean;
  checkedAt: number;
  error?: string;
}

let reachabilityCache: ReachabilityCache | null = null;
const CACHE_TTL_MS = 30000; // Cache connection probe for 30 seconds

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function isSupabaseConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = getSupabaseAnonKey();

  if (!rawUrl || !anonKey) return false;
  if (rawUrl.includes("your-project") || rawUrl.includes("your-supabase")) return false;
  if (anonKey.includes("your-supabase-anon-key") || anonKey === "placeholder") return false;

  return true;
}

/**
 * Actively probes the Supabase endpoint with a fast 1500ms timeout.
 * Prevents indefinite hanging on dead DNS (e.g. ENOTFOUND) or firewalled networks.
 */
export async function isSupabaseReachable(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const now = Date.now();
  if (reachabilityCache && now - reachabilityCache.checkedAt < CACHE_TTL_MS) {
    return reachabilityCache.isReachable;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const anonKey = getSupabaseAnonKey()!;
  const baseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${baseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: anonKey,
      },
      signal: controller.signal,
    }).catch((err) => {
      return { ok: false, status: 0, err };
    });

    clearTimeout(timeout);

    // If HTTP status is returned (even 401/404), the server is alive and reachable
    const isLive = "status" in res && res.status > 0;
    const errorMsg = !isLive
      ? "err" in res && res.err
        ? String((res.err as { message?: string }).message || res.err)
        : "Connection timed out"
      : undefined;

    reachabilityCache = {
      isReachable: isLive,
      checkedAt: now,
      error: errorMsg,
    };

    if (!isLive) {
      console.warn(`[SUPABASE PROBE] Endpoint ${baseUrl} unreachable: ${errorMsg}. Falling back to resilient local store.`);
    }

    return isLive;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    reachabilityCache = {
      isReachable: false,
      checkedAt: now,
      error: message,
    };
    console.warn(`[SUPABASE PROBE EXCEPTION] ${message}. Falling back to resilient local store.`);
    return false;
  }
}

export async function getSupabaseIntegrationStatus() {
  const configured = isSupabaseConfigured();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const hasServiceKey = Boolean(
    serviceKey &&
    !serviceKey.includes("your-supabase-service-role-key")
  );

  let reachable = false;
  let probeError: string | undefined = undefined;

  if (configured) {
    reachable = await isSupabaseReachable();
    probeError = reachabilityCache?.error;
  }

  return {
    isConfigured: configured,
    isReachable: reachable,
    hasServiceKey,
    url: rawUrl,
    error: probeError,
    mode: reachable ? "supabase" : "local_store",
  };
}

export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Probe reachability before creating client to avoid Node fetch hanging on dead host
  const live = await isSupabaseReachable();
  if (!live) {
    return null;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = getSupabaseAnonKey()!;
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server component read-only cookie context
        }
      },
    },
  });
}
