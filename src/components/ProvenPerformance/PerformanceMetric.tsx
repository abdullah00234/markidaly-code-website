"use client";

import { useGsapCountUp } from "@/lib/useGsapCountUp";
import type { Metric } from "./data";

export default function PerformanceMetric({ metric }: { metric: Metric }) {
  const { ref, display } = useGsapCountUp(metric.value);
  const Icon = metric.icon;

  return (
    <div
      ref={ref as never}
      className="group rounded-2xl border border-black/10 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md sm:px-6 sm:py-7"
    >
      <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-black transition-all duration-300 group-hover:bg-primary/20">
        <Icon aria-hidden strokeWidth={2} className="h-5 w-5" />
      </span>
      <p className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-none tracking-tight text-black sm:text-[38px]">
        {metric.prefix}
        {display.toFixed(metric.decimals)}
        {metric.suffix}
      </p>
      <p className="mx-auto mt-3 max-w-[20ch] text-[13px] font-medium leading-snug text-black/70">
        {metric.label}
      </p>
    </div>
  );
}
