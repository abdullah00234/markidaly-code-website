"use client";

import { motion } from "motion/react";
import Eyebrow from "../ui/Eyebrow";
import PerformanceMetric from "./PerformanceMetric";
import PerformanceDashboard from "./PerformanceDashboard";
import CategoriesCard from "./CategoriesCard";
import GrowthResultCard from "./GrowthResultCard";
import { staggerContainer, fadeUp, EASE_PREMIUM } from "@/lib/motion";
import { METRICS } from "./data";

export default function ProvenPerformance() {
  return (
    <section className="bg-bg py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-hero px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-primary-bright/[0.14] blur-[130px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-gold/[0.1] blur-[110px]"
          />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM }}
              className="mx-auto max-w-[850px] text-center"
            >
              <Eyebrow tone="dark">Proven Performance</Eyebrow>
              <h2 className="font-[family-name:var(--font-heading)] text-[34px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[44px] lg:text-[52px]">
                Real Amazon accounts. Real constraints. Measurable progress.
              </h2>
              <p className="mx-auto mt-5 max-w-[720px] text-[15.5px] leading-relaxed text-white/75 sm:text-[16px]">
                Across brands in grocery and gourmet food, skincare and
                beauty, health and wellness, supplements, home goods, and
                specialty consumer products.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer(0.1, 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4"
            >
              {METRICS.map((metric) => (
                <motion.div key={metric.label} variants={fadeUp}>
                  <PerformanceMetric metric={metric} />
                </motion.div>
              ))}
            </motion.div>

            <div className="relative mx-auto mt-16 max-w-4xl pb-6 pt-2 lg:mt-24 lg:pb-10 lg:pt-4 xl:flex xl:max-w-[1550px] xl:items-center xl:gap-6 xl:pb-0 xl:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.25 }}
                // Flex item instead of absolute positioning: a fixed negative
                // offset (the old approach) only clears the dashboard at one
                // exact viewport width and clips or overlaps at any other —
                // including the very common 1536px-wide 1920x1080-at-125%-
                // scaling case. Flex reflows naturally at any width >= xl.
                className="relative z-20 mt-6 xl:order-1 xl:mt-0 xl:shrink-0 xl:-translate-y-6"
              >
                <CategoriesCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                className="xl:order-2 xl:min-w-0 xl:flex-1"
              >
                <PerformanceDashboard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.35 }}
                className="relative z-20 mt-6 xl:order-3 xl:mt-0 xl:shrink-0 xl:translate-y-6"
              >
                <GrowthResultCard />
              </motion.div>

              <svg
                aria-hidden
                className="pointer-events-none absolute -bottom-2 right-24 z-10 hidden h-24 w-32 lg:block"
                viewBox="0 0 130 100"
                fill="none"
              >
                <path
                  d="M4,4 C40,10 70,40 110,70 C118,76 122,82 126,92"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1.5"
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                />
                <path
                  d="M118,84 L126,92 L128,80"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
