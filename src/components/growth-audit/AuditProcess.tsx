"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import AuditStep from "./AuditStep";
import { AUDIT_STEPS } from "./steps";

export default function AuditProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="mt-16 lg:mt-20">
      {/* Desktop / large tablet: horizontal timeline */}
      <div className="relative hidden lg:grid lg:grid-cols-5 lg:gap-x-4">
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-6 h-px bg-line" aria-hidden>
          <motion.div
            style={{ scaleX: lineScale }}
            className="h-full w-full origin-left bg-gradient-to-r from-primary to-gold"
          />
        </div>

        {AUDIT_STEPS.map((step, i) => (
          <AuditStep key={step.n} step={step} index={i} orientation="horizontal" />
        ))}
      </div>

      {/* Tablet / mobile: vertical timeline */}
      <div className="relative mx-auto max-w-md lg:hidden">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-line" aria-hidden>
          <motion.div
            style={{ scaleY: lineScale }}
            className="h-full w-full origin-top bg-gradient-to-b from-primary to-gold"
          />
        </div>

        <div className="flex flex-col gap-10">
          {AUDIT_STEPS.map((step, i) => (
            <AuditStep key={step.n} step={step} index={i} orientation="vertical" />
          ))}
        </div>
      </div>
    </div>
  );
}
