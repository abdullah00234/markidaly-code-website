import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Linkedin01Icon } from "@hugeicons/core-free-icons";
import CTAButton from "./ui/CTAButton";

const SERVICES_LINKS = [
  "Amazon Account Management",
  "Amazon PPC Management",
  "Listing Optimization & CRO",
  "Storefront & Brand Experience",
  "Product Launch & Ranking",
  "Inventory, Operations & Account Health",
  "Marketplace Expansion",
].map((label) => ({ label, href: "#services" }));

const COMPANY_LINKS = [
  { label: "Our Approach", href: "#our-process" },
  { label: "About", href: "#about" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact", href: "#book-audit" },
];

const EMAIL = "Contact@markidly.com";
const PHONE = "+92 332 4659645";
const ADDRESS = "11 Commercial, Nasheman Iqbal Phase 1, Lahore";
const LINKEDIN_URL = "https://linkedin.com/company/markidly";

export default function Footer() {
  return (
    <footer className="bg-gradient-hero pt-20">
      <div className="container-page grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo-white.png"
            alt="Markidly"
            width={412}
            height={106}
            className="h-7 w-auto"
          />
          <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-white">
            Amazon growth and account management for established consumer
            brands — advertising, listings, inventory, and operations, run as
            one system.
          </p>
        </div>

        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-gold-soft">
            Services
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {SERVICES_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14.5px] text-white transition-opacity hover:opacity-75"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-gold-soft">
            Company
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14.5px] text-white transition-opacity hover:opacity-75"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-gold-soft">
            Contact
          </p>
          <div className="mt-4 flex flex-col items-start gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-[14.5px] text-white transition-opacity hover:opacity-75"
            >
              <Mail className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 text-[14.5px] text-white transition-opacity hover:opacity-75"
            >
              <Phone className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
              {PHONE}
            </a>
            <p className="inline-flex items-start gap-2 text-[14.5px] text-white">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
              {ADDRESS}
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14.5px] text-white transition-opacity hover:opacity-75"
            >
              <HugeiconsIcon icon={Linkedin01Icon} size={16} strokeWidth={1.8} />
              LinkedIn
            </a>
            <CTAButton href="#book-audit" size="sm" arrow className="mt-2">
              Book a Free Growth Audit
            </CTAButton>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[12.5px] leading-relaxed text-white">
            Markidly is an independent Amazon growth partner and is not
            affiliated with, sponsored by, or endorsed by Amazon.com, Inc. or
            its affiliates.
            <br />
            &copy; {new Date().getFullYear()} Markidly. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="#" className="text-[12.5px] text-white transition-opacity hover:opacity-75">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[12.5px] text-white transition-opacity hover:opacity-75">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
