"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import CTAButton from "./ui/CTAButton";

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
  // Owned here (not inside HeroScene) so the headline is part of the
  // server-rendered HTML even though the 3D scene around it is client-only
  // (dynamic(..., { ssr: false }) below) — crawlers and no-JS clients still
  // get a real <h1>. HeroScene still drives this element's scroll-linked
  // fade/position directly via the ref, exactly as if it owned the node.
  const introRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={setSectionEl}
      className="relative h-screen overflow-hidden rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px]"
      // WebKit (Safari on both macOS and iOS) flickers/strobes on a
      // rounded-corner + overflow-hidden container when a descendant gets
      // its own compositing layer that repaints every frame — here, the
      // GSAP-pinned (position: fixed) WebGL canvas plus the animated
      // background-position gradient layers above. Forcing WebKit onto its
      // mask-based clip path instead of its border-radius clip path avoids
      // that repaint bug; the mask is fully opaque so nothing is visually
      // cropped. No-op on non-WebKit browsers.
      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      {/* Solid brand-gradient ground, no stock photography or dashboard
          screenshots — depth comes from the dot grid + the 3D scene layered
          on top. Both drift slowly via CSS (GPU-composited, no JS/WebGL
          cost) — this pairing IS the premium fallback background when
          WebGL is unavailable or the device is low-end (see HeroScene's
          canvas.style.display = "none" path), and adds a subtle extra
          touch of life underneath the 3D scene the rest of the time. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-hero-dark animate-hero-gradient" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] animate-hero-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <HeroScene sectionEl={sectionEl} introRef={introRef} />
      {/* Left-weighted scrim so copy stays readable over the scene without
          needing a separate boxed visual. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(11,31,58,0.55)_0%,rgba(11,31,58,0.15)_42%,transparent_65%)]"
      />

      {/* 0% — Intro copy. Server-rendered; HeroScene fades/positions it via
          introRef as the other acts take over on scroll. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="container-page relative h-full">
          <div
            ref={introRef}
            className="absolute inset-0 flex items-start justify-center pt-28 md:pt-32 lg:pt-40"
          >
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-1.5 py-1.5 backdrop-blur-sm">
                <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-black">
                  Amazon Growth Agency
                </span>
              </div>
              <h1 className="text-[44px] font-black leading-[1.14] tracking-tight text-hero-white sm:text-[54px] lg:text-[60px]">
                Built to Grow Brands on Amazon.
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-[19px] leading-relaxed text-hero-white">
                We combine strategy, data, creative, and performance
                marketing to help Amazon brands scale profitably.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
                <CTAButton
                  href="#book-audit"
                  arrow
                  className="hover:!bg-none hover:!bg-black hover:!brightness-100"
                >
                  Get Your Growth Audit
                </CTAButton>
                <CTAButton href="#services" variant="outline-dark" arrow>
                  Explore Services
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
