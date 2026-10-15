"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { EASE_PREMIUM, fadeUp } from "@/lib/motion";

// Owl Carousel's default slide transition on canopymanagement.com's
// reference section: translateX over ~500ms with an ease-out-quad feel.
const SLIDE_EASE = [0.25, 0.46, 0.45, 0.94] as const;

// The step list is pinned (see OurProcess.tsx) and driven entirely by
// scroll-scrubbed activeIndex changes — nothing scrolls the page further
// while pinned, so a plain tall column only ever shows its first couple of
// rows. Giving each row a fixed height and translating the whole stack
// vertically (mirroring the image panel's horizontal slide) keeps every
// step reachable: the active row is always brought into the visible window.
// The height itself is MEASURED (not a guessed px constant): the row's own
// content is sized in rem (text-2xl, the 4.5rem description box), so its
// rendered height scales with the root font-size — different on a browser
// with a non-default font-size/zoom setting. A hardcoded px height drifts
// out of sync with that in exactly those cases, desyncing the dots from
// the slide math. Measuring the real row via ResizeObserver stays correct
// regardless of root font-size.
const FALLBACK_ROW_HEIGHT = 140;
// 2 rather than 3: this column sits beside the image panel inside a pinned
// block (see OurProcess.tsx) whose total height has to fit inside the
// viewport, not just look good in isolation — 3 visible rows made this
// column taller than the image and pushed the whole pinned block past
// typical viewport heights, cutting content off with no way to scroll to it.
const VISIBLE_ROWS = 2;

type CadenceItem = {
  title: string;
  description: string;
  media: string;
};

export interface CadenceScrollProps {
  items: CadenceItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const CadenceRow = forwardRef<
  HTMLButtonElement,
  {
    item: CadenceItem;
    index: number;
    isActive: boolean;
    setActive: (i: number) => void;
  }
>(function CadenceRow({ item, index, isActive, setActive }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setActive(index)}
      className="group relative flex w-full cursor-pointer items-start gap-6 rounded-xl bg-transparent text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 sm:gap-8"
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
            isActive ? "text-white" : "text-white/50 group-hover:text-white/75"
          }`}
        >
          {item.title}
        </h3>
        {/* Fixed-height reveal: the description's space is always reserved
            (only opacity fades), so a row's rendered height never changes
            between active/inactive. A height that changes with content —
            e.g. a grid-rows collapse — would resize the pinned section
            while it's scroll-scrubbed, which retriggers ScrollTrigger's
            refresh mid-scroll and sends activeIndex into a feedback loop. */}
        <div className="mt-3 max-h-[4.5rem] min-h-[4.5rem] max-w-md overflow-hidden">
          <p
            className={`text-[17px] leading-relaxed text-white/75 transition-opacity duration-500 ${
              isActive ? "opacity-100 delay-150" : "opacity-0"
            }`}
          >
            {item.description}
          </p>
        </div>
      </div>
    </button>
  );
});

export function CadenceScroll({
  items,
  activeIndex,
  onSelect,
}: Readonly<CadenceScrollProps>) {
  const [rowHeight, setRowHeight] = useState(FALLBACK_ROW_HEIGHT);
  const firstRowRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = firstRowRef.current;
    if (!el) return;
    const measure = () => setRowHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keeps the active row pinned to the top of the visible window (so it
  // reads as "current step, next step preview"), clamped so the window
  // doesn't scroll past the last row once there's nothing left to preview.
  const idealOffset = -activeIndex * rowHeight;
  const minOffset = -Math.max(items.length - VISIBLE_ROWS, 0) * rowHeight;
  const rowOffset = Math.min(0, Math.max(idealOffset, minOffset));
  const listHeight = rowHeight * VISIBLE_ROWS;

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
            <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-white p-2">
              <Image
                src={item.media}
                alt={item.title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop — image left, numbered timeline right. The section is
          pinned (see OurProcess.tsx) while the user scrolls through the
          steps; activeIndex/onSelect are driven by that scroll-scrubbed
          ScrollTrigger, and a click jumps the scroll position to match. */}
      <div className="hidden items-start gap-16 md:grid md:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div>
          {/* Not `sticky` — globals.css sets overflow-x:hidden on html/body
              (guarding the hero's 3D scene), which disables native sticky
              positioning for every descendant on the page, not just this
              one. The image just sits in normal flow instead. */}
          <div className="relative h-[34vh] max-h-[320px] min-h-[260px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-2xl shadow-black/20">
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
                <div
                  key={`${item.title}-${index}`}
                  className="relative h-full w-full shrink-0"
                >
                  <Image
                    src={item.media}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 50vw"
                    className="rounded-[1.5rem] object-contain"
                    priority={index === 0}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden"
          style={{ height: listHeight }}
        >
          <motion.div
            animate={{ y: rowOffset }}
            transition={{ duration: 0.5, ease: SLIDE_EASE }}
            className="absolute inset-x-0 top-0"
          >
            {/* Connector spans the full stack and travels with it, matching
                the reference's always-fully-drawn line. */}
            <div
              aria-hidden
              className="absolute left-[21px] top-0 w-px bg-gradient-to-b from-primary-bright/50 to-gold/50"
              style={{ height: items.length * rowHeight }}
            />

            <div className="flex flex-col">
              {items.map((item, index) => (
                <CadenceRow
                  key={`${item.title}-${index}`}
                  ref={index === 0 ? firstRowRef : undefined}
                  item={item}
                  index={index}
                  isActive={activeIndex === index}
                  setActive={onSelect}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default CadenceScroll;
