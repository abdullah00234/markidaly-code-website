"use client";

import { motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import CTAButton from "./ui/CTAButton";
import FeatureCarousel from "./ui/feature-carousel";
import { EASE_PREMIUM } from "@/lib/motion";

export default function CommerceSystem() {
  return (
    <section id="commerce-system" className="bg-white py-24 lg:py-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mx-auto max-w-2xl text-center"
        >
          <Eyebrow>The Commerce System</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
            Seven levers. One connected system.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            Advertising, traffic, conversion, inventory, operations, account
            health and marketplace growth don&rsquo;t operate in isolation —
            move one, and the others move with it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
          className="mt-14"
        >
          <FeatureCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.2 }}
          className="mx-auto mt-14 max-w-3xl text-center"
        >
          <CTAButton href="#contact" arrow>
            Book a Free Growth Audit
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
