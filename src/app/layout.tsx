import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import { Component as CursorFollower } from "@/components/ui/cursor-follower";
import "./globals.css";

const satoshi = localFont({
  src: "../fonts/satoshi/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.markidly.com"),
  title: {
    default: "Markidly — Amazon Account Management & Growth Partner",
    template: "%s | Markidly",
  },
  description:
    "Markidly helps established consumer brands improve and scale their Amazon business — advertising, listings and conversion, operations, inventory and marketplace growth — with one accountable team.",
  openGraph: {
    title: "Markidly — Amazon Account Management & Growth Partner",
    description:
      "Markidly helps established consumer brands improve and scale their Amazon business — advertising, listings and conversion, operations, inventory and marketplace growth — with one accountable team.",
    url: "https://www.markidly.com",
    siteName: "Markidly",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${dmSans.variable}`}>
      <body>
        <SmoothScroll />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
