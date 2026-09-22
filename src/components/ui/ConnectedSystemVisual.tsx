"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Megaphone, Package, BarChart3, Settings2, TrendingUp, type LucideIcon } from "lucide-react";
import { EASE_PREMIUM, fadeUp, staggerContainer } from "@/lib/motion";

// Abstract "connected commerce system" visual — replaces stock photography /
// fake dashboard screenshots with a custom-built node network representing
// the four levers Markidly manages together around a central Growth hub.
// Deliberately not a chart of real numbers or an Amazon UI mockup — every
// value here is decorative geometry, not data.
type SystemNode = {
  key: string;
  label: string;
  desc?: string;
  icon: LucideIcon;
  cx: number;
  cy: number;
  accent?: boolean;
};

const NODES: SystemNode[] = [
  { key: "advertising", label: "Advertising", desc: "Drive profitable traffic", icon: Megaphone, cx: 90, cy: 90 },
  { key: "products", label: "Products", desc: "Right products, bigger opportunities", icon: Package, cx: 330, cy: 60 },
  { key: "data", label: "Data", desc: "Insights that drive action", icon: BarChart3, cx: 380, cy: 260 },
  { key: "operations", label: "Operations", desc: "Inventory, pricing, and supply chain", icon: Settings2, cx: 150, cy: 320 },
  { key: "growth", label: "Growth", icon: TrendingUp, cx: 235, cy: 190, accent: true },
];

const OUTER_NODES = NODES.filter((n) => !n.accent);
const CENTER = NODES.find((n) => n.accent)!;

// Every non-center node connects into the central Growth node — the visual
// claim being made is structural ("these move together"), not a data claim.
const LINKS = OUTER_NODES.map((n) => ({ from: n, to: CENTER }));

export default function ConnectedSystemVisual({ className = "" }: { className?: string }) {
  // Gate the resolved value on `mounted` (not the hook call itself — hooks
  // must run unconditionally) so the very first client render matches the
  // server-rendered markup, which always assumes motion is allowed.
  // `useReducedMotion` can resolve synchronously on the client when the
  // media query is already set, which otherwise causes a hydration mismatch
  // on the pulse-ring circles below.
  const reducedMotionRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const prefersReducedMotion = mounted ? reducedMotionRaw : false;

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] w-full">
        <svg
          aria-hidden
          viewBox="0 0 470 380"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="csv-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4c86ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="csv-node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4c86ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4c86ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {LINKS.map((link, i) => (
            <g key={link.from.key}>
              <motion.line
                x1={link.from.cx}
                y1={link.from.cy}
                x2={link.to.cx}
                y2={link.to.cy}
                stroke="url(#csv-line)"
                strokeWidth="1.5"
                strokeDasharray="3 6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE_PREMIUM, delay: 0.3 + i * 0.12 }}
              />
              {/* Connection points — where each lever visually "plugs in" to Growth */}
              <motion.circle
                cx={link.from.cx}
                cy={link.from.cy}
                r={3}
                fill="#4c86ff"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE_PREMIUM, delay: 0.35 + i * 0.12 }}
                style={{ transformOrigin: `${link.from.cx}px ${link.from.cy}px` }}
              />
            </g>
          ))}

          {NODES.map((node, i) => {
            const Icon = node.icon;
            const r = node.accent ? 38 : 26;
            return (
              <g key={node.key}>
                <circle cx={node.cx} cy={node.cy} r={r + 22} fill="url(#csv-node-glow)" />
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={r}
                  fill={node.accent ? "#0b1f3a" : "rgba(255,255,255,0.06)"}
                  stroke={node.accent ? "#c9a227" : "rgba(255,255,255,0.25)"}
                  strokeWidth={node.accent ? 1.75 : 1.25}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 + i * 0.1 }}
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                />
                {!prefersReducedMotion && (
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r={r}
                    fill="none"
                    stroke={node.accent ? "#c9a227" : "#4c86ff"}
                    strokeWidth="1"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: [0.45, 0, 0.45], scale: [1, 1.35, 1] }}
                    transition={{
                      duration: node.accent ? 3.2 : 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                    style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                  />
                )}
                <foreignObject
                  x={node.cx - (node.accent ? 26 : 12)}
                  y={node.cy - (node.accent ? 26 : 12)}
                  width={node.accent ? 52 : 24}
                  height={node.accent ? 52 : 24}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <Icon
                      className={node.accent ? "h-5 w-5 text-gold" : "h-3.5 w-3.5 text-white/80"}
                      strokeWidth={1.75}
                    />
                    {node.accent && (
                      <span className="text-[11px] font-bold leading-none text-white">{node.label}</span>
                    )}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
        A Connected Amazon Ecosystem
      </p>

      <motion.ul
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
      >
        {OUTER_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <motion.li key={node.key} variants={fadeUp} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-primary-bright">
                <Icon aria-hidden strokeWidth={1.75} className="h-[15px] w-[15px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white">{node.label}</p>
                <p className="text-[12px] leading-snug text-white/55">{node.desc}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
