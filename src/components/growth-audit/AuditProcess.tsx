"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import WorksWheel, {
  type WorksWheelHandle,
  type WorksWheelItem,
} from "../ui/works-wheel";
import { EASE_PREMIUM, fadeUp } from "@/lib/motion";
import { AUDIT_STEPS } from "./steps";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WHEEL_ITEMS: WorksWheelItem[] = AUDIT_STEPS.map((step) => ({
  number: step.n,
  title: step.title,
  description: step.desc,
  icon: step.icon,
}));

const STEP_COUNT = WHEEL_ITEMS.length;

// Keeps the panel's own navy gradient showing through a step's photo —
// a tinted blend rather than the photo fully replacing that background.
const IMAGE_BLEND_OPACITY = 0.5;

const GRID_OVERLAY_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

export default function AuditProcess() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const wheelHandleRef = useRef<WorksWheelHandle | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // Ring-to-drum reveal amount (0..1) from WorksWheel, so no image appears
  // while the wheel is still a ring with no step shown yet.
  const [revealAmount, setRevealAmount] = useState(0);
  // Continuous drum position from WorksWheel (1.4 = forty percent of the
  // way from step 2 to step 3, ...). Each image's opacity is a function of
  // its distance from this value, so one step's photo crossfades into the
  // next over the same span the cards themselves take to rotate — a smooth
  // fade synced to the turn, rather than a hard cut at the halfway point.
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Pins the panel for the scroll distance it takes to turn through all
    // five steps, then releases into whatever comes next (the CTA below) —
    // same "pin + scroll advances the steps" pattern as OurProcess.tsx,
    // restricted to tablet/desktop for the same reason: below that, a pinned
    // 3D wheel has no room to read, so matchMedia leaves mobile unpinned and
    // the plain stacked list (rendered below) takes over instead.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const pinDistance = window.innerHeight * 0.9 * STEP_COUNT;
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 88px",
        end: "+=" + pinDistance,
        pin: true,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate(self) {
          wheelHandleRef.current?.setProgress(self.progress * STEP_COUNT);
        },
      });
      triggerRef.current = st;

      return () => {
        st.kill();
        triggerRef.current = null;
      };
    });

    // See OurProcess.tsx for why this matters: content above this section
    // can still be inflating the document's height asynchronously after this
    // effect runs, which leaves the trigger's pixel offsets stale. A
    // ResizeObserver on <body> catches the real height change whenever it
    // happens instead of guessing how long it takes.
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
    if (!st) return;
    const progress = (index + 1) / STEP_COUNT;
    const y = st.start + progress * (st.end - st.start);
    if (window.__lenisInstance) {
      window.__lenisInstance.scrollTo(y, { duration: 0.8 });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div ref={sectionRef} className="relative mt-16 lg:mt-20">
      {/* Tablet/desktop: pinned, scroll-driven wheel (see the ScrollTrigger
          above) — nothing below this block is reachable by scrolling
          further while pinned. */}
      <div
        className="audit-wheel-viewport relative hidden overflow-hidden rounded-[32px] bg-gradient-hero md:block"
        // Chrome on high-DPI displays drops/corrupts compositor tiles on a
        // rounded-corner + overflow-hidden container when a descendant is a
        // large, constantly-repainting compositing layer — here, the pinned
        // (position: fixed) GSAP ScrollTrigger section wrapping WorksWheel,
        // whose cards write transform/opacity straight to the DOM every
        // frame behind backdrop-blur. Same bug and same fix as Hero.tsx:
        // clip-path (.audit-wheel-viewport in globals.css) instead of the
        // old mask-image hack, plus an isolated stacking context.
        style={{ isolation: "isolate" }}
      >
        {/* One layer per step with an image, crossfaded by opacity as the
            active step changes. Steps without an image yet just leave the
            bg-gradient-hero underneath showing. */}
        {AUDIT_STEPS.map((step, index) => {
          if (!step.image) return null;
          const closeness = Math.max(0, 1 - Math.abs(position - index));
          return (
            <Image
              key={step.n}
              src={step.image}
              alt=""
              fill
              priority={index === 0}
              sizes="(min-width: 768px) 100vw, 0vw"
              className="pointer-events-none absolute inset-0 object-cover"
              style={{
                opacity: closeness * revealAmount * IMAGE_BLEND_OPACITY,
              }}
            />
          );
        })}
        {/* Black tint over the photo itself, rather than letting it blend
            against the panel's blue gradient underneath. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_OVERLAY_STYLE}
        />
        <WorksWheel
          ref={wheelHandleRef}
          items={WHEEL_ITEMS}
          label="Growth Audit"
          onSelect={goToStep}
          onReveal={setRevealAmount}
          onPosition={setPosition}
          className="h-[480px] lg:h-[620px]"
        />
      </div>

      {/* Mobile: no pin — a plain stacked reveal, matching the mobile
          fallback CadenceScroll already uses for OurProcess. */}
      <div className="flex flex-col gap-5 md:hidden">
        {AUDIT_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: index * 0.06 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-hero p-5"
            >
              {step.image ? (
                <>
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="pointer-events-none absolute inset-0 object-cover"
                    style={{ opacity: IMAGE_BLEND_OPACITY }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-black/35"
                  />
                </>
              ) : null}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={GRID_OVERLAY_STYLE}
              />
              {/* Text sits on its own dark panel rather than a scrim over
                  the whole card, so the photo stays visible everywhere else. */}
              <div className="relative w-fit max-w-full rounded-xl bg-primary/70 p-3">
                <div className="flex items-center justify-end">
                  <Icon className="h-6 w-6 text-primary-bright/80" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-3 text-[17px] font-bold leading-snug text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
