"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import PerformanceChart from "./PerformanceChart";
import { DASHBOARD_STATS } from "./data";

function DeltaBadge({ delta, direction }: { delta: string; direction: "up" | "down" }) {
  const Icon = direction === "up" ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
      <Icon aria-hidden strokeWidth={2.5} className="h-3 w-3" />
      {delta}
    </span>
  );
}

export default function PerformanceDashboard() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(11,31,58,0.06),0_32px_64px_-24px_rgba(11,31,58,0.35)] sm:p-8 2xl:mx-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,24,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,24,40,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-heading)] text-[18px] font-bold tracking-tight text-navy sm:text-[20px]">
            Amazon Sales Overview
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
            Last 12 months
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-line bg-bg/60 px-4 py-3.5"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft/60">
                <stat.icon aria-hidden strokeWidth={2} className="h-3 w-3 shrink-0 text-primary/70" />
                {stat.label}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-heading)] text-[18px] font-bold tracking-tight text-navy sm:text-[20px]">
                {stat.value}
              </p>
              <div className="mt-1.5">
                <DeltaBadge delta={stat.delta} direction={stat.direction} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 sm:mt-8">
          <PerformanceChart />
        </div>
      </div>
    </div>
  );
}
