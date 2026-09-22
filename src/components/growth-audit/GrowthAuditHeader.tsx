"use client";

import { motion } from "motion/react";
import Eyebrow from "../ui/Eyebrow";
import { EASE_PREMIUM } from "@/lib/motion";

export default function GrowthAuditHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM }}
      className="mx-auto max-w-2xl text-center"
    >
      <Eyebrow>What happens when you book a Growth Audit</Eyebrow>
      <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
        What You Get From a Growth Audit
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
        In three to four business days, we review your advertising,
        listings, inventory, and account health and come back with a clear
        picture of what&rsquo;s working, what&rsquo;s costing you, and what
        we&rsquo;d prioritize first.
      </p>
    </motion.div>
  );
}
