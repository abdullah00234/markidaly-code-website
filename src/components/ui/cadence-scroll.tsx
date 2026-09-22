"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_PREMIUM, fadeUp } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CadenceItem = {
  title: string;
  description: string;
  media: string;
};

export interface CadenceScrollProps {
  items: CadenceItem[];
}

const pad = (n: number) => String(n).padStart(2, "0");

function CadenceRow({
  item,
  index,
  isActive,
  setActive,
}: {
  item: CadenceItem;
  index: number;
  isActive: boolean;
  setActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Centered-band observer, same technique as scroll-01 — a scrollYProgress
  // threshold check can be skipped entirely by a fast scroll, an
  // IntersectionObserver watching real layout geometry can't be.
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
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="relative flex items-start gap-6 sm:gap-8"
    >
      <motion.span
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold backdrop-blur-sm transition-all duration-500 sm:h-12 sm:w-12 ${
          isActive
            ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_2px_rgba(201,162,39,0.4)]"
            : "border-white/25 bg-white/10 text-white/70"
        }`}
      >
        {pad(index + 1)}
      </motion.span>

      <div className="min-w-0 pt-1">
        <h3
          className={`text-2xl font-semibold transition-colors duration-500 sm:text-[26px] ${
            isActive ? "text-white" : "text-white/60"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`mt-3 max-w-md leading-relaxed transition-all duration-500 ${
            isActive
              ? "text-[18px] text-white/75"
              : "text-[15px] text-white/40"
          }`}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function CadenceScroll({ items }: Readonly<CadenceScrollProps>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: trackProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const lineScale = useTransform(trackProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(trackProgress, [0, 1], ["0%", "100%"]);
  const dotOpacity = useTransform(trackProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  // Same pin workaround documented in scroll-01.tsx: globals.css sets
  // overflow-x:hidden on html/body (guarding the hero's 3D scene), which
  // disqualifies native `position: sticky` for descendants anywhere on the
  // page. GSAP's pin drives `position:fixed` directly instead.
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

    return () => trigger.kill();
  }, []);

  return (
    <>
      {/* Mobile / tablet — stacked, no pin */}
      <div className="space-y-14 md:hidden">
        {items.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col items-start gap-5"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-gold/15 text-[13px] font-bold text-gold shadow-[0_0_20px_2px_rgba(201,162,39,0.4)]">
                {pad(index + 1)}
              </span>
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-white/60">
              {item.description}
            </p>
            <img
              src={item.media}
              alt={item.title}
              className="h-72 w-full rounded-2xl bg-white object-contain p-2"
            />
          </motion.div>
        ))}
      </div>

      {/* Desktop — pinned image left, numbered timeline right */}
      <div
        ref={gridRef}
        className="hidden gap-16 md:grid md:grid-cols-[0.85fr_1fr] lg:gap-20"
      >
        <div ref={paneRef}>
          <div className="relative h-[60vh] max-h-[560px] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-2xl shadow-black/20">
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
                transition={{ duration: 0.5, ease: EASE_PREMIUM }}
              />
            ))}
          </div>
        </div>

        <div ref={trackRef} className="relative py-[8vh]">
          <div className="absolute left-[21px] top-2 bottom-2 w-px bg-white/15">
            <motion.div
              style={{ scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-primary-bright to-gold"
            />
            <motion.div
              aria-hidden
              style={{ top: dotTop, opacity: dotOpacity }}
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_16px_4px_rgba(201,162,39,0.65)]"
            />
          </div>

          <div className="flex flex-col gap-16">
            {items.map((item, index) => (
              <CadenceRow
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                isActive={activeIndex === index}
                setActive={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CadenceScroll;
