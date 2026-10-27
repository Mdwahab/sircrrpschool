import type { Metadata } from "next";
import "./globals.css";
import { SCHOOL_INFO } from "@/config/schoolInfo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sircrrschool.ac.in"),
  title: "Sir C. R. Reddy Public School | CBSE Affiliated Senior Secondary, Eluru",
  description: `Official website for Sir C. R. Reddy Public School, Eluru (CBSE Affiliation No: 130072). Admissions open for academic session ${SCHOOL_INFO.admissions.currentAcademicSession}. Excellence in academics, practical science, sports, and value-based education since 1984.`,
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
    description: `CBSE Affiliated Senior Secondary School (No. 130072). Admissions open for ${SCHOOL_INFO.admissions.currentAcademicSession}. Quality Service & Value Based Education.`,
    url: "https://sircrrschool.ac.in",
    siteName: "Sir C. R. Reddy Public School",
    images: [
      {
        url: "/images/school/campus/campus-aerial-panorama.jpg",
        width: 1200,
        height: 665,
        alt: "Sir C. R. Reddy Public School Campus Aerial View",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sir C. R. Reddy Public School | CBSE Senior Secondary, Eluru",
    description: `CBSE Affiliated Senior Secondary School (No. 130072). Admissions open for ${SCHOOL_INFO.admissions.currentAcademicSession}. Quality Service & Value Based Education.`,
    images: ["/images/school/campus/campus-aerial-panorama.jpg"],
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
    logo: "https://sircrrschool.ac.in/images/schoollogo.png",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/schoollogo.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#2F4156] antialiased selection:bg-[#567C8D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
