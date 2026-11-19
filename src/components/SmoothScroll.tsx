"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pinned/scrubbed ScrollTrigger sections compute their pixel offsets off
// document height, which can shift once web fonts swap in (FOUT -> real
// font reflows text). Refreshing once fonts are ready keeps those offsets
// (and the hero's pin end point) accurate without a layout-thrashing poll.
if (typeof document !== "undefined") {
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
}

declare global {
  interface Window {
    // Lenis itself owns `window.lenis` (devtools metadata) — this holds the
    // actual instance for components outside the provider tree to drive
    // scroll position programmatically (see OurProcess.tsx's click-to-jump).
    __lenisInstance?: Lenis;
  }
}

// Bridges Lenis's smooth scroll to GSAP ScrollTrigger so scrubbed/pinned
// effects (e.g. the hero's scroll-driven scene) track the smoothed scroll
// position instead of drifting a frame behind it. GSAP's ticker is the ONLY
// thing driving lenis.raf — ReactLenis's own autoRaf is turned off below, or
// Lenis would get ticked twice per frame (once by its internal rAF loop,
// once here), doubling scroll-math work on every single frame.
function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.__lenisInstance = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      delete window.__lenisInstance;
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll() {
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        anchors: { offset: 88 },
        smoothWheel: !isCoarsePointer,
        syncTouch: false,
      }}
    >
      <LenisScrollTriggerBridge />
    </ReactLenis>
  );
}
