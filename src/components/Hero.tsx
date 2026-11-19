"use client";

import { useEffect, useRef, useState } from "react";
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

  // This whole hero (and its WebGL scene) is desktop/tablet-only — mobile
  // gets HeroMobile.tsx instead, a plain static section with no canvas/GSAP
  // cost. `hidden md:block` below handles the visual swap with zero FOUC
  // (pure CSS, no JS needed), but without this check HeroScene would still
  // mount and run its full Three.js/ScrollTrigger setup underneath that
  // `hidden` class, wasting CPU/battery on a screen that never shows it. So
  // this also gates whether HeroScene mounts at all.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      ref={setSectionEl}
      className="hero-viewport relative hidden overflow-hidden rounded-b-[40px] sm:rounded-b-[56px] md:block lg:rounded-b-[72px]"
      // Chrome on high-DPI (Retina) displays drops/corrupts compositor
      // tiles on a rounded-corner + overflow-hidden container when a
      // descendant is a large, constantly-repainting compositing layer —
      // here, the GSAP-pinned (position: fixed) WebGL canvas. A mask-image
      // forces its own offscreen mask layer, which made this worse, not
      // better. clip-path (see .hero-viewport in globals.css) achieves the
      // same rounded-corner clipping without that extra layer; `isolation:
      // isolate` gives the section its own stacking context so the pinned
      // canvas composites against a stable backdrop.
      style={{ isolation: "isolate" }}
    >
      {/* Solid brand-gradient ground, no stock photography or dashboard
          screenshots — depth comes from the dot grid + the 3D scene layered
          on top. Both drift slowly via CSS (GPU-composited, no JS/WebGL
          cost) — this pairing IS the premium fallback background when
          WebGL is unavailable or the device is low-end (see HeroScene's
          canvas.style.display = "none" path), and adds a subtle extra
          touch of life underneath the 3D scene the rest of the time. */}
      <div aria-hidden className="absolute bg-gradient-hero-dark animate-hero-gradient" />
      {/* Faint gold corner glow — echoes the single gold "growth curve"
          payoff inside HeroScene itself, so the accent reads from the very
          first frame rather than only once the 3D scene scrolls into it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/[0.1] blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute opacity-[0.07] animate-hero-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {isDesktop && <HeroScene sectionEl={sectionEl} introRef={introRef} />}
      {/* Left-weighted scrim so copy stays readable over the scene without
          needing a separate boxed visual. The old 65% transparent-stop left
          a fully-unscrimmed gap right where the intro subtitle's own
          centered text column can land (its line wraps shift with viewport
          width/font metrics) — on several common MacBook widths a word
          lands directly over the bright core glow with zero darkening
          behind it. Extending the fade with a longer, lighter tail (through
          ~80%) covers that zone without meaningfully changing the scrim's
          left-weighted character or dimming the service-node panels, which
          already carry their own opaque background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(11,31,58,0.55)_0%,rgba(11,31,58,0.22)_48%,rgba(11,31,58,0.08)_68%,transparent_82%)]"
      />

      {/* 0% — Intro copy. Server-rendered; HeroScene fades/positions it via
          introRef as the other acts take over on scroll. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="container-page relative h-full">
          <div
            ref={introRef}
            className="hero-intro-copy absolute inset-0 flex items-start justify-center"
          >
            <div className="mx-auto max-w-[760px] px-4 text-center sm:px-6">
              {/* No backdrop-blur: this sits directly over the per-frame
                  WebGL canvas, and blur()ing a region that repaints every
                  frame forces the browser to recompute the blur every
                  frame too. A slightly more opaque flat background reads
                  the same without that cost. */}
              <div className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[rgba(20,45,80,0.55)] px-1.5 py-1.5">
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0b1f3a]">
                  Amazon Growth Agency
                </span>
              </div>
              <h1 className="hero-title text-[clamp(3rem,5.2vw,7rem)] font-black leading-[0.94] tracking-[-0.06em] text-hero-white">
                Built to Grow Brands on Amazon.
              </h1>
              <p className="hero-subtitle mx-auto mt-6 max-w-[760px] text-[clamp(1.05rem,1.8vw,1.55rem)] leading-relaxed text-hero-white">
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
