"use client";

import { motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import { useGsapCountUp } from "@/lib/useGsapCountUp";
import { staggerContainer, fadeUp, EASE_PREMIUM } from "@/lib/motion";

type Stat = {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
};

// The one approved Proof Bar — verified figures only. No ratings or review
// platforms are shown here; that section was removed as unsupported.
const STATS: Stat[] = [
  { value: 30, decimals: 0, prefix: "$", suffix: "M+", label: "Revenue Managed" },
  { value: 11, decimals: 0, prefix: "$", suffix: "M+", label: "Amazon Ad Sales Generated" },
  { value: 1.8, decimals: 1, prefix: "$", suffix: "M+", label: "Advertising Spend Optimized" },
  { value: 6, decimals: 0, prefix: "", suffix: "x", label: "Weighted ROAS Delivered" },
];

function StatBlock({ stat }: { stat: Stat }) {
  const { ref, display } = useGsapCountUp(stat.value);
  return (
    <div
      ref={ref as never}
      className="group px-4 py-4 text-center transition-transform duration-300 sm:px-6 sm:py-0 sm:hover:-translate-y-0.5"
    >
      <p className="font-[family-name:var(--font-heading)] text-[36px] font-extrabold leading-none tracking-tight text-white transition-colors duration-300 sm:text-[42px]">
        {stat.prefix}
        {display.toFixed(stat.decimals)}
        {stat.suffix}
      </p>
      <p className="mx-auto mt-3 max-w-[20ch] text-[13px] font-medium leading-snug text-white">
        {stat.label}
      </p>
    </div>
  );
}

export default function BrandResults() {
  return (
    <section className="bg-bg py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-hero px-6 py-12 sm:px-10 sm:py-14 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM }}
              className="mx-auto max-w-2xl text-center"
            >
              <Eyebrow tone="dark">Proven Performance</Eyebrow>
              <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[36px]">
                Real Amazon accounts. Real constraints. Measurable progress.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
                Across brands in grocery and gourmet food, skincare and
                beauty, health and wellness, supplements, home goods, and
                specialty consumer products.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer(0.1, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mx-auto mt-8 flex max-w-4xl flex-col divide-y divide-white/10 sm:mt-10 sm:flex-row sm:divide-x sm:divide-y-0"
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="flex-1">
                  <StatBlock stat={stat} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
