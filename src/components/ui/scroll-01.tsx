"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Scroll01Item = {
  title: string;
  description: string;
  media: string;
};

export interface Scroll01Props {
  items: Scroll01Item[];
}

const pad = (n: number) => String(n).padStart(2, "0");

function ScrollItem({
  item,
  index,
  setActive,
  isActive,
}: {
  item: Scroll01Item;
  index: number;
  setActive: Dispatch<SetStateAction<number>>;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 15%"],
  });

  // Continuous, scroll-linked fade instead of a hard on/off switch — the
  // text stays visible across most of the item's transit through the
  // viewport, not just a narrow center band, so scrolling never lands on
  // a stretch with nothing readable on screen.
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [24, 0, 0, -24]);

  // Drives which image is shown in the sticky pane. A scrollYProgress
  // threshold (checking for v between 0.4 and 0.6) only fires when an
  // animation frame happens to land inside that narrow window — a
  // normal-speed scroll can jump clean over it, leaving the image stuck on
  // whichever item last happened to trigger. An IntersectionObserver
  // watching a band at the viewport's vertical center checks real layout
  // geometry on every pass instead, so it can't be skipped the same way.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [index, setActive]);

  return (
    <motion.article
      ref={ref}
      style={{ opacity, y }}
      className="flex flex-col items-start text-left"
    >
      <span
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
          isActive ? "text-gold" : "text-white/30"
        }`}
      >
        {pad(index + 1)}
      </span>
      <h3 className="text-2xl font-semibold text-white sm:text-[26px]">
        {item.title}
      </h3>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
        {item.description}
      </p>
    </motion.article>
  );
}

export function Scroll01({ items }: Readonly<Scroll01Props>) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);

  // Overall progress through the text track, used for the thin progress
  // rail under the pinned image — a continuous readout to match the
  // continuous per-item fade, instead of jumping in six discrete steps.
  const { scrollYProgress: trackProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // CSS `position: sticky` doesn't take effect here: globals.css sets
  // `overflow-x: hidden` on html/body (intentionally, as a guard for the
  // hero's 3D scene), which Chromium treats as disqualifying the root as a
  // sticky-positioning container for descendants anywhere on the page.
  // GSAP ScrollTrigger's `pin` sidesteps that — it drives `position: fixed`
  // directly instead of relying on native sticky — and is already the
  // mechanism this codebase uses for the hero and "How We Work" scroll
  // effects, so it's used here too rather than fighting the CSS.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !gridRef.current || !paneRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top top+=96",
      end: "bottom bottom",
      pin: paneRef.current,
      pinSpacing: false,
      anticipatePin: 1,
    });

    // next/font loads with display:swap, so the fallback-to-webfont swap
    // can reflow text (and every section below it) after this trigger's
    // start/end pixel offsets were already measured. Refreshing once fonts
    // finish loading re-measures against final layout instead of a stale,
    // pre-swap one.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => trigger.kill();
  }, []);

  return (
    <>
      <div className="space-y-10 md:hidden">
        {items.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col items-start space-y-5 border-t border-white/15 pt-8"
          >
            <div className="space-y-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                0{index + 1}
              </p>
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>
            <img
              src={item.media}
              alt={item.title}
              className="h-72 w-full rounded-2xl bg-white object-contain"
            />
          </motion.article>
        ))}
      </div>

      <div ref={gridRef} className="hidden gap-10 md:grid md:grid-cols-2 lg:gap-16">
        <div ref={paneRef}>
          {/* Sticky pane needs an explicit height, not just max-h: every
              child is absolutely positioned, so with no normal-flow child
              to give the box intrinsic height, max-height alone can leave
              it at 0 in some layout contexts. */}
          <div className="relative h-[65vh] max-h-[640px] min-h-[460px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-2xl shadow-black/20">
            {items.map((item, index) => (
              <motion.img
                key={`${item.title}-${index}`}
                src={item.media}
                alt={item.title}
                className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-[1.5rem] object-contain"
                initial={{ opacity: index === 0 ? 1 : 0, scale: index === 0 ? 1 : 1.03 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 1.03,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-5">
            <p className="shrink-0 text-[12px] font-semibold tabular-nums tracking-[0.08em] text-white/60">
              {pad(activeIndex + 1)} / {pad(items.length)}
            </p>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-primary-bright to-gold"
                style={{ scaleX: trackProgress }}
              />
            </div>
          </div>
        </div>

        <div ref={trackRef} className="py-[20vh]">
          <div className="space-y-[16vh]">
            {items.map((item, index) => (
              <ScrollItem
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                setActive={setActiveIndex}
                isActive={activeIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Scroll01;
