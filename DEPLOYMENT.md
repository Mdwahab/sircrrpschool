# SIR C. R. REDDY PUBLIC SCHOOL — DEPLOYMENT & VERIFICATION GUIDE

This document outlines the deployment procedure, Supabase database and authentication configuration, security validation checklist, and the school management verification registry.

---

## 1. PRE-DEPLOYMENT SAFETY RULES

- **NEVER modify or point DNS / nameservers to `sircrrschool.ac.in`** until school management conducts formal acceptance testing on the temporary preview URL.
- **NEVER commit production database credentials, service-role keys, or email API tokens** into the Git repository.
- Always deploy first to a **temporary Vercel Preview URL** (e.g. `sircrr-public-school-preview.vercel.app`).
- The application automatically runs in a secure, zero-crash **Development Fallback Mode** when environment variables are unconfigured, allowing instantaneous verification of layouts, forms, and administrative dashboards without external dependencies.

---

## 2. SUPABASE BACKEND SETUP

### Step 2.1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a project named `sircrreddy-portal`.
2. Select your closest region (e.g. `ap-south-1` Mumbai, India).
3. Record the generated **Database Password**.

### Step 2.2: Apply Database Schema Migration
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open `supabase/migrations/20260101000000_initial_schema.sql` from this workspace.
3. Paste the contents into the SQL Editor and click **Run**.
4. Verify that the following tables and Row-Level Security policies are created:
   - `public.profiles`
   - `public.notices`
   - `public.gallery_images`
   - `public.achievements`
   - `public.admission_enquiries`
   - `public.school_settings`
   - `public.audit_logs`
   - Storage Buckets: `gallery` (5MB limit) and `documents` (10MB limit)

### Step 2.3: Provision the Two Initial Administrator Accounts
As per institutional governance requirements, the system requires exactly two initial authorized administrators:
1. In Supabase Dashboard, navigate to **Authentication -> Users**.
2. Click **Add User -> Create User** and provision:
   - Administrator 1: `admin@sircrrschool.ac.in`
   - Administrator 2: `principal@sircrrschool.ac.in`
3. In the SQL Editor, insert their profile records:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
    ('<USER_1_UUID>', 'admin@sircrrschool.ac.in', 'School Administrator', 'admin'),
    ('<USER_2_UUID>', 'principal@sircrrschool.ac.in', 'School Principal', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```
4. Verify that public self-registration remains disabled under **Authentication -> Sign In / Providers -> Email -> Enable Sign Up** (toggle OFF).

---

## 3. RESEND TRANSACTIONAL EMAIL SETUP

1. Log in to [Resend](https://resend.com) and generate an API key.
2. In development, Resend allows dispatching to your registered onboarding email (`onboarding@resend.dev`).
3. For production, add and verify your school domain `sircrrschool.ac.in` via DNS TXT records.
4. Set the `SCHOOL_ENQUIRY_NOTIFICATION_EMAIL` to the authorized admissions office inbox (verified default: `sircrrps@yahoo.com`).

---

## 4. VERCEL PREVIEW DEPLOYMENT STEPS

1. Install the Vercel CLI or link through GitHub:
   ```bash
   npx vercel
   ```
2. When prompted:
   - Set up and deploy: **Yes**
   - Link to existing project: **No**
   - Project name: **sircrreddy-preview**
   - Framework preset: **Next.js**
3. Configure Environment Variables in the Vercel Dashboard under **Settings -> Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Server Only)
   - `RESEND_API_KEY` (Server Only)
   - `SCHOOL_ENQUIRY_NOTIFICATION_EMAIL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Deploy the preview:
   ```bash
   npx vercel --prod=false
   ```
5. Share the generated preview URL (e.g. `https://sircrreddy-preview-xyz.vercel.app`) with the school management committee for review.

---

## 5. ROLLBACK & INCIDENT CONTINGENCY PLAN

If any anomaly or discrepancy is flagged by school management during preview review:
1. **Immediate Preview Teardown:**
   Run `npx vercel rm sircrreddy-preview` or disable the deployment directly from the Vercel dashboard.
2. **Database Rollback:**
   The live existing school portal (`sircrrschool.ac.in`) is hosted on independent legacy infrastructure and was untouched during development.
3. **Data Preservation:**
   All candidate admission enquiries collected during testing remain safely stored in `admission_enquiries` and can be exported as CSV/JSON via Supabase Studio.

---

## 6. SCHOOL MANAGEMENT VERIFICATION REGISTRY

The following table summarizes items verified against public CBSE directory records versus items requiring management confirmation:

| Entity / Field | Current Value in Project | Status | Verification Authority / Action Required |
| :--- | :--- | :--- | :--- |
| **School Name** | Sir C. R. Reddy Public School | VERIFIED | CBSE Affiliation Directory (No. 130072) |
| **CBSE Affiliation No.** | 130072 | VERIFIED | Central Board of Secondary Education record |
| **School Level** | Senior Secondary (LKG to XII) | VERIFIED | CBSE Secondary & Senior Secondary Approval |
| **Established Year** | 1984 | VERIFIED | Historical institutional founding record |
| **Managing Body** | Sir C. R. Reddy Educational Institutions | VERIFIED | Governing Body established in 1945 |
| **Campus Address** | G.N.T. Road, Vatluru, Eluru — 534006 | VERIFIED | Official postal address in CBSE directory |
| **Official Phone** | 08812-251650 / 08812-33350 | VERIFIED | CBSE directory contact records |
| **Official Email** | sircrrps@yahoo.com | VERIFIED | CBSE directory contact records |
| **Principal Portrait** | `principal-placeholder.svg` | PLACEHOLDER | **Requires Management Upload:** Submit high-res official photograph of current Principal |
| **Principal's Address** | Editorial Placeholder | PLACEHOLDER | **Requires Management Approval:** Formal sign-off on inaugural address text |
| **WhatsApp Number** | `+919440000000` | PLACEHOLDER | **Requires Management Confirmation:** Provide verified dedicated mobile SIM number |
| **Mandatory Disclosure** | SARAS Compliance Placeholder | PLACEHOLDER | **Requires Upload:** Link PDF certificates (Building Safety, Fire Safety, NOC) |
| **Admissions Email** | `sircrrps@yahoo.com` | PENDING CONFIRM | Confirm whether enquiries route to principal inbox or dedicated desk |
