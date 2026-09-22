"use client";

import { motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";
import type { AuditStep as AuditStepData } from "./steps";

type AuditStepProps = {
  step: AuditStepData;
  index: number;
  orientation: "horizontal" | "vertical";
};

export default function AuditStep({ step, index, orientation }: AuditStepProps) {
  const Icon = step.icon;
  const delay = 0.15 + index * 0.08;

  if (orientation === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE_PREMIUM, delay }}
        className="group relative flex min-w-0 flex-col items-center px-2 text-center"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-9 inset-x-0 select-none text-[64px] font-extrabold leading-none text-navy/[0.06] transition-colors duration-300 group-hover:text-primary/[0.12]"
        >
          {step.n}
        </span>

        <motion.span
          initial={{ opacity: 0, scale: 0.4, rotate: -50 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: delay + 0.1 }}
          whileHover={{ scale: 1.12, rotate: 6 }}
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-primary shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition-shadow duration-300 group-hover:border-primary/40 group-hover:shadow-[0_6px_18px_-6px_rgba(31,94,255,0.4)]"
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>

        <h3 className="mt-5 text-[15px] font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-primary">
          {step.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {step.desc}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: EASE_PREMIUM, delay }}
      className="group relative flex items-start gap-5 pl-1"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.4, rotate: -50 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: delay + 0.1 }}
        whileHover={{ scale: 1.12, rotate: 6 }}
        className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-primary shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition-shadow duration-300 group-hover:border-primary/40 group-hover:shadow-[0_6px_18px_-6px_rgba(31,94,255,0.4)]"
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </motion.span>
      <div className="pt-1.5">
        <span className="text-[12px] font-bold tracking-wide text-primary/50 transition-colors duration-300 group-hover:text-primary/80">
          {step.n}
        </span>
        <h3 className="mt-1 text-[16px] font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-primary">
          {step.title}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}
