"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE_PREMIUM, fadeUp } from "@/lib/motion";

// Owl Carousel's default slide transition on canopymanagement.com's
// reference section: translateX over ~500ms with an ease-out-quad feel.
const SLIDE_EASE = [0.25, 0.46, 0.45, 0.94] as const;

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
      {/* Fixed-size slot keeps the connecting line centered; only the dot
          inside grows from a plain marker into a numbered, glowing circle
          when active, matching the reference's ::before pseudo-element. */}
      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
        <motion.span
          animate={{
            width: isActive ? 44 : 12,
            height: isActive ? 44 : 12,
            backgroundColor: isActive ? "rgba(201,162,39,1)" : "rgba(255,255,255,0.35)",
            boxShadow: isActive
              ? "0 0 0 6px rgba(201,162,39,0.18), 0 0 20px 4px rgba(201,162,39,0.45)"
              : "0 0 0 0 rgba(201,162,39,0)",
          }}
          transition={{ duration: 0.45, ease: EASE_PREMIUM }}
          className="flex items-center justify-center rounded-full"
        >
          <motion.span
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.4 }}
            transition={{
              duration: 0.25,
              delay: isActive ? 0.2 : 0,
              ease: EASE_PREMIUM,
            }}
            className="text-[13px] font-bold text-white"
          >
            {pad(index + 1)}
          </motion.span>
        </motion.span>
      </div>

      <div className="min-w-0 pt-1">
        <h3
          className={`text-2xl font-semibold transition-colors duration-500 sm:text-[26px] ${
            isActive ? "text-white" : "text-white/50"
          }`}
        >
          {item.title}
        </h3>
        {/* Accordion reveal, matching the reference's collapsed-title /
            expanded-active rhythm — grid-rows interpolation animates to the
            content's natural height without a JS measurement pass. */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p
              className={`max-w-md text-[17px] leading-relaxed text-white/75 transition-opacity duration-500 ${
                isActive ? "mt-3 opacity-100 delay-150" : "opacity-0"
              }`}
            >
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CadenceScroll({ items }: Readonly<CadenceScrollProps>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* Mobile / tablet — stacked */}
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

      {/* Desktop — image left, numbered timeline right. Both columns flow
          normally (no scroll-pin): the image still swaps to match whichever
          step is centered in view, it just doesn't try to stick to the
          screen while scrolling. That GSAP pin needed an inflated minimum
          height on the timeline column to give itself enough scroll runway
          to stay valid, which was the source of the oversized gaps and
          dead scroll space — removing the pin removes that need outright. */}
      <div className="hidden items-start gap-16 md:grid md:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div>
          {/* Not `sticky` — globals.css sets overflow-x:hidden on html/body
              (guarding the hero's 3D scene), which disables native sticky
              positioning for every descendant on the page, not just this
              one. The image just sits in normal flow instead. */}
          <div className="relative h-[60vh] max-h-[560px] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-2xl shadow-black/20">
            {/* Horizontal slide, mirroring the Owl Carousel used on the
                reference site: all frames sit side by side and the strip
                translates by one frame width per step (~500ms ease-out),
                instead of a crossfade. */}
            <motion.div
              className="flex h-full"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.5, ease: SLIDE_EASE }}
            >
              {items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="h-full w-full shrink-0">
                  <img
                    src={item.media}
                    alt={item.title}
                    className="h-full w-full rounded-[1.5rem] object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative py-2">
          {/* Static connector, matching the reference's always-fully-drawn
              line — the motion lives in the step markers, not the line. */}
          <div className="absolute left-[21px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-bright/50 to-gold/50" />

          <div className="flex flex-col gap-6">
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
