"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import CTAButton from "./ui/CTAButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Our Approach", href: "#how-we-work" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact", href: "#book-audit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Floating pill on scroll — condenses and insets from the edges,
          revealing the page behind it instead of spanning full-width */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "mx-3 mt-3 rounded-2xl border border-white/10 bg-white/90 shadow-[0_16px_40px_-16px_rgba(11,31,58,0.35)] backdrop-blur-xl sm:mx-5 md:mt-4"
            : "mx-0 mt-0 rounded-none border-transparent bg-transparent"
        }`}
      >
        <nav className="container-page flex h-[64px] items-center justify-between md:h-[72px]">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/images/logo-blue.png"
              alt="Markidly"
              width={412}
              height={106}
              priority
              className={`h-8 w-auto transition-all duration-300 md:h-9 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
            />
          </Link>

          <ul className="hidden items-center gap-9 xl:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative text-[14.5px] font-medium transition-colors duration-200 ${
                    scrolled
                      ? "text-ink-soft hover:text-navy"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full ${
                      scrolled ? "bg-primary" : "bg-white"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`hidden items-center gap-5 xl:flex ${
              scrolled ? "border-l border-line pl-6" : "border-l border-white/15 pl-6"
            }`}
          >
            <CTAButton
              href="#book-audit"
              variant={scrolled ? "ghost" : "outline-dark"}
              size="sm"
              arrow
            >
              Talk With a Founder
            </CTAButton>
            <CTAButton href="#book-audit" size="sm" arrow>
              Book a Free Growth Audit
            </CTAButton>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center xl:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  scrolled ? "bg-navy" : "bg-white"
                } ${mobileOpen ? "top-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-5 transition-opacity duration-200 ${
                  scrolled ? "bg-navy" : "bg-white"
                } ${mobileOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[1.5px] w-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  scrolled ? "bg-navy" : "bg-white"
                } ${mobileOpen ? "top-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 mt-2 rounded-2xl border border-line bg-white/95 shadow-[0_16px_40px_-16px_rgba(11,31,58,0.35)] backdrop-blur-xl sm:mx-5 xl:hidden"
          >
            <ul className="flex flex-col gap-1 px-3 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-3 text-[17px] font-medium text-navy transition-colors hover:bg-primary-light hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 border-t border-line px-4 py-5">
              <CTAButton
                href="#book-audit"
                variant="ghost"
                arrow
                onClick={() => setMobileOpen(false)}
                className="justify-center"
              >
                Talk With a Founder
              </CTAButton>
              <CTAButton
                href="#book-audit"
                className="w-full"
                size="md"
                arrow
                onClick={() => setMobileOpen(false)}
              >
                Book a Free Growth Audit
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
