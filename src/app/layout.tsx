import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
