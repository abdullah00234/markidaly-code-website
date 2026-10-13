"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Counts up to `value` once the element scrolls into view, driven by GSAP +
 * ScrollTrigger (per the Proof Bar animation spec) instead of a manual rAF
 * loop. Plays once, respects prefers-reduced-motion by snapping straight to
 * the final value instead of animating.
 */
export function useGsapCountUp(value: number, duration = 1.4) {
  const ref = useRef<HTMLElement>(null);
  // Initial state is the final value, not 0 — so SSR output, no-JS
  // fallback, crawlers, and the moment before the animation kicks in all
  // show the real number instead of a "$0M+" flash.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(counter.val),
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration]);

  return { ref, display };
}
