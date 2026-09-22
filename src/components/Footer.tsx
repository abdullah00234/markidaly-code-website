import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
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
  { label: "Our Approach", href: "#how-we-work" },
  { label: "About", href: "#about" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact", href: "#book-audit" },
];

// Placeholder contact details — confirm before publishing.
const EMAIL = "hello@markidly.com";
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
