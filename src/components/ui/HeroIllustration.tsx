"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";

// Custom illustration standing in for "Amazon growth" — deliberately built from
// generic commerce icons (chart, cart, target, package) rather than Amazon's
// own logo/smile-arrow mark, which would be a trademark issue on a
// non-affiliated agency's marketing site.
const ICONS = [
  {
    key: "growth",
    label: "Growth",
    position: "left-[4%] top-[6%]",
    lineEnd: { x: 76, y: 80 },
    floatDelay: 0,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0C78B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 19V13M10 19V9M16 19V5" />
        <path d="M14 5h5v5" />
        <path d="M19 5l-7 7-3-3-5 5" />
      </svg>
    ),
  },
  {
    key: "cart",
    label: "Conversion",
    position: "right-[2%] top-[18%]",
    lineEnd: { x: 308, y: 128 },
    floatDelay: 0.6,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0C78B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="9" cy="20" r="1" fill="#0C78B8" stroke="none" />
        <circle cx="18" cy="20" r="1" fill="#0C78B8" stroke="none" />
        <path d="M3 4h2l2.2 11a2 2 0 002 1.6h7.6a2 2 0 002-1.7L20 8H6.4" />
      </svg>
    ),
  },
  {
    key: "target",
    label: "Strategy",
    position: "left-[10%] bottom-[8%]",
    lineEnd: { x: 100, y: 292 },
    floatDelay: 1.2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0C78B8" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="#0C78B8" stroke="none" />
      </svg>
    ),
  },
  {
    key: "package",
    label: "Product",
    position: "right-[8%] bottom-[2%]",
    lineEnd: { x: 292, y: 316 },
    floatDelay: 1.8,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0C78B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12v9M12 12l8-4.5M12 12L4 7.5" />
      </svg>
    ),
  },
];

export default function HeroIllustration() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
      <svg
        aria-hidden
        viewBox="0 0 380 380"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {ICONS.map((item) => (
          <line
            key={item.key}
            x1={item.lineEnd.x}
            y1={item.lineEnd.y}
            x2="190"
            y2="190"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}
        <circle cx="190" cy="190" r="4" fill="white" fillOpacity="0.4" />
      </svg>

      {ICONS.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 16 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: [0, -14, 0] }
          }
          transition={{
            opacity: { duration: 0.6, ease: EASE_PREMIUM, delay: 0.3 + i * 0.12 },
            y: prefersReducedMotion
              ? { duration: 0.6, ease: EASE_PREMIUM, delay: 0.3 + i * 0.12 }
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.floatDelay,
                },
          }}
          className={`absolute flex w-[108px] flex-col items-center gap-2 rounded-2xl border border-line/60 bg-white px-4 py-4 text-center shadow-[0_16px_32px_-12px_rgba(0,0,0,0.35)] ${item.position}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0C78B8]/10">
            {item.icon}
          </span>
          <span className="text-[11px] font-semibold text-navy">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
