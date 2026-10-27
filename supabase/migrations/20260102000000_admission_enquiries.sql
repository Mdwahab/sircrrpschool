-- ============================================================================
-- SIR C. R. REDDY PUBLIC SCHOOL, CBSE, ELURU
-- MIGRATION: ADMISSION ENQUIRIES TABLE & ROW-LEVEL SECURITY POLICIES
-- ============================================================================

-- Ensure pgcrypto extension is enabled for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMISSION ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.admission_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    grade_applying TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2025–2026',
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
    notes TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. INDEXES FOR PERFORMANCE & REPORTING
CREATE INDEX IF NOT EXISTS idx_enquiries_status_date 
    ON public.admission_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_enquiries_phone 
    ON public.admission_enquiries (phone);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;

-- 4. ROW-LEVEL SECURITY POLICIES
-- Ensure clean idempotent policy setup
DROP POLICY IF EXISTS "Public can submit admission enquiries" ON public.admission_enquiries;
DROP POLICY IF EXISTS "Admins can view and update enquiries" ON public.admission_enquiries;

-- Public (Anonymous & Authenticated) can insert valid new enquiries
CREATE POLICY "Public can submit admission enquiries"
    ON public.admission_enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(parent_name)) >= 2 AND
        length(trim(student_name)) >= 2 AND
        length(trim(phone)) >= 10 AND
        length(trim(grade_applying)) >= 1
    );

-- Only authenticated users can view, update, or manage enquiries
-- (Service role key automatically bypasses RLS for server-side management)
CREATE POLICY "Admins can view and update enquiries"
    ON public.admission_enquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
