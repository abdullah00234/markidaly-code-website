"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Target01Icon,
  FlashIcon,
  Analytics01Icon,
  Rocket01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// The five "How We Work" steps — same language used in the plain-English
// process copy. Right panel shows a large icon by default (no stock
// photography), except where a real illustration has been supplied.
const ITEMS = [
  {
    id: "diagnose",
    label: "Diagnose",
    icon: Search01Icon,
    image: "/images/diagnose-illustration.png",
    description:
      "We look across the whole account, not just the symptom you called about.",
  },
  {
    id: "prioritize",
    label: "Prioritize",
    icon: Target01Icon,
    description:
      "We start with what's costing you the most, then work outward from there.",
  },
  {
    id: "execute",
    label: "Execute",
    icon: FlashIcon,
    image: "/images/execute-illustration.png",
    description:
      "The right specialists work the right problems, from one shared plan.",
  },
  {
    id: "measure-refine",
    label: "Measure & Refine",
    icon: Analytics01Icon,
    image: "/images/measure-refine-illustration.png",
    description:
      "We track what changes and tell you why. An account is never done — it's managed.",
  },
  {
    id: "scale",
    label: "Scale",
    icon: Rocket01Icon,
    description:
      "Once the account is stable, we invest in what's working, methodically.",
  },
];

const AUTO_PLAY_INTERVAL = 3200;
const ITEM_HEIGHT = 60;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = ((step % ITEMS.length) + ITEMS.length) % ITEMS.length;

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + ITEMS.length) % ITEMS.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-hero shadow-[0_50px_120px_-40px_rgba(12,32,64,0.45)] lg:aspect-[16/9] lg:flex-row lg:rounded-[3.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-1/3 z-0 h-64 w-64 rounded-full bg-primary-bright/30 blur-[100px]"
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 z-0 h-56 w-56 rounded-full bg-white/40 blur-[110px]"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Left — cycling item chips */}
        <div className="relative z-30 flex min-h-[300px] w-full flex-col items-start justify-center overflow-hidden bg-gradient-hero px-8 md:min-h-[380px] md:px-14 lg:h-full lg:w-[38%] lg:pl-14">
          <div className="absolute inset-x-0 top-0 z-40 h-12 bg-gradient-to-b from-black via-black/70 to-transparent md:h-16" />
          <div className="absolute inset-x-0 bottom-0 z-40 h-12 bg-gradient-to-t from-black via-black/70 to-transparent md:h-16" />
          <div className="relative z-20 flex h-full w-full items-center justify-start">
            {ITEMS.map((item, index) => {
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(ITEMS.length / 2),
                ITEMS.length / 2,
                distance
              );
              const isActive = index === currentIndex;

              return (
                <motion.div
                  key={item.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-3.5 rounded-full border px-6 py-3 text-left shadow-none transition-all duration-700 md:px-7 md:py-3.5",
                      isActive
                        ? "z-10 border-transparent bg-gradient-brand text-white shadow-[0_8px_24px_-8px_rgba(31,94,255,0.6)]"
                        : "border-white/25 bg-gradient-to-br from-white/25 to-white/[0.04] text-white/70 backdrop-blur-sm hover:border-white/40 hover:from-white/35 hover:to-white/10 hover:text-white"
                    )}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={18}
                      strokeWidth={2}
                      className={isActive ? "text-white" : "text-white/40"}
                    />
                    <span className="whitespace-nowrap text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right — active item detail (custom icon, not stock photography) */}
        <div className="relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden px-6 py-14 md:min-h-[480px] md:px-12 lg:h-full">
          <div className="relative flex aspect-[4/5] w-full max-w-[420px] items-center justify-center">
            {ITEMS.map((item, index) => {
              const diff = index - currentIndex;
              const len = ITEMS.length;
              let normalizedDiff = diff;
              if (diff > len / 2) normalizedDiff -= len;
              if (diff < -len / 2) normalizedDiff += len;
              const status =
                normalizedDiff === 0
                  ? "active"
                  : normalizedDiff === -1
                    ? "prev"
                    : normalizedDiff === 1
                      ? "next"
                      : "hidden";
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.35 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 flex origin-center flex-col items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_24px_60px_-24px_rgba(11,31,58,0.3)]"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="(min-width: 1024px) 420px, 90vw"
                      className="object-contain p-6"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={48}
                        strokeWidth={1.5}
                        className="text-primary"
                      />
                    </div>
                  )}

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-8 pt-16"
                      >
                        <div className="mb-3 w-fit rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy shadow">
                          {String(index + 1).padStart(2, "0")} · {item.label}
                        </div>
                        <p className="text-[17px] font-medium leading-snug text-white">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
