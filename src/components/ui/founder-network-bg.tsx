"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";

// A handful of slow-floating dots — deliberately sparse and low-opacity so
// it reads as "connected network," not a starfield.
const PARTICLES = [
  { top: "10%", left: "6%", size: 3, duration: 15, delay: 0 },
  { top: "20%", left: "88%", size: 2, duration: 19, delay: 1.4 },
  { top: "70%", left: "12%", size: 2.5, duration: 17, delay: 2.6 },
  { top: "80%", left: "92%", size: 3, duration: 21, delay: 0.6 },
  { top: "42%", left: "50%", size: 2, duration: 16, delay: 3.2 },
  { top: "58%", left: "70%", size: 2.5, duration: 20, delay: 1.8 },
  { top: "30%", left: "32%", size: 2, duration: 18, delay: 2.2 },
];

const DOT_GRID_STYLE = {
  backgroundImage: "radial-gradient(rgba(31,94,255,0.4) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
};

/**
 * Decorative "premium data environment" backdrop for the Founders section —
 * a slow mesh sheen, floating particles, corner dot-grids, a drifting glow,
 * and a thin drawn connector line. Everything sits well under 10% opacity so
 * it never competes with the founder content in front of it.
 *
 * Fully inert under prefers-reduced-motion: only the static dot-grids remain.
 */
export default function FounderNetworkBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-8 -top-8 h-56 w-56 opacity-[0.35]"
        style={{ ...DOT_GRID_STYLE, maskImage: "radial-gradient(circle, black 0%, transparent 75%)" }}
      />
      <div
        className="absolute -right-8 -top-8 h-56 w-56 opacity-[0.35]"
        style={{ ...DOT_GRID_STYLE, maskImage: "radial-gradient(circle, black 0%, transparent 75%)" }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        style={{ ...DOT_GRID_STYLE, backgroundSize: "22px 22px", maskImage: "radial-gradient(ellipse, black 0%, transparent 72%)" }}
      />

      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, transparent 0%, rgba(31,94,255,0.5) 45%, transparent 55%, rgba(76,134,255,0.4) 75%, transparent 100%)",
            backgroundSize: "220% 220%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* radial-gradient, not blur() — this drifts forever via an infinite
          transform loop; animating a CSS blur that long re-rasterizes every
          frame for no visual gain over a gradient. */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(31,94,255,0.22) 0%, rgba(31,94,255,0) 70%)",
        }}
        animate={prefersReducedMotion ? undefined : { x: [0, 40, -30, 0], y: [0, -24, 18, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* One small gold counterpart to the blue glow above — this section
          introduces the founders, so it gets a touch of the same premium
          accent used elsewhere, kept to a single faint bloom. */}
      <motion.div
        className="absolute right-[8%] bottom-[6%] h-64 w-64 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 70%)",
        }}
        animate={prefersReducedMotion ? undefined : { x: [0, -20, 14, 0], y: [0, 16, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M60 330 C 190 260, 250 300, 330 220 S 500 150, 640 110"
          fill="none"
          stroke="rgba(31,94,255,0.28)"
          strokeWidth="1"
          strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: EASE_PREMIUM }}
        />
        {[
          { x: 60, y: 330 },
          { x: 330, y: 220 },
          { x: 640, y: 110 },
        ].map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="2.5" fill="rgba(31,94,255,0.45)" />
        ))}
      </svg>

      {!prefersReducedMotion &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary-bright"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -14, 0], opacity: [0.12, 0.4, 0.12] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
    </div>
  );
}
