"use client";

import { motion } from "motion/react";
import Eyebrow from "../ui/Eyebrow";
import { EASE_PREMIUM } from "@/lib/motion";

export default function CaseStudiesHeader() {
  return (
    <div className="container-page">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        >
          <Eyebrow>Case Studies</Eyebrow>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.08 }}
          className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]"
        >
          Real accounts. Real constraints.{" "}
          <span className="text-gradient-brand">Measurable progress.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.16 }}
          className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft"
        >
          We&rsquo;ve protected accounts through supply shocks, turned around
          underperforming ad accounts, rebuilt listings that weren&rsquo;t
          converting, and pushed plateaued brands past their ceiling. A few
          examples:
        </motion.p>
      </div>
    </div>
  );
}
