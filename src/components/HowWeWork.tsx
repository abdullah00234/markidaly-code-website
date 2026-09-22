"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LineChart,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import CTAButton from "./ui/CTAButton";
import { EASE_PREMIUM } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Genuine process sequence — this numbering communicates order, not
// decoration, so it stays per the redesign brief.
const STEPS: { n: string; title: string; note: string; icon: LucideIcon }[] = [
  {
    n: "01",
    title: "Diagnose",
    note: "We look across the whole account: advertising, listings, conversion, inventory, pricing, and operations, to understand what's actually happening and where growth is being left on the table, not just the symptom you called us about.",
    icon: Search,
  },
  {
    n: "02",
    title: "Prioritize",
    note: "We don't try to fix everything at once. We start with what's costing you the most, whether that's wasted ad spend, underperforming top sellers, or operational issues putting revenue at risk, and work outward from there.",
    icon: SlidersHorizontal,
  },
  {
    n: "03",
    title: "Execute",
    note: "The right specialists work on the right problems, from advertising to listings to operations, from one shared plan, so nothing gets fixed in isolation.",
    icon: Zap,
  },
  {
    n: "04",
    title: "Measure & Refine",
    note: "We track what actually happens once changes go live and tell you what changed and why. An account is never done. It's managed.",
    icon: LineChart,
  },
  {
    n: "05",
    title: "Scale",
    note: "Once the account is stable, we increase investment in what's working, methodically, while protecting margin and operational stability. And where it makes sense, we go further than capturing existing demand: we help brands create new demand for their products, not just compete for what's already there.",
    icon: TrendingUp,
  },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.3"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  // GSAP ScrollTrigger drives which step reads as "active" while the
  // section scrolls — a restrained progression, not a scroll-jacked one.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const triggers = stepRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "center 70%",
        end: "center 35%",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section
      id="how-we-work"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full bg-primary-bright/15 blur-[110px]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="dark">Our Approach</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[40px]">
            A clear operating system for Amazon growth.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            The problems are different every time. Our approach isn&apos;t.
          </p>
        </div>

        <div className="relative mx-auto mt-20 max-w-3xl">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/15 sm:left-[23px]">
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

          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => {
              const isActive = activeIndex === i;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: i * 0.04 }}
                  className="relative flex items-start gap-6 pl-1 sm:gap-8"
                >
                  <motion.span
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-500 sm:h-12 sm:w-12 ${
                      isActive
                        ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_2px_rgba(201,162,39,0.4)]"
                        : "border-white/25 bg-white/10 text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
                  </motion.span>

                  <div
                    className={`group relative flex-1 overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-500 sm:p-6 ${
                      isActive
                        ? "border-gold/25 bg-white/[0.06] shadow-[0_0_44px_-14px_rgba(201,162,39,0.4)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <h3
                      className={`relative text-[19px] font-semibold transition-colors duration-500 sm:text-[21px] ${
                        isActive ? "text-white" : "text-white/85"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`relative mt-2 max-w-xl text-[14.5px] leading-relaxed transition-opacity duration-500 ${
                        isActive ? "text-white/65" : "text-white/50"
                      }`}
                    >
                      {step.note}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
          className="relative mx-auto mt-16 max-w-3xl text-center"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[60px]"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative">
            <CTAButton href="#book-audit" arrow>
              Book a Free Growth Audit
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
