"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

// Eases toward `value` once the element scrolls into view, then holds.
export function useCountUp(value: number, duration = 1.6) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf: number;
    const start = performance.now();
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setDisplay(value * easeOutExpo(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return { ref, display };
}
