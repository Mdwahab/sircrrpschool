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

    // 1. If live Supabase is configured, use official Supabase Auth
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          return NextResponse.json(
            { success: false, error: error?.message || "Invalid administrator credentials." },
            { status: 401 }
          );
        }

        return NextResponse.json({
          success: true,
          user: { id: data.user.id, email: data.user.email },
        });
      }
    }

    // 2. Development Mode Fallback
    // Allows administrator review and local testing before Supabase keys are provisioned
    if (
      (email === "admin@sircrrschool.ac.in" && password === "Admin@SirCRR1984") ||
      (email === "principal@sircrrschool.ac.in" && password === "Principal@SirCRR1984")
    ) {
      await setDevAdminSession();
      return NextResponse.json({
        success: true,
        isDevFallback: true,
        user: { id: "dev-admin-01", email },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid administrator credentials. For local preview, use admin@sircrrschool.ac.in / Admin@SirCRR1984, or configure Supabase Auth in .env.local.",
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
