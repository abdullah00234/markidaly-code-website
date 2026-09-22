"use client";

import { motion } from "motion/react";
import { Users, Target, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import FounderNetworkBackground from "./ui/founder-network-bg";
import { EASE_PREMIUM, fadeUp, staggerContainer } from "@/lib/motion";

type Founder = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  // Short, scannable labels pulled from the bio, not invented additions.
  emphasis: string[];
};

// Equal length, equal structure — both founders are co-founders, and the
// content is deliberately matched in weight so neither reads as more senior.
const FOUNDERS: Founder[] = [
  {
    name: "Sameer Ahmad",
    initials: "SA",
    role: "Co-Founder",
    bio: "Sameer leads strategy, account operations, day-to-day account health, and client relationships at Markidly. He works directly with brands to find what's actually limiting an account's growth, and turns that into a plan the team executes together.",
    emphasis: ["Strategy", "Account Operations", "Account Health", "Client Relationships"],
  },
  {
    name: "Abu Bakar Adil",
    initials: "AA",
    role: "Co-Founder",
    bio: "Abu Bakar leads strategy and execution: advertising, PPC, inventory, and internal operations. He and Sameer shape every account's strategy together, and they stay hands-on with the brands and the specialist teams, turning that plan into measurable results, not just a report.",
    emphasis: ["Strategy", "PPC", "Inventory", "Operations"],
  },
];

type Principle = {
  title: string;
  note: string;
  icon: LucideIcon;
};

const PRINCIPLES: Principle[] = [
  { title: "Founder Involved", note: "Both founders stay directly involved in every account.", icon: Users },
  { title: "Strategy to Execution", note: "We don't just recommend, we execute and optimize.", icon: Target },
  { title: "Accountability First", note: "We take ownership of the plan and the results.", icon: ShieldCheck },
  { title: "Real Growth Focus", note: "Everything we do is built around profitable, sustainable growth.", icon: TrendingUp },
];

const cardVariants = {
  hidden: (i: number) => ({ opacity: 0, x: i === 0 ? -36 : 36, y: 16 }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
};

function PortraitPanel({ founder }: { founder: Founder }) {
  return (
    // Swap this block for a real <Image fill> of the founder once photography
    // exists — the fixed aspect box and dark treatment are already sized for it.
    <div className="relative w-full overflow-hidden bg-[linear-gradient(160deg,#0b1f3a_0%,#12305c_60%,#1646c9_140%)] sm:w-[260px] sm:shrink-0 lg:w-[300px]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary-bright/40 opacity-60 blur-[56px] transition-opacity duration-500 group-hover:opacity-100"
      />

      <span aria-hidden className="absolute left-5 top-5 h-6 w-px bg-white/25" />
      <span aria-hidden className="absolute left-5 top-5 h-px w-6 bg-white/25" />
      <span aria-hidden className="absolute bottom-5 right-5 h-6 w-px bg-white/25" />
      <span aria-hidden className="absolute bottom-5 right-5 h-px w-6 bg-white/25" />

      <div className="relative flex min-h-[200px] items-center justify-center py-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] sm:h-full sm:min-h-0 sm:py-0">
        <span className="font-[family-name:var(--font-heading)] text-[52px] font-extrabold tracking-tight text-white">
          {founder.initials}
        </span>
      </div>
    </div>
  );
}

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_20px_50px_-28px_rgba(11,31,58,0.2)] transition-shadow duration-500 hover:shadow-[0_28px_64px_-24px_rgba(31,94,255,0.3)] sm:flex-row"
    >
      <PortraitPanel founder={founder} />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          {founder.role}
        </span>
        <h3 className="mt-2 text-[24px] font-bold leading-tight text-navy sm:text-[26px]">
          {founder.name}
        </h3>
        <span
          aria-hidden
          className="mt-4 block h-[3px] w-10 rounded-full bg-gradient-brand transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-14"
        />

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {founder.emphasis.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-primary/80">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">
          {founder.bio}
        </p>
      </div>
    </motion.article>
  );
}

export default function Founders() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg py-24 lg:py-32">
      <FounderNetworkBackground />

      <div className="container-page relative">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>About / Founders</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]"
          >
            Founder-Led. <span className="text-gradient-brand">Still Hands-On.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft"
          >
            Markidly is founder-led, but it isn&rsquo;t a two-person
            operation. Sameer Ahmad and Abu Bakar Adil built a team of Amazon
            specialists around them, and both founders stay directly involved
            in every account, from strategy through execution, not just at
            the start.
          </motion.p>
        </motion.div>

        <div className="mx-auto mt-16 grid gap-8 lg:grid-cols-2">
          {FOUNDERS.map((founder, i) => (
            <FounderCard key={founder.name} founder={founder} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 }}
          className="mx-auto mt-8 grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-4 sm:divide-y-0"
        >
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex flex-col gap-2 p-5 sm:p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Icon aria-hidden strokeWidth={1.8} className="h-4 w-4" />
                </span>
                <p className="text-[14px] font-semibold text-navy">{p.title}</p>
                <p className="text-[12.5px] leading-snug text-ink-soft">{p.note}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
