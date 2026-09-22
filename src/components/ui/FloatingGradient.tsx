"use client";

import { motion, useReducedMotion } from "motion/react";

const BLOBS = [
  {
    className: "h-[560px] w-[560px] bg-gradient-to-br from-primary-bright to-primary opacity-45",
    style: { top: "-8%", right: "-4%" },
    animate: { x: [0, -90, 0], y: [0, 60, 0], scale: [1, 1.15, 1] },
    duration: 9,
  },
  {
    className: "h-[460px] w-[460px] bg-gradient-to-tr from-primary to-primary-dark opacity-40",
    style: { bottom: "-10%", left: "-4%" },
    animate: { x: [0, 80, 0], y: [0, -70, 0], scale: [1, 1.2, 1] },
    duration: 11,
  },
  {
    className: "h-[360px] w-[360px] bg-gradient-to-br from-gold to-gold-soft opacity-20",
    style: { top: "38%", left: "38%" },
    animate: { x: [0, 70, -70, 0], y: [0, -60, 60, 0], scale: [1, 1.1, 1] },
    duration: 13,
  },
];

/** Animated blurred blobs for a section background. Respects prefers-reduced-motion. */
export default function FloatingGradient() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[80px] ${blob.className}`}
          style={blob.style}
          animate={prefersReducedMotion ? undefined : blob.animate}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
