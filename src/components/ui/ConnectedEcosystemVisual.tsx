"use client";

import {
  Megaphone,
  Package,
  BarChart3,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { EASE_PREMIUM, staggerContainer } from "@/lib/motion";

// Premium editorial 2x2 grid — deliberately not a glowing node-and-path
// "AI network" diagram. Hairline rails, corner survey marks and a quiet
// pointer-spotlight per cell read as print/spec-sheet, not SaaS dashboard.
type Quadrant = {
  label: string;
  desc: string;
  icon: LucideIcon;
};

const QUADRANTS: Quadrant[] = [
  { label: "Advertising", desc: "Drive profitable traffic", icon: Megaphone },
  { label: "Products", desc: "Right products, bigger opportunities", icon: Package },
  { label: "Data", desc: "Insights that drive action", icon: BarChart3 },
  { label: "Operations", desc: "Inventory, pricing, and supply chain", icon: Settings2 },
];

const cellVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
};

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "-left-[1px] -top-[1px]",
    tr: "-right-[1px] -top-[1px]",
    bl: "-left-[1px] -bottom-[1px]",
    br: "-right-[1px] -bottom-[1px]",
  }[position];
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute z-20 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 text-white/40 ${pos}`}
    >
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function QuadrantCell({ q }: { q: Quadrant }) {
  const Icon = q.icon;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      variants={cellVariants}
      onPointerMove={handlePointerMove}
      className="group relative flex flex-col gap-3 overflow-hidden px-5 py-6 sm:px-6 sm:py-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(160px circle at var(--mx) var(--my), rgba(76,134,255,0.18), transparent 72%)",
        }}
      />

      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_8px_18px_-6px_rgba(31,94,255,0.5)]">
        <Icon aria-hidden strokeWidth={1.6} className="h-4 w-4" />
      </span>

      <div className="relative z-10">
        <p className="font-[family-name:var(--font-heading)] text-[14.5px] font-bold leading-snug text-white">
          {q.label}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-white/60">{q.desc}</p>
      </div>
    </motion.div>
  );
}

export default function ConnectedEcosystemVisual({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[400px]">
        <CornerMark position="tl" />
        <CornerMark position="tr" />
        <CornerMark position="bl" />
        <CornerMark position="br" />

        <div className="mb-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            One Connected System
          </p>
        </div>

        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 divide-x divide-y divide-white/10 rounded-2xl border border-white/10"
        >
          {QUADRANTS.map((q) => (
            <QuadrantCell key={q.label} q={q} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
