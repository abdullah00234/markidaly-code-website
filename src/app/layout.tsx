import type { Metadata, Viewport } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { Component as CursorFollower } from "@/components/ui/cursor-follower";
import "./globals.css";

// The original Satoshi variable font file is not present in this repo and
// isn't available as a next/font/google entry (it's a proprietary Fontshare
// font). Plus Jakarta Sans is a legitimately licensed, self-hosted variable
// geometric sans commonly used as a drop-in Satoshi substitute — kept on the
// same `--font-satoshi` CSS variable so no other file needs to change.
const satoshi = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-satoshi",
  weight: "variable",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Markidly helps established consumer brands improve and scale their Amazon business — advertising, listings and conversion, operations, inventory and marketplace growth — with one accountable team.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.markidly.com"),
  title: {
    default: "Markidly — Amazon Account Management & Growth Partner",
    template: "%s | Markidly",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Markidly — Amazon Account Management & Growth Partner",
    description: SITE_DESCRIPTION,
    url: "https://www.markidly.com",
    siteName: "Markidly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markidly — Amazon Account Management & Growth Partner",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1f3a",
};

// Organization structured data — contact details match Footer.tsx verbatim.
// No ratings, reviews, or figures invented here.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Markidly",
  url: "https://www.markidly.com",
  logo: "https://www.markidly.com/icon.png",
  email: "Contact@markidly.com",
  telephone: "+92 332 4659645",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11 Commercial, Nasheman Iqbal Phase 1",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  sameAs: ["https://linkedin.com/company/markidly"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${dmSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <SmoothScroll />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
