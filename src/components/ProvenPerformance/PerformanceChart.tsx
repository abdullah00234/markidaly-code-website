"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";
import { CHART_MONTHS, REVENUE_SERIES, AD_SALES_SERIES } from "./data";

const WIDTH = 600;
const HEIGHT = 200;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;
const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

function toPoints(series: number[]) {
  const step = WIDTH / (series.length - 1);
  return series.map((v, i) => {
    const x = i * step;
    const y = PAD_TOP + (1 - v / 100) * PLOT_H;
    return [x, y] as const;
  });
}

// Smooths a polyline into a cubic-bezier path (simple midpoint control
// points) so the trend reads as a curve rather than a jagged line.
function smoothPath(points: readonly (readonly [number, number])[]) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const midX = (x0 + x1) / 2;
    d += ` C${midX},${y0} ${midX},${y1} ${x1},${y1}`;
  }
  return d;
}

const GRID_LINES = [0.25, 0.5, 0.75];

export default function PerformanceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const revenuePoints = toPoints(REVENUE_SERIES);
  const adSalesPoints = toPoints(AD_SALES_SERIES);
  const revenuePath = smoothPath(revenuePoints);
  const adSalesPath = smoothPath(adSalesPoints);
  const areaPath = `${revenuePath} L${WIDTH},${HEIGHT - PAD_BOTTOM} L0,${HEIGHT - PAD_BOTTOM} Z`;

  return (
    <div ref={containerRef}>
      <div className="mb-4 flex items-center gap-5">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Revenue
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft/70">
          <span className="h-2 w-2 rounded-full border-[1.5px] border-navy/40" />
          Ad Sales
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-[170px] w-full overflow-visible sm:h-[210px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="ppChartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4c86ff" />
            <stop offset="100%" stopColor="#1f5eff" />
          </linearGradient>
          <linearGradient id="ppChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f5eff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1f5eff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {GRID_LINES.map((g) => (
          <line
            key={g}
            x1="0"
            y1={PAD_TOP + g * PLOT_H}
            x2={WIDTH}
            y2={PAD_TOP + g * PLOT_H}
            stroke="rgba(16,24,40,0.07)"
            strokeWidth="1"
          />
        ))}

        <motion.path
          d={areaPath}
          fill="url(#ppChartArea)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.5 }}
        />

        <motion.path
          d={adSalesPath}
          fill="none"
          stroke="rgba(11,31,58,0.32)"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.3, ease: EASE_PREMIUM, delay: 0.15 }}
        />

        <motion.path
          d={revenuePath}
          fill="none"
          stroke="url(#ppChartLine)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.3, ease: EASE_PREMIUM }}
        />
      </svg>

      <div className="mt-2 flex justify-between">
        {CHART_MONTHS.map((m) => (
          <span key={m} className="text-[10px] font-medium text-ink-soft/45">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
