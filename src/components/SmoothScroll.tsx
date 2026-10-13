"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Bridges Lenis's smooth scroll to GSAP ScrollTrigger so scrubbed/pinned
// effects (e.g. the hero's scroll-driven scene) track the smoothed scroll
// position instead of drifting a frame behind it.
function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.2, anchors: { offset: 88 } }}
    >
      <LenisScrollTriggerBridge />
    </ReactLenis>
  );
}
