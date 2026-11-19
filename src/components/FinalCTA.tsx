"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import CTAButton from "./ui/CTAButton";
import { EASE_PREMIUM, staggerContainer } from "@/lib/motion";

const highlights = [
  "Founder-led, not handed off to a junior team",
  "One shared plan across PPC, listings, and ops",
  "Clear priorities, not a generic audit",
  "Follow-up within one business day",
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
};

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-hero-dark py-28 lg:py-36">
      {/* Smooth CSS-only glow: a controlled medium-blue wash on the left that
          fades gradually into the section's dark navy base toward the right.
          Replaces a prior WebGL grain-shader overlay that read as excessive,
          uneven noise rather than a premium gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(23,147,198,0.55) 0%, rgba(12,120,184,0.38) 20%, rgba(11,31,58,0.18) 48%, rgba(6,15,31,0) 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 15% 20%, rgba(76,134,255,0.35) 0%, transparent 65%)",
        }}
      />
      {/* Faint gold glow, bottom-right — the section's one touch of the
          accent, balancing the blue wash on the left. Drifts slowly so the
          whole backdrop feels alive without drawing attention to itself. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-gold/[0.1] blur-[100px]"
        animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* radial-gradient, not blur() — these divs' opacity/position animate
          forever, and re-rasterizing a CSS blur every frame of an infinite
          loop is pure GPU cost for a look a gradient already produces for
          free. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(23,147,198,0.38) 0%, rgba(23,147,198,0) 70%)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5], x: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[10%] h-[320px] w-[320px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(76,134,255,0.3) 0%, rgba(76,134,255,0) 70%)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="flex flex-col items-start gap-10 rounded-[32px] border border-white/15 bg-white/[0.06] p-8 shadow-[0_40px_100px_-32px_rgba(0,0,0,0.55)] ring-1 ring-[#1793C6]/20 backdrop-blur-xl sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:p-14"
        >
          <div className="max-w-lg">
            <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[44px]">
              Let&rsquo;s Find What&rsquo;s Holding Your Amazon Business Back.
            </h2>

            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-white/60">
              We&rsquo;ll look at the parts of your Amazon business that matter
              most, identify the biggest opportunities or constraints, and show
              you what we&rsquo;d prioritize first.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <CTAButton href="#book-audit" arrow>
                Book a Free Growth Audit
              </CTAButton>
              <CTAButton
                href="https://calendly.com/contact-markidly/30min"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-dark"
                arrow
              >
                Talk With a Founder
              </CTAButton>
            </div>
          </div>

          <motion.ul
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-[300px] lg:shrink-0"
          >
            {highlights.map((item) => (
              <motion.li
                key={item}
                variants={itemVariants}
                className="flex items-start gap-3 text-[14.5px] leading-snug text-white/80"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1793C6]" strokeWidth={2.5} />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
