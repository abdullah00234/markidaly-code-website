"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CadenceScroll } from "./ui/cadence-scroll";
import { GradientWave } from "./ui/gradient-wave";
import Eyebrow from "./ui/Eyebrow";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = {
  items: [
    {
      title: "Diagnose",
      description:
        "Deep dive into your account, data, and marketplace reality to identify what's really holding growth back.",
      media: "/images/diagnose-illustration.png",
    },
    {
      title: "Prioritize",
      description:
        "Focus on the highest-impact opportunities across advertising, listings, operations, and profitability.",
      media: "/images/prioritize-illustration.png",
    },
    {
      title: "Execute",
      description:
        "Implement a clear, coordinated plan across all key areas of your Amazon business.",
      media: "/images/execute-illustration.png",
    },
    {
      title: "Measure & Refine",
      description:
        "Track what's working, cut what's not, and continuously optimize for stronger, more profitable performance.",
      media: "/images/measure-refine-illustration.png",
    },
    {
      title: "Scale",
      description:
        "Once the foundation is strong, we help you scale sustainably with a proven, repeatable growth system.",
      media: "/images/scale-illustration.png",
    },
  ],
};

const STEP_COUNT = phases.items.length;

export default function OurProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Pins the section for the scroll distance it takes to step through all
    // five phases, then releases into the next section — matching the
    // "pin + scroll advances the steps" behavior requested, rather than
    // the earlier click-only version.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const pinDistance = window.innerHeight * 0.9 * (STEP_COUNT - 1);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 88px",
        end: "+=" + pinDistance,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate(self) {
          const idx = Math.round(self.progress * (STEP_COUNT - 1));
          setActiveIndex((prev) => (prev === idx ? prev : idx));
        },
      });
      triggerRef.current = st;

      return () => {
        st.kill();
        triggerRef.current = null;
      };
    });

    // Everything above this section — the hero's own ~300vh ScrollTrigger
    // pin chief among them — can still be inflating the document's height
    // after this effect runs (the hero's pin is created behind its 3D
    // scene's own async asset setup, on its own timeline, which can take
    // longer than any fixed guess to finish on a slow connection/device).
    // Left unrefreshed, this trigger's pixel offsets stay based on the
    // pre-inflation document height: it thinks it has already scrolled
    // past "end" long before the page has actually reached it, so it
    // un-pins immediately, and the section sits stranded hundreds of
    // pixels below whatever's currently on screen — a large blank gap.
    // A ResizeObserver on <body> reacts to the actual height change
    // whenever it happens, rather than guessing how long it'll take.
    const doRefresh = () => {
      const st = triggerRef.current;
      if (st && !st.isActive) st.refresh();
    };
    const resizeObserver = new ResizeObserver(doRefresh);
    resizeObserver.observe(document.body);
    window.addEventListener("load", doRefresh);

    return () => {
      mm.revert();
      resizeObserver.disconnect();
      window.removeEventListener("load", doRefresh);
    };
  }, []);

  const goToStep = (index: number) => {
    const st = triggerRef.current;
    if (!st) {
      setActiveIndex(index);
      return;
    }
    const progress = STEP_COUNT > 1 ? index / (STEP_COUNT - 1) : 0;
    const y = st.start + progress * (st.end - st.start);
    if (window.__lenisInstance) {
      window.__lenisInstance.scrollTo(y, { duration: 0.8 });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="our-process"
      className="relative overflow-hidden bg-gradient-hero py-10 lg:py-12"
    >
      <GradientWave
        className="pointer-events-none"
        colors={["#0b1f3a", "#0c78b8", "#1793c6", "#0b1f3a", "#16294a", "#0c78b8"]}
        darkenTop
        shadowPower={6}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="dark">Our Process</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[40px]">
            Every account moves through the same five steps.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/60">
            A clear, repeatable system — from diagnosing what's holding you
            back to scaling what works.
          </p>
        </div>

        {/* Pinned on desktop (see the ScrollTrigger above) at a fixed
            distance below the navbar — unlike a normal section, nothing
            below this block is reachable by scrolling further while
            pinned, so the block's total height (padding + heading + this
            gap + the image/steps row) has to fit inside the viewport, not
            just look good in one. Kept tight for that reason. */}
        <div className="mt-6 lg:mt-8">
          <CadenceScroll
            items={phases.items}
            activeIndex={activeIndex}
            onSelect={goToStep}
          />
        </div>
      </div>
    </section>
  );
}
