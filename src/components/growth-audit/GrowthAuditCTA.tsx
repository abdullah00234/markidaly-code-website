"use client";

import { motion } from "motion/react";
import CTAButton from "../ui/CTAButton";
import { EASE_PREMIUM } from "@/lib/motion";

export default function GrowthAuditCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
      className="mt-16 flex justify-center px-4 lg:mt-20"
    >
      <CTAButton
        href="#book-audit"
        arrow
        className="w-full !px-8 !py-4 !text-[16px] sm:w-auto"
      >
        Book a Free Growth Audit
      </CTAButton>
    </motion.div>
  );
}
