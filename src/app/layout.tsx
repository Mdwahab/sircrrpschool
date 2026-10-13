import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SCHOOL_INFO } from "@/config/schoolInfo";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sircrrschool.ac.in"),
  title: "Sir C. R. Reddy Public School | CBSE Affiliated Senior Secondary, Eluru",
  description:
    "Official website for Sir C. R. Reddy Public School, Eluru (CBSE Affiliation No: 130072). Admissions open for academic session 2025–2026. Excellence in academics, laboratories, athletics, and value-based education since 1984.",
  keywords: [
    "Sir C R Reddy Public School",
    "CBSE School Eluru",
    "Best CBSE School Eluru",
    "Sir CRR Public School",
    "Eluru CBSE Admissions",
    "Sir C.R. Reddy Educational Institutions",
    "CBSE 130072",
  ],
  authors: [{ name: "Sir C. R. Reddy Educational Institutions Governing Body" }],
  openGraph: {
    title: "Sir C. R. Reddy Public School, CBSE, Eluru",
    description:
      "CBSE Affiliated Senior Secondary School (No. 130072). Admissions open for 2025–2026. Quality Service & Value Based Education.",
    url: "https://sircrrschool.ac.in",
    siteName: "Sir C. R. Reddy Public School",
    images: [
      {
        url: "/images/campus-main.svg",
        width: 1200,
        height: 800,
        alt: "Sir C. R. Reddy Public School Campus",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SCHOOL_INFO.name,
    alternateName: "Sir CRR Public School",
    description:
      "Central Board of Secondary Education (CBSE) affiliated Senior Secondary School in Eluru, Andhra Pradesh.",
    url: "https://sircrrschool.ac.in",
    logo: "https://sircrrschool.ac.in/images/logo.svg",
    telephone: SCHOOL_INFO.contact.phoneOffice,
    email: SCHOOL_INFO.contact.emailOfficial,
    address: {
      "@type": "PostalAddress",
      streetAddress: SCHOOL_INFO.address.campus,
      addressLocality: SCHOOL_INFO.address.city,
      addressRegion: "Andhra Pradesh",
      postalCode: SCHOOL_INFO.address.pincode,
      addressCountry: "IN",
    },
    foundingDate: "1984",
  };

  return (
    <html lang="en" className={jakartaSans.variable}>
      <head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#051020] text-slate-100 antialiased selection:bg-[#d4af37] selection:text-[#07172f]">
        {children}
      </body>
    </html>
  );
}
