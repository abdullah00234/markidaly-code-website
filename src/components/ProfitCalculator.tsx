"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import CTAButton from "./ui/CTAButton";
import { EASE_PREMIUM } from "@/lib/motion";

const REVENUE_MIN = 10_000;
const REVENUE_MAX = 250_000;
const REVENUE_STEP = 5_000;

const SPEND_MIN = 2_000;
const SPEND_MAX = 60_000;
const SPEND_STEP = 1_000;

// Eases from the previous value to the next on every slider change, instead
// of only animating once on scroll-into-view (see useCountUp/useGsapCountUp).
function AnimatedValue({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const end = value;
    if (start === end) return;

    const duration = 350;
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        previous.current = end;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </>
  );
}

export default function ProfitCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(45_000);
  const [adSpend, setAdSpend] = useState(12_000);

  const currentAcos = Math.round((adSpend / monthlyRevenue) * 100);
  const estimatedWastedSpend = Math.round(adSpend * 0.28);
  const projectedAnnualGain = Math.round(monthlyRevenue * 0.38) * 12;

  const acosTextTone =
    currentAcos > 30 ? "text-red-600" : currentAcos > 20 ? "text-primary" : "text-emerald-600";
  const acosBarTone =
    currentAcos > 30 ? "bg-red-500" : currentAcos > 20 ? "bg-primary" : "bg-emerald-500";

  return (
    <section id="profit-calculator" className="bg-white py-24 lg:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          >
            <Eyebrow>Interactive Profit Estimator</Eyebrow>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.08 }}
            className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]"
          >
            How Much Amazon Revenue Are You{" "}
            <span className="text-gradient-brand">Leaving on the Table?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft"
          >
            Adjust the sliders below to estimate your current wasted ad spend
            and project your 90-day growth potential with Markidly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
          className="relative mt-14 overflow-hidden rounded-[32px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(11,31,58,0.06),0_32px_64px_-24px_rgba(11,31,58,0.35)] sm:p-10 lg:mt-16 lg:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,24,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,24,40,0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Controls */}
            <div>
              <h3 className="flex items-center gap-2 text-[19px] font-bold text-navy sm:text-[21px]">
                <Calculator aria-hidden strokeWidth={2} className="h-5 w-5 text-primary" />
                Your Current Store Baseline
              </h3>

              <div className="mt-8">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <label htmlFor="monthly-revenue" className="text-[13.5px] font-semibold text-ink">
                    Current Monthly Amazon Revenue
                  </label>
                  <span className="text-[20px] font-extrabold text-primary">
                    <AnimatedValue value={monthlyRevenue} prefix="$" />
                  </span>
                </div>
                <input
                  id="monthly-revenue"
                  type="range"
                  min={REVENUE_MIN}
                  max={REVENUE_MAX}
                  step={REVENUE_STEP}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary"
                />
                <div className="mt-1.5 flex justify-between text-[12px] font-medium text-ink-soft/70">
                  <span>$10,000/mo</span>
                  <span>$250,000+/mo</span>
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <label htmlFor="ad-spend" className="text-[13.5px] font-semibold text-ink">
                    Current Monthly PPC Ad Spend
                  </label>
                  <span className="text-[20px] font-extrabold text-primary">
                    <AnimatedValue value={adSpend} prefix="$" />
                  </span>
                </div>
                <input
                  id="ad-spend"
                  type="range"
                  min={SPEND_MIN}
                  max={SPEND_MAX}
                  step={SPEND_STEP}
                  value={adSpend}
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary"
                />
                <div className="mt-1.5 flex justify-between text-[12px] font-medium text-ink-soft/70">
                  <span>$2,000/mo</span>
                  <span>$60,000+/mo</span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-line bg-bg/60 p-5">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <span className="text-[13.5px] font-semibold text-ink-soft">
                    Implied Advertising Cost of Sales (ACoS)
                  </span>
                  <span className={`text-[18px] font-extrabold ${acosTextTone}`}>
                    <AnimatedValue value={currentAcos} suffix="%" />
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full transition-[width,background-color] duration-300 ease-out ${acosBarTone}`}
                    style={{ width: `${Math.min(100, (currentAcos / 60) * 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap justify-between gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.04em]">
                  <span className="text-emerald-600">Optimal (&lt;20%)</span>
                  <span className="text-primary">Target (20–30%)</span>
                  <span className="text-red-600">High Bleed (&gt;30%)</span>
                </div>
              </div>
            </div>

            {/* Projection */}
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-hero p-7 text-white sm:p-9">
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/60">
                Audit Projection Summary
              </p>
              <h4 className="mt-1.5 text-[20px] font-extrabold tracking-tight sm:text-[22px]">
                Your 90-Day Optimization Window
              </h4>

              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                  <TrendingDown aria-hidden strokeWidth={2.25} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-white/65">
                    Est. Monthly Wasted Ad Spend
                  </p>
                  <p className="whitespace-nowrap text-[17px] font-extrabold text-red-300 sm:text-[22px]">
                    <AnimatedValue value={estimatedWastedSpend} prefix="$" suffix="/mo" />
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <TrendingUp aria-hidden strokeWidth={2.25} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-white/65">
                    Projected Additional Annual Revenue
                  </p>
                  <p className="whitespace-nowrap text-[17px] font-extrabold text-emerald-300 sm:text-[22px]">
                    <AnimatedValue value={projectedAnnualGain} prefix="+$" />
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <CTAButton href="#book-audit" variant="primary" arrow className="w-full">
                  Request My Free Audit
                </CTAButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
