"use client";

import { motion } from "motion/react";
import { useCountUp } from "@/lib/useCountUp";
import { EASE_PREMIUM } from "@/lib/motion";
import { GROWTH_STATS, type GrowthStat } from "./data";

function StatBlock({ stat }: { stat: GrowthStat }) {
  const { ref, display } = useCountUp(stat.value);
  return (
    <div
      ref={ref as never}
      className="flex flex-col items-center gap-2 px-6 py-10 text-center sm:py-12"
    >
      <p className="font-[family-name:var(--font-heading)] text-[46px] font-extrabold leading-none tracking-tight text-navy sm:text-[56px]">
        +{Math.round(display)}%
      </p>
      <p className="mt-2 text-[15px] font-semibold text-ink">{stat.brand}</p>
      <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-soft/50">
        {stat.label}
      </p>
    </div>
  );
}

export default function GrowthStats() {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft/50"
      >
        Growth Since Working With Us
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
        className="mx-auto mt-6 grid max-w-5xl grid-cols-2 divide-x divide-line border-y border-line sm:grid-cols-4"
      >
        {GROWTH_STATS.map((stat) => (
          <StatBlock key={stat.brand} stat={stat} />
        ))}
      </motion.div>
    </div>
  );
}
