"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE_PREMIUM } from "@/lib/motion";
import CaseStudySlide from "./CaseStudySlide";
import CaseStudiesCTA from "./CaseStudiesCTA";
import { CASE_STUDY_SLIDES } from "./data";

const AUTOPLAY_SECONDS = 7;
const SWIPE_THRESHOLD = 50;

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

export default function CaseStudySlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // WCAG 2.2.2: auto-advancing content needs a way to pause it that isn't
  // only "hover the mouse over it" (no keyboard/touch equivalent) — the
  // explicit button below covers that. A reduced-motion preference goes
  // further and disables autoplay outright until the visitor opts back in.
  const autoplayPaused = isPaused || userPaused || prefersReducedMotion;

  const total = CASE_STUDY_SLIDES.length;

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(((next % total) + total) % total);
  };

  const goNext = () => goTo(index + 1, 1);
  const goPrev = () => goTo(index - 1, -1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-8 lg:px-12">
      <div
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-hero p-6 shadow-[0_32px_72px_-40px_rgba(0,0,0,0.5)] sm:p-10 lg:p-14"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          >
            <CaseStudySlide slide={CASE_STUDY_SLIDES[index]} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous case study"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next case study"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2.5">
            <div className="flex w-full max-w-[220px] gap-1.5">
              {CASE_STUDY_SLIDES.map((slide, i) => (
                <div key={slide.brand} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  {i === index && (
                    <div
                      key={`${index}-fill`}
                      onAnimationEnd={() => {
                        if (!autoplayPaused) goNext();
                      }}
                      style={{
                        animationName: "case-progress",
                        animationDuration: `${AUTOPLAY_SECONDS}s`,
                        animationTimingFunction: "linear",
                        animationFillMode: "forwards",
                        animationPlayState: autoplayPaused ? "paused" : "running",
                      }}
                      className="h-full w-full origin-left bg-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
            aria-pressed={userPaused}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            {userPaused ? (
              <Play className="h-[16px] w-[16px]" strokeWidth={2} />
            ) : (
              <Pause className="h-[16px] w-[16px]" strokeWidth={2} />
            )}
          </button>
        </div>

        <CaseStudiesCTA />
      </div>
    </div>
  );
}
