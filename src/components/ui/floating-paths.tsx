"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";

// Sparse line count and a single whileInView draw-in (no infinite loop) —
// many continuously-animating paths were heavy enough to jank the page
// while scrolling, which read as the section "blinking."
const PATH_COUNT = 10;

// whileInView must live on this wrapper, not on individual <path> elements —
// a path's own bounding box can end up nowhere near the visible viewport
// depending on its geometry, so whileInView placed directly on a <path>
// can silently never fire. Framer propagates variant-driven animation to
// children automatically once this wrapper's own (perfectly normal)
// bounding box scrolls into view.
const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0, pathOffset: 0 },
  show: (id: number) => {
    const peakOpacity = 0.4 + id * 0.03;
    return {
      pathLength: 1,
      opacity: [0, peakOpacity, peakOpacity * 0.5, peakOpacity],
      // The traveling segment along each curve — this is what actually
      // reads as "moving," as opposed to a static line that just fades.
      pathOffset: [0, 1],
      transition: {
        pathLength: { duration: 1.6, delay: id * 0.1, ease: EASE_PREMIUM },
        opacity: {
          duration: 6,
          delay: id * 0.1,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        pathOffset: {
          duration: 12 + id * 1.5,
          delay: id * 0.1,
          repeat: Infinity,
          ease: "linear",
        },
      },
    };
  },
};

export function FloatingPathsBackground({
  position,
  children,
  className,
}: {
  position: number;
  className?: string;
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Percentage-space coordinates (viewBox is a plain 0-100 square) so every
  // curve maps 1:1 onto the container regardless of its aspect ratio or
  // height — nothing can end up scaled off into an off-screen bounding box.
  // Each is a gentle S-wave spread across a vertical band of the section.
  const paths = Array.from({ length: PATH_COUNT }, (_, i) => {
    const baseY = (i / (PATH_COUNT - 1)) * 100;
    const amplitude = (12 + i * 1.5) * (position >= 0 ? 1 : -1);
    return {
      id: i,
      d: `M -15 ${baseY} C 15 ${baseY - amplitude}, 35 ${baseY + amplitude}, 50 ${baseY} S 85 ${baseY - amplitude}, 115 ${baseY}`,
      // vector-effect="non-scaling-stroke" below means this is a literal
      // screen-pixel width, not a viewBox-relative unit.
      width: 1.5 + i * 0.2,
    };
  });

  return (
    <div className={cn("w-full relative", className)}>
      <motion.div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
      >
        <svg
          className="w-full h-full text-black"
          style={{ mixBlendMode: "overlay" }}
          viewBox="0 0 100 100"
          fill="none"
          preserveAspectRatio="none"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              custom={path.id}
              variants={pathVariants}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </motion.div>
      {children}
    </div>
  );
}
