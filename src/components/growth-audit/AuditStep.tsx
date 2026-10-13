"use client";

import { motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";
import type { AuditStep as AuditStepData } from "./steps";

type AuditStepProps = {
  step: AuditStepData;
  index: number;
  isLast: boolean;
  orientation: "horizontal" | "vertical";
};

export default function AuditStep({ step, index, isLast, orientation }: AuditStepProps) {
  const Icon = step.icon;
  const delay = 0.06 + index * 0.08;

  const badge = (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: delay + 0.06 }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-primary shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition-[box-shadow,border-color] duration-300 ease-out group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-8px_rgba(31,94,255,0.4)]"
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </motion.span>
  );

  if (orientation === "horizontal") {
    return (
      <motion.li
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM, delay }}
        className="group relative flex min-w-0 flex-1 flex-col items-center px-2 text-center"
      >
        {badge}
        <h3 className="mt-5 text-[15px] font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-primary">
          {step.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {step.desc}
        </p>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM, delay }}
      className="group flex gap-5 sm:gap-6"
    >
      <div className="flex flex-col items-center">
        {badge}
        {!isLast && <span className="mt-1 w-px flex-1 bg-line" aria-hidden />}
      </div>

      <div className={isLast ? "min-w-0 pb-0" : "min-w-0 pb-9"}>
        <h3 className="text-[17px] font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-primary sm:text-[18px]">
          {step.title}
        </h3>
        <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
          {step.desc}
        </p>
      </div>
    </motion.li>
  );
}
