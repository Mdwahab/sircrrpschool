-- ============================================================================
-- SIR C. R. REDDY PUBLIC SCHOOL, CBSE, ELURU
-- COMPLETE PRODUCTION SUPABASE DATABASE SCHEMA, STORAGE & RLS SETUP
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/fgryltmfyswkziakuobz/sql/new
-- 2. Paste this entire script into the SQL Editor.
-- 3. Click "RUN" to create all tables, indexes, storage buckets, and security policies.
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES / ADMINISTRATOR ROLES TABLE
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

-- 5. ADMISSION ENQUIRIES TABLE (STRICT DATA PRIVACY: ZERO PUBLIC SELECT ACCESS)
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
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON public.admission_enquiries (phone);
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

-- Function: Check if user is admin
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
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
CREATE POLICY "Admins can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_admin() OR id = auth.uid());

DROP POLICY IF EXISTS "Admins can update own profile" ON public.profiles;
CREATE POLICY "Admins can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- --- NOTICES POLICIES ---
DROP POLICY IF EXISTS "Public can view published notices" ON public.notices;
CREATE POLICY "Public can view published notices"
    ON public.notices FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins full access to notices" ON public.notices;
CREATE POLICY "Admins full access to notices"
    ON public.notices FOR ALL
    TO authenticated
    USING (public.is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

-- --- GALLERY POLICIES ---
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
CREATE POLICY "Public can view published gallery images"
    ON public.gallery_images FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins full access to gallery" ON public.gallery_images;
CREATE POLICY "Admins full access to gallery"
    ON public.gallery_images FOR ALL
    TO authenticated
    USING (public.is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

-- --- ACHIEVEMENTS POLICIES ---
DROP POLICY IF EXISTS "Public can view published achievements" ON public.achievements;
CREATE POLICY "Public can view published achievements"
    ON public.achievements FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins full access to achievements" ON public.achievements;
CREATE POLICY "Admins full access to achievements"
    ON public.achievements FOR ALL
    TO authenticated
    USING (public.is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

-- --- ADMISSION ENQUIRIES POLICIES ---
-- CRITICAL PRIVACY: Anonymous visitors CANNOT SELECT or read ANY enquiries
DROP POLICY IF EXISTS "Public can submit admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Public can submit admission enquiries"
    ON public.admission_enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(parent_name)) >= 2 AND
        length(trim(student_name)) >= 2 AND
        length(trim(phone)) >= 10 AND
        length(trim(grade_applying)) >= 1
    );

DROP POLICY IF EXISTS "Admins can view and update enquiries" ON public.admission_enquiries;
CREATE POLICY "Admins can view and update enquiries"
    ON public.admission_enquiries FOR ALL
    TO authenticated
    USING (public.is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

-- --- SCHOOL SETTINGS POLICIES ---
DROP POLICY IF EXISTS "Public can view school settings" ON public.school_settings;
CREATE POLICY "Public can view school settings"
    ON public.school_settings FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can modify school settings" ON public.school_settings;
CREATE POLICY "Admins can modify school settings"
    ON public.school_settings FOR ALL
    TO authenticated
    USING (public.is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKETS (Gallery & Documents)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('documents', 'documents', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage read policies
DROP POLICY IF EXISTS "Public Read Gallery Bucket" ON storage.objects;
CREATE POLICY "Public Read Gallery Bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public Read Documents Bucket" ON storage.objects;
CREATE POLICY "Public Read Documents Bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'documents');

-- Storage write policies
DROP POLICY IF EXISTS "Admins Write Gallery Bucket" ON storage.objects;
CREATE POLICY "Admins Write Gallery Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins Delete Gallery Bucket" ON storage.objects;
CREATE POLICY "Admins Delete Gallery Bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery');

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.notices (id, title, category, summary, content, is_published, publish_date)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Admission Enquiry & Prospectus Registration (2025–2026)', 'Academic', 'Admissions enquiries are formally open for LKG through Class XI (Science & Commerce streams) for the 2025–2026 academic year. Registration details and prospectus are available at the administrative office.', 'Sir C. R. Reddy Public School invites prospective parents and students for admission across Foundational (LKG/UKG), Preparatory (Classes I–V), Middle (Classes VI–VIII), Secondary (Classes IX–X), and Senior Secondary (Classes XI–XII). Parents are advised to submit the online enquiry form or visit the school administrative desk on working days.', true, CURRENT_DATE),
    ('00000000-0000-0000-0000-000000000002', 'CBSE Mandatory Public Disclosure (SARAS)', 'Circular', 'Mandatory public disclosure records, affiliation documents, and infrastructure compliance records under CBSE SARAS guidelines.', 'Under the provisions of the Central Board of Secondary Education (CBSE), Affiliation No. 130072, public disclosure documents are available for inspection at the school administrative counter during official office hours.', true, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_images (id, title, category, image_url, alt_text, caption, is_published, sort_order)
VALUES 
    ('00000000-0000-0000-0000-000000000021', 'Academic Complex & Administrative Wing', 'Campus', '/images/campus-main.svg', 'Sir C. R. Reddy Public School Main Campus Administrative Building', 'Main Administrative and Academic Block at G.N.T. Road, Vatluru / Santhi Nagar, Eluru.', true, 1),
    ('00000000-0000-0000-0000-000000000022', 'Composite Science Laboratories', 'Laboratories', '/images/science-lab.svg', 'Physics, Chemistry and Biology Practical Laboratories Setup', 'Practical workbenches and apparatus supporting prescribed CBSE secondary and senior secondary sciences.', true, 2),
    ('00000000-0000-0000-0000-000000000023', 'Computer & Information Technology Lab', 'Laboratories', '/images/computer-lab.svg', 'Networked computer laboratory for informatics and digital literacy', 'Computer workstations dedicated to computer applications and digital literacy curriculum.', true, 3),
    ('00000000-0000-0000-0000-000000000024', 'School Library & Reading Hall', 'Academics', '/images/library.svg', 'School library with academic collection and reading bays', 'CBSE curriculum reference books, supplementary reading materials, and periodicals.', true, 4),
    ('00000000-0000-0000-0000-000000000025', 'Athletics Field & Playgrounds', 'Sports', '/images/sports-ground.svg', 'Outdoor grounds for athletics and physical education games', 'Spacious outdoor grounds for games, team sports, and structured physical fitness drills.', true, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.school_settings (key, value)
VALUES
    ('phoneOffice', '" +91 6300065646"'),
    ('phoneAlternative', '"6300065646"'),
    ('emailOfficial', '"sircrrps1@gmail.com"'),
    ('currentAcademicSession', '"2025–2026"'),
    ('campusAddress', '"G.N.T. Road, Vatluru / Santhi Nagar, Eluru"'),
    ('pincode', '"534006"'),
    ('affiliationNumber', '"130072"')
ON CONFLICT (key) DO NOTHING;
