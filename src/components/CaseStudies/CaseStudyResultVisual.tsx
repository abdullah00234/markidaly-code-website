"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCountUp } from "@/lib/useCountUp";
import { EASE_PREMIUM } from "@/lib/motion";
import type { CaseStudySlideData } from "./data";

// Shared frame every result visual renders inside — the subtle grid, border,
// and radius are the one constant across slides; only the content changes.
function VisualCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_24px_56px_-32px_rgba(16,24,40,0.18)] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,24,40,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,24,40,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// Hand-authored ascending curve (not plotted from real data points) — an
// abstract stand-in for "advertising + listings + pricing moving together",
// per the "no Amazon screenshots / no stock imagery" requirement.
const CHART_PATH =
  "M4,90 C34,86 52,80 76,70 C102,58 118,64 142,50 C168,36 182,42 206,26 C230,10 250,16 286,4";

const CHART_INDICATORS = [
  { label: "Advertising", left: "20%", top: "62%" },
  { label: "Listings", left: "50%", top: "42%" },
  { label: "Pricing", left: "80%", top: "16%" },
];

function RevenueGraphVisual({ slide }: { slide: Extract<CaseStudySlideData, { visual: "revenue-graph" }> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15% 0px" });
  const { ref: revenueRef, display: revenueDisplay } = useCountUp(slide.revenue, 1.8);
  const { ref: yoyRef, display: yoyDisplay } = useCountUp(slide.yoy, 1.8);

  return (
    <div ref={containerRef}>
      <VisualCard>
        <div className="flex items-baseline justify-between gap-4">
          <div ref={revenueRef as never}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/50">
              {slide.revenueLabel}
            </p>
            <p className="mt-1 font-[family-name:var(--font-heading)] text-[30px] font-extrabold tracking-tight text-navy sm:text-[36px]">
              ${Math.round(revenueDisplay).toLocaleString()}
            </p>
          </div>
          <span
            ref={yoyRef as never}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-[13px] font-bold text-primary"
          >
            +{yoyDisplay.toFixed(1)}% YoY
          </span>
        </div>

        <div className="relative mt-8 h-[170px] w-full sm:h-[210px]">
          <svg
            viewBox="0 0 290 100"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
            aria-hidden
          >
            {[20, 40, 60, 80].map((y) => (
              <line key={y} x1="0" y1={y} x2="290" y2={y} stroke="rgba(16,24,40,0.06)" strokeWidth="1" />
            ))}
            <defs>
              <linearGradient id="csvChartGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4c86ff" />
                <stop offset="100%" stopColor="#1f5eff" />
              </linearGradient>
            </defs>
            <motion.path
              d={CHART_PATH}
              fill="none"
              stroke="url(#csvChartGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: EASE_PREMIUM, delay: 0.2 }}
            />
          </svg>

          {CHART_INDICATORS.map((indicator, i) => (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: 0.6 + i * 0.15 }}
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1.5"
              style={{ left: indicator.left, top: indicator.top }}
            >
              <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/15" />
              <span className="whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-soft shadow-sm">
                {indicator.label}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft/40">
          Advertising + Listings + Pricing = Revenue Growth
        </p>
      </VisualCard>
    </div>
  );
}

function FlowNode({ label, delay, inView }: { label: string; delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE_PREMIUM, delay }}
      className="rounded-xl border border-line bg-white px-4 py-3 text-center text-[13.5px] font-semibold text-ink-soft shadow-sm"
    >
      {label}
    </motion.div>
  );
}

function FlowConnector({ delay, inView }: { delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={inView ? { opacity: 1, scaleY: 1 } : {}}
      transition={{ duration: 0.4, ease: EASE_PREMIUM, delay }}
      className="mx-auto h-6 w-px origin-top bg-line"
    />
  );
}

function InventoryFlowVisual({ slide }: { slide: Extract<CaseStudySlideData, { visual: "inventory-flow" }> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15% 0px" });
  const steps = slide.flow.slice(0, -1);
  const finalStep = slide.flow[slide.flow.length - 1];

  return (
    <div ref={containerRef}>
      <VisualCard>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/50">
            Result
          </p>
          <p className="mt-1 font-[family-name:var(--font-heading)] text-[30px] font-extrabold tracking-tight text-navy sm:text-[36px]">
            {slide.resultValue}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={step} className="w-full max-w-[220px]">
              <FlowNode label={step} delay={0.15 + i * 0.15} inView={inView} />
              <FlowConnector delay={0.25 + i * 0.15} inView={inView} />
            </div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: 0.15 + steps.length * 0.15 }}
            className="w-full max-w-[220px] rounded-xl bg-gradient-brand px-4 py-3 text-center text-[14px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(31,94,255,0.5)]"
          >
            {finalStep}
          </motion.div>
        </div>

        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft/40">
          {slide.resultLabel}
        </p>
      </VisualCard>
    </div>
  );
}

function OptimizationFlowVisual({ slide }: { slide: Extract<CaseStudySlideData, { visual: "optimization-flow" }> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15% 0px" });

  return (
    <div ref={containerRef}>
      <VisualCard>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/50">
            Result
          </p>
          <p className="mt-1 font-[family-name:var(--font-heading)] text-[30px] font-extrabold tracking-tight text-navy sm:text-[36px]">
            {slide.resultValue}
          </p>
        </motion.div>

        <div className="mx-auto mt-8 flex max-w-[220px] flex-col items-center gap-2">
          {slide.inputs.map((input, i) => (
            <div key={input} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: 0.1 + i * 0.12 }}
                className="rounded-xl border border-line bg-white px-4 py-3 text-center text-[13.5px] font-semibold text-ink-soft shadow-sm"
              >
                {input}
              </motion.div>
              {i < slide.inputs.length - 1 && (
                <p className="py-1 text-center text-[13px] font-bold text-primary/50" aria-hidden>
                  +
                </p>
              )}
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE_PREMIUM, delay: 0.1 + slide.inputs.length * 0.12 }}
            className="mt-2 h-px w-full origin-center bg-line"
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: 0.2 + slide.inputs.length * 0.12 }}
            className="mt-3 w-full rounded-xl bg-gradient-brand px-4 py-3 text-center text-[14px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(31,94,255,0.5)]"
          >
            Growth
          </motion.div>
        </div>

        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft/40">
          {slide.resultLabel}
        </p>
      </VisualCard>
    </div>
  );
}

export default function CaseStudyResultVisual({ slide }: { slide: CaseStudySlideData }) {
  switch (slide.visual) {
    case "revenue-graph":
      return <RevenueGraphVisual slide={slide} />;
    case "inventory-flow":
      return <InventoryFlowVisual slide={slide} />;
    case "optimization-flow":
      return <OptimizationFlowVisual slide={slide} />;
  }
}
