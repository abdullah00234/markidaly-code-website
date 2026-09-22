"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Blob = {
  rgb: string;
  cx: number;
  cy: number;
  p1: number;
  p2: number;
};

// Bloom Field mesh technique (21st.dev), rebuilt with the site's own brand
// blues only — no gold, light backdrop instead of navy. Each blob gets a
// static phase so its drift is continuous from t = 0 — no shared/random
// seed, no rounding, so nothing snaps when motion starts.
const BLOBS: Blob[] = [
  { rgb: "234, 240, 255", cx: 66, cy: 28, p1: 0.6, p2: 2.1 },
  { rgb: "76, 134, 255", cx: 20, cy: 66, p1: 3.4, p2: 0.9 },
  { rgb: "31, 94, 255", cx: 52, cy: 10, p1: 5.2, p2: 4.0 },
  { rgb: "22, 70, 201", cx: 82, cy: 84, p1: 1.8, p2: 5.8 },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")";

const VIGNETTE =
  "radial-gradient(circle at 50% 50%, rgba(11,31,58,0) 55%, rgba(11,31,58,0.06) 100%)";

function blobLayer(rgb: string, x: number, y: number) {
  return `radial-gradient(circle at ${x}% ${y}%, rgba(${rgb},0.5) 0%, rgba(${rgb},0.32) 20%, rgba(${rgb},0.14) 42%, rgba(${rgb},0.04) 62%, rgba(${rgb},0) 78%)`;
}

export default function BloomFieldGradient({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const paint = (ph: number) => {
      const blobLayers = BLOBS.map((b) => {
        const x = b.cx + (Math.sin(ph * 0.55 + b.p1) - Math.sin(b.p1)) * 14;
        const y = b.cy + (Math.sin(ph * 0.43 + b.p2) - Math.sin(b.p2)) * 14;
        return blobLayer(b.rgb, x, y);
      });
      el.style.backgroundImage = [GRAIN, VIGNETTE, ...blobLayers].join(", ");
    };

    if (prefersReducedMotion) {
      paint(0);
      return;
    }

    const start = performance.now();
    let raf = requestAnimationFrame(function loop(now) {
      paint((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundColor: "#f7f9fc",
        backgroundSize: "120px 120px, auto, auto, auto, auto, auto",
        backgroundBlendMode: "overlay, normal, normal, normal, normal, normal",
      }}
    />
  );
}
