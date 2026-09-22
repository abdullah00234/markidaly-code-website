"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// The 3D scene is client-only (WebGL) and non-trivial in size, so it's
// code-split out of the main bundle. The gradient + dot-grid backdrop
// already in this file renders immediately underneath it, so there's a
// graceful base state with no dedicated loading fallback needed.
//
// All copy, CTAs, and act choreography now live inside HeroScene itself —
// the whole hero is one continuous scroll-driven sequence (intro -> SEO ->
// PPC -> Creative -> Account Management -> Growth), so the text has to be
// timed against the same scrollProgress driving the camera, not mounted
// once and left static.
const HeroScene = dynamic(() => import("./hero/HeroScene"), { ssr: false });

export default function Hero() {
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);

  return (
    <section
      ref={setSectionEl}
      className="relative h-screen overflow-hidden rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px]"
    >
      {/* Solid brand-gradient ground, no stock photography or dashboard
          screenshots — depth comes from the dot grid + the 3D scene layered
          on top. Both drift slowly via CSS (GPU-composited, no JS/WebGL
          cost) — this pairing IS the premium fallback background when
          WebGL is unavailable or the device is low-end (see HeroScene's
          canvas.style.display = "none" path), and adds a subtle extra
          touch of life underneath the 3D scene the rest of the time. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-hero animate-hero-gradient" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] animate-hero-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <HeroScene sectionEl={sectionEl} />
      {/* Left-weighted scrim so copy stays readable over the scene without
          needing a separate boxed visual. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(11,31,58,0.55)_0%,rgba(11,31,58,0.15)_42%,transparent_65%)]"
      />
    </section>
  );
}
