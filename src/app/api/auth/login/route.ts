import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { setDevAdminSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = (email || "").trim().toLowerCase();

    // 1. Development Mode Credentials (Instant, zero-latency authentication for local review)
    const isDevAdmin =
      (normalizedEmail === "admin@sircrrschool.ac.in" && password === "Admin@SirCRR1984") ||
      (normalizedEmail === "principal@sircrrschool.ac.in" && password === "Principal@SirCRR1984");

    if (isDevAdmin) {
      const user =
        normalizedEmail === "admin@sircrrschool.ac.in"
          ? { id: "admin-dev-01", email: "admin@sircrrschool.ac.in" }
          : { id: "principal-dev-02", email: "principal@sircrrschool.ac.in" };

      await setDevAdminSession(user);
      return NextResponse.json({
        success: true,
        isDevFallback: true,
        user,
      });
    }

    // 2. If live Supabase is configured, use official Supabase Auth for production credentials
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!error && data?.user) {
            return NextResponse.json({
              success: true,
              user: { id: data.user.id, email: data.user.email },
            });
          }

          if (error) {
            const isNetworkError =
              error.message.includes("fetch failed") ||
              error.message.includes("ENOTFOUND") ||
              error.name === "AuthRetryableFetchError";

            return NextResponse.json(
              {
                success: false,
                error: isNetworkError
                  ? "Unable to reach Supabase authentication server. Please check your Supabase project in .env.local, or use the pre-authorized Dev Admin credentials."
                  : error.message || "Invalid administrator credentials.",
              },
              { status: 401 }
            );
          }
        }
      } catch (err: unknown) {
        console.warn("[SUPABASE AUTH ATTEMPT FAILED]", err);
        return NextResponse.json(
          {
            success: false,
            error: "Unable to connect to Supabase server. Please use the pre-authorized Dev Admin credentials below.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid administrator credentials. For local preview, click 'Fill Dev Admin Credentials' below (admin@sircrrschool.ac.in / Admin@SirCRR1984).",
      },
      { status: 401 }
    );
  } catch (err: unknown) {
    console.error("[LOGIN API ERROR]", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
