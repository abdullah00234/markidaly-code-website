"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  TrendingDown,
  Megaphone,
  LayoutDashboard,
  MousePointerClick,
  Boxes,
  BarChart3,
  Layers,
  FileText,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import CTAButton from "./ui/CTAButton";
import ConnectedEcosystemVisual from "./ui/ConnectedEcosystemVisual";
import { EASE_PREMIUM, staggerContainer } from "@/lib/motion";

type PainPoint = {
  category: string;
  text: string;
  highlight: string;
  icon: LucideIcon;
};

// Real business problems, not generic marketing copy — each one is a
// specific symptom an established Amazon brand would recognize.
const PAIN_POINTS: PainPoint[] = [
  {
    category: "Sales / Margin",
    text: "Sales are steady, but margin keeps shrinking?",
    highlight: "margin",
    icon: TrendingDown,
  },
  {
    category: "Advertising",
    text: "You're spending more on ads and can't tell if it's actually working?",
    highlight: "ads",
    icon: Megaphone,
  },
  {
    category: "Reporting",
    text: "Your last agency sent reports, but nobody explained what to do next?",
    highlight: "reports",
    icon: LayoutDashboard,
  },
  {
    category: "Conversion",
    text: "Listings look fine, but conversion still isn't where it should be?",
    highlight: "conversion",
    icon: MousePointerClick,
  },
  {
    category: "Inventory",
    text: "You're guessing at inventory, and it's costing you rank?",
    highlight: "inventory",
    icon: Boxes,
  },
];

// Levers called out in the bridge statement, in reading order — used to
// bold each occurrence without hand-duplicating the sentence around them.
const EMPHASIZED_LEVERS = ["advertising", "listings", "inventory", "pricing"];

const BENEFITS = [
  { title: "Data-Driven", desc: "Decisions backed by insights", icon: BarChart3 },
  { title: "Full-Funnel Approach", desc: "Ads, listings, inventory & more", icon: Layers },
  { title: "Transparent Reporting", desc: "Clarity you can act on", icon: FileText },
  { title: "Growth Partners", desc: "We grow when you grow", icon: Users },
];

// Slightly heavier than the shared `fadeUp` — a touch of scale gives the
// card reveal more weight, appropriate for the section's larger surfaces.
const cardReveal: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_PREMIUM },
  },
};

function Highlighted({
  text,
  word,
  className,
}: {
  text: string;
  word: string;
  className: string;
}) {
  const idx = text.indexOf(word);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className={className}>{word}</strong>
      {text.slice(idx + word.length)}
    </>
  );
}

function BridgeStatement() {
  return (
    <p className="max-w-xl text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
      None of these are separate problems. They&rsquo;re usually the same
      problem showing up in different places, because on Amazon,{" "}
      {EMPHASIZED_LEVERS.map((lever, i) => (
        <span key={lever}>
          <strong className="font-semibold text-primary">{lever}</strong>
          {i < EMPHASIZED_LEVERS.length - 2
            ? ", "
            : i === EMPHASIZED_LEVERS.length - 2
              ? ", and "
              : ""}
        </span>
      ))}{" "}
      move together whether you&rsquo;re managing them together or not.
    </p>
  );
}

// Layered backdrop: a faint architectural grid fading toward the section
// edges plus two slow-drifting color blooms (brand blue + gold), echoing
// the dark hero grid without darkening this section. Purely decorative —
// gated behind reduced-motion since these are JS-driven transforms the
// global CSS `prefers-reduced-motion` override in globals.css can't catch.
function SectionBackdrop({ animate }: { animate: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,31,58,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,31,58,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <motion.div
        className="absolute -right-40 -top-24 h-[440px] w-[440px] rounded-full bg-primary/[0.09] blur-[120px]"
        animate={animate ? { x: [0, -26, 0], y: [0, 22, 0] } : undefined}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-28 bottom-0 h-[360px] w-[360px] rounded-full bg-gold/[0.12] blur-[100px]"
        animate={animate ? { x: [0, 24, 0], y: [0, -18, 0] } : undefined}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

export default function SoundFamiliar() {
  // Gate continuous transforms on `mounted` so the first client render
  // matches the server-rendered (motion-off) markup — same pattern as
  // ConnectedSystemVisual, to avoid a hydration mismatch.
  const reducedMotionRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const animateIdle = mounted && !reducedMotionRaw;

  return (
    <section
      aria-labelledby="sound-familiar-heading"
      className="relative isolate overflow-hidden bg-bg py-24 lg:py-32"
    >
      <SectionBackdrop animate={animateIdle} />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto max-w-2xl text-center"
        >
          <Eyebrow>Common Challenges. One Connected Problem.</Eyebrow>
          <h2
            id="sound-familiar-heading"
            className="font-[family-name:var(--font-heading)] text-[42px] font-extrabold leading-[1.02] tracking-tight text-navy sm:text-[52px] lg:text-[56px]"
          >
            Sound <span className="text-primary">Familiar?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">
            Most Amazon growth problems don&rsquo;t happen in isolation.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[11fr_9fr] lg:items-center lg:gap-16">
          <motion.ul
            variants={staggerContainer(0.09, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-3"
          >
            {PAIN_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <motion.li
                  key={point.text}
                  variants={cardReveal}
                  className="group relative flex items-center gap-4 rounded-2xl border border-line bg-white/80 px-4 py-5 shadow-[0_1px_2px_rgba(11,31,58,0.04)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_36px_-16px_rgba(31,94,255,0.28)] sm:gap-5 sm:px-5 sm:py-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-[#1c8bc2] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:text-black group-hover:shadow-[0_10px_22px_-8px_rgba(31,94,255,0.35)]">
                    <Icon aria-hidden strokeWidth={1.6} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary/50 transition-colors duration-300 group-hover:text-primary/80">
                      {point.category}
                    </p>
                    <p className="mt-1.5 text-[15px] font-medium leading-snug text-navy sm:text-[16.5px]">
                      <Highlighted
                        text={point.text}
                        word={point.highlight}
                        className="font-semibold text-primary"
                      />
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary/40 group-hover:bg-primary-light group-hover:text-primary sm:h-10 sm:w-10"
                  >
                    <ArrowUpRight strokeWidth={1.8} className="h-4 w-4" />
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.1 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-hero px-6 py-8 shadow-[0_1px_2px_rgba(11,31,58,0.05),0_28px_56px_-24px_rgba(31,94,255,0.18)] sm:px-8 sm:py-9"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-bright/20 blur-[70px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/[0.12] blur-[70px]"
            />
            <ConnectedEcosystemVisual className="relative" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 }}
          className="mx-auto mt-16 max-w-2xl text-center lg:mt-20"
        >
          <div
            aria-hidden
            className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
          <BridgeStatement />
          <div className="mx-auto mt-8 w-fit">
            <CTAButton href="#our-process" arrow>
              See Our Approach
            </CTAButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[0_1px_2px_rgba(11,31,58,0.04)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group flex items-start gap-3 bg-white px-6 py-7 transition-colors duration-300 hover:bg-primary-light/40 lg:px-7"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:bg-gradient-brand group-hover:text-black group-hover:shadow-[0_8px_18px_-6px_rgba(31,94,255,0.5)]">
                  <Icon aria-hidden strokeWidth={1.8} className="h-[17px] w-[17px]" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-navy">{b.title}</p>
                  <p className="text-[12.5px] leading-snug text-ink-soft">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
