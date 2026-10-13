"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import CTAButton from "./ui/CTAButton";
import { MeshGradient } from "./ui/mesh-gradient";
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
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
        <MeshGradient
          className="h-full w-full"
          colors={["#0b1f3a", "#0c78b8", "#1793c6", "#4c86ff"]}
          speed={0.3}
          distortion={0.9}
          swirl={0.5}
          swirlIterations={7}
          softness={1}
          shape="wave"
          shapeScale={0.8}
          scale={1.6}
          rotation={135}
        />
      </div>
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
