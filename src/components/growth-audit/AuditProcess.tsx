"use client";

import { useEffect, useRef } from "react";
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

const GRID_OVERLAY_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

export default function AuditProcess() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const wheelHandleRef = useRef<WorksWheelHandle | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

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
        scrub: true,
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
        className="relative hidden overflow-hidden rounded-[32px] bg-gradient-hero md:block"
        // WebKit (Safari on macOS/iOS) flickers/strobes on a rounded-corner +
        // overflow-hidden container when a descendant gets its own
        // compositing layer that repaints every frame — here, the pinned
        // (position: fixed) GSAP ScrollTrigger section wrapping WorksWheel,
        // whose cards write transform/opacity straight to the DOM every
        // frame behind backdrop-blur. Same bug and same fix as Hero.tsx:
        // force WebKit onto its mask-based clip path instead of its
        // border-radius clip path. The mask is fully opaque so nothing is
        // visually cropped. No-op on non-WebKit browsers.
        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
      >
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
          className="h-[480px] lg:h-[620px]"
        />
      </div>

      {/* Mobile: no pin — a plain stacked reveal, matching the mobile
          fallback CadenceScroll already uses for OurProcess. */}
      <div className="flex flex-col gap-5 md:hidden">
        {WHEEL_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: index * 0.06 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-hero p-5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={GRID_OVERLAY_STYLE}
              />
              <div className="relative flex items-center justify-end">
                <Icon className="h-6 w-6 text-primary-bright/80" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="relative mt-3 text-[17px] font-bold leading-snug text-white">
                {item.title}
              </h3>
              <p className="relative mt-1.5 text-[14px] leading-relaxed text-white/65">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
