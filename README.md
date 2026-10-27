# SIR C. R. REDDY PUBLIC SCHOOL — OFFICIAL PORTAL CODEBASE

[![CBSE Affiliation: 130072](https://img.shields.io/badge/CBSE%20Affiliation-130072-blue.svg)](https://cbse.gov.in)
[![Estd: 1984](https://img.shields.io/badge/Estd-1984-gold.svg)](#)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ecf8e.svg)](https://supabase.com)

A high-performance digital presence and secure institutional administration system for **Sir C. R. Reddy Public School, CBSE, Eluru, Andhra Pradesh, India**.

---

## 1. PROJECT OVERVIEW

Sir C. R. Reddy Public School was established in **1984** in Eluru, Andhra Pradesh, under the historic **Sir C. R. Reddy Educational Institutions** (Managing Committee founded in 1945). Affiliated with the Central Board of Secondary Education (CBSE Affiliation No: **130072**), the school provides co-educational instruction from Foundational Stage (LKG/UKG) through Senior Secondary Level (Class XII) in Science and Commerce streams.

This codebase delivers:
1. **Public Cinematic Portal:** A fast, responsive, accessible single-page web experience with full keyboard navigation, reduced-motion compliance, rich typography, and authentic institutional emblems.
2. **Secure Administration Console:** A protected management suite (`/admin`) for authorized staff to manage circulars, catalog campus visual media, record board achievements, and process inbound admission enquiries.
3. **Robust Admissions Engine:** Multi-stage client and server validated admission enquiry flow with anti-spam honeypot detection, IP rate limiting, Resend transactional notifications, and WhatsApp click-to-chat integration.
4. **Development Fallback Mode:** Operates safely without external cloud dependencies during local testing and development previews, automatically activating live cloud synchronization when Supabase and Resend environment variables are configured.

---

## 2. TECHNOLOGY ARCHITECTURE

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server components by default, Turbopack, static prerendering, streaming |
| **Language** | TypeScript (Strict) | End-to-end typed interfaces for database entities and API payloads |
| **Styling** | Tailwind CSS v4 & Vanilla CSS | Curated White-First (`#FFFFFF`), Deep Navy (`#102A43`), Royal Blue (`#2563EB`) |
| **Icons & Typography** | Lucide React & Plus Jakarta Sans | Accessible SVG iconography and editorial typography |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) | Row-Level Security (RLS), UUIDs, storage buckets with MIME validation |
| **Notifications** | Resend | HTML email notifications to the school admissions desk |
| **Deployment Target** | Vercel | Ephemeral preview deployment support with zero downtime |

---

## 3. PROJECT DIRECTORY STRUCTURE

```
sircrreddy/
├── public/
│   └── images/
│       ├── logo.svg                   # Official school crest with heraldic elements
│       ├── campus-main.svg            # Campus architectural elevation placeholder
│       ├── science-lab.svg            # Physics/Chemistry/Biology laboratory placeholder
│       ├── computer-lab.svg           # Digital IT lab placeholder
│       ├── library.svg                # Central library placeholder
│       ├── sports-ground.svg          # Athletics & sports arena placeholder
│       ├── principal-placeholder.svg  # Principal portrait placeholder
│       └── founder-portrait.svg       # Sir C. R. Reddy tribute portrait
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Public single-page scrolling layout
│   │   ├── layout.tsx                 # Root layout with SEO metadata & schema.org
│   │   ├── globals.css                # Design tokens, glassmorphism, focus rings
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Secure administrative login
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx         # Protected admin shell & auth guard
│   │   │       ├── page.tsx           # Dashboard overview & KPI metrics
│   │   │       ├── notices/page.tsx   # Notices & circulars authoring
│   │   │       ├── gallery/page.tsx   # Media gallery catalog management
│   │   │       ├── results/page.tsx   # Board exam achievements management
│   │   │       ├── enquiries/page.tsx # Inbound admission enquiries registry
│   │   │       └── settings/page.tsx  # Institutional configuration & contacts
│   │   └── api/
│   │       ├── enquiry/route.ts       # Public rate-limited enquiry submission
│   │       ├── auth/                  # Admin login/logout handlers
│   │       └── admin/                 # Protected CRUD API routes
│   ├── components/
│   │   ├── layout/                    # Navbar, Footer, AdminSidebar, AdminHeader
│   │   ├── sections/                  # Hero, About, Academics, Principal, Gallery, etc.
│   │   ├── gallery/                   # GalleryLightbox accessible modal
│   │   └── ui/                        # SectionHeading, VerificationBadge, Button
│   ├── config/
│   │   └── schoolInfo.ts              # Verified school metadata & master records
│   └── lib/
│       ├── auth/                      # Session verification helpers
│       ├── db/                        # Database service layer, types, seed data
│       ├── email/                     # Resend email integration
│       ├── supabase/                  # Server and browser Supabase clients
│       └── validation/                # Zod-style enquiry validator & rate limiter
├── supabase/
│   └── migrations/
│       └── 20260101000000_initial_schema.sql  # Complete schema & RLS SQL
├── .env.example                       # Environment variables template
├── DEPLOYMENT.md                      # Detailed deployment and verification guide
└── README.md                          # Documentation
```

---

## 4. LOCAL DEVELOPMENT & TESTING

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Copy environment template for live cloud synchronization:
   ```bash
   cp .env.example .env.local
   ```
   *Note: If `.env.local` is omitted, the application runs automatically in safe local development mode.*

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
---

## 5. VALIDATION & SECURITY CHECKS

To verify code quality and build integrity:
```bash
# Run TypeScript compilation and production bundle build
npm run build

# Run code linter
npm run lint
```

Refer to `DEPLOYMENT.md` for full instructions on Supabase setup, Vercel preview deployment, and the school management verification registry.
