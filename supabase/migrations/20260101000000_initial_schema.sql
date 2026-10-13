-- ============================================================================
-- SIR C. R. REDDY PUBLIC SCHOOL, CBSE, ELURU
-- PRODUCTION SUPABASE DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / ADMINISTRATOR ROLES TABLE
-- Links directly to Supabase Auth auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. NOTICES & CIRCULARS TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Academic', 'Examination', 'Circular', 'Event', 'General')),
    summary TEXT NOT NULL,
    content TEXT,
    attachment_url TEXT,
    attachment_name TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    archived_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notices_published_date ON public.notices (is_published, publish_date DESC);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 3. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Campus', 'Laboratories', 'Academics', 'Sports', 'Events')),
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_published_sort ON public.gallery_images (is_published, sort_order ASC);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 4. ACHIEVEMENTS & BOARD RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('CBSE Board Examination', 'Olympiad & Academics', 'Sports & Athletics', 'Co-Curricular')),
    description TEXT NOT NULL,
    student_name TEXT,
    document_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_verified_record BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_achievements_year ON public.achievements (academic_year DESC, is_published);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- 5. ADMISSION ENQUIRIES TABLE
-- STRICT DATA PRIVACY: NEVER EXPOSED PUBLICLY
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

CREATE INDEX IF NOT EXISTS idx_enquiries_status_date ON public.admission_enquiries (status, created_at DESC);
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;

-- 6. SCHOOL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.school_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW-LEVEL SECURITY POLICIES (RLS)
-- ============================================================================

-- Helper function: Check if current authenticated user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
-- Administrators can view their own profile and all admin profiles
CREATE POLICY "Admins can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_admin() OR id = auth.uid());

CREATE POLICY "Admins can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- --- NOTICES POLICIES ---
-- Public can view only published notices
CREATE POLICY "Public can view published notices"
    ON public.notices FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- Administrators can perform all operations on notices
CREATE POLICY "Admins full access to notices"
    ON public.notices FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- GALLERY POLICIES ---
-- Public can view only published gallery items
CREATE POLICY "Public can view published gallery images"
    ON public.gallery_images FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- Administrators can perform all operations on gallery
CREATE POLICY "Admins full access to gallery"
    ON public.gallery_images FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- ACHIEVEMENTS POLICIES ---
-- Public can view only published achievements
CREATE POLICY "Public can view published achievements"
    ON public.achievements FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- Administrators can perform all operations on achievements
CREATE POLICY "Admins full access to achievements"
    ON public.achievements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- ADMISSION ENQUIRIES POLICIES ---
-- Public CANNOT read any enquiries (Zero select access for anon)
-- Public CAN insert new enquiries with valid constraints
CREATE POLICY "Public can submit admission enquiries"
    ON public.admission_enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(parent_name)) >= 2 AND
        length(trim(student_name)) >= 2 AND
        length(trim(phone)) >= 10 AND
        length(trim(grade_applying)) >= 1
    );

-- Only authenticated administrators can read or update enquiries
CREATE POLICY "Admins can view and update enquiries"
    ON public.admission_enquiries FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- AUDIT LOGS POLICIES ---
-- Only administrators can read audit logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION (SQL)
-- ============================================================================

-- Create public storage buckets for gallery images and documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('documents', 'documents', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Public can read storage files in gallery and documents
CREATE POLICY "Public Read Gallery Bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'gallery');

CREATE POLICY "Public Read Documents Bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'documents');

-- Only authenticated administrators can upload/delete storage objects
CREATE POLICY "Admins Write Gallery Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins Delete Gallery Bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins Write Documents Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admins Delete Documents Bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents' AND public.is_admin());

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.notices (id, title, category, summary, content, is_published, publish_date)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Admissions Open for Academic Session 2025–2026', 'Academic', 'Admissions are open for LKG to Class XI (Science & Commerce streams) for the 2025–26 academic year.', 'Prospectus and registration guidelines are available at the school administrative counter on G.N.T. Road, Eluru.', true, '2025-01-15'),
    ('00000000-0000-0000-0000-000000000002', 'CBSE Board Examination 2025 Schedule & Circular', 'Examination', 'Class X and Class XII students are advised to collect their CBSE examination hall tickets.', 'Instructions regarding center protocols and admit card verification.', true, '2025-02-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.achievements (id, academic_year, title, category, description, student_name, is_published, is_verified_record)
VALUES 
    ('00000000-0000-0000-0000-000000000011', '2023–2024', 'CBSE Class X Board Examination — 100% Pass Record', 'CBSE Board Examination', 'Cent percent pass record recorded in the CBSE Class X All India Secondary School Examination.', 'School Aggregate Batch', true, true),
    ('00000000-0000-0000-0000-000000000012', '2023–2024', 'CBSE Senior Secondary Class XII Science & Commerce Distinctions', 'CBSE Board Examination', 'Outstanding distinction grades across Physics, Chemistry, Mathematics, and Accountancy stream examinations.', 'Class XII Senior Batch', true, true)
ON CONFLICT (id) DO NOTHING;
