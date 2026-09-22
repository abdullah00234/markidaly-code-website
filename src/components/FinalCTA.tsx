"use client";

import { motion } from "motion/react";
import CTAButton from "./ui/CTAButton";
import { EASE_PREMIUM } from "@/lib/motion";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-hero py-28 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(23,147,198,0.35),transparent_60%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#1793C6]/20 blur-[120px]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto max-w-2xl font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[44px]"
        >
          Let&rsquo;s Find What&rsquo;s Holding Your Amazon Business Back.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
          className="mx-auto mt-6 max-w-md text-[15.5px] leading-relaxed text-white/60"
        >
          We&rsquo;ll look at the parts of your Amazon business that matter
          most, identify the biggest opportunities or constraints, and show
          you what we&rsquo;d prioritize first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <CTAButton href="#book-audit" arrow>
            Book a Free Growth Audit
          </CTAButton>
          <CTAButton href="#book-audit" variant="outline-dark" arrow>
            Talk With a Founder
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
