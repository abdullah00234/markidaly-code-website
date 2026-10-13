"use client";

import { motion } from "motion/react";
import {
  Users,
  Workflow,
  ShieldCheck,
  Briefcase,
  Network,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import ParticlesBackground from "./ui/particles-bg";
import { EASE_PREMIUM, staggerContainer } from "@/lib/motion";

// Approved copy — verbatim, not rewritten. Presentation only has changed.
const values: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Senior Strategy & Founder Involvement",
    description:
      "Sameer and Abu Bakar are personally involved in the strategy and execution behind every account, working alongside the specialist team. You won't be handed off after the sales call.",
    icon: Users,
  },
  {
    title: "One Shared Plan, Not Silos",
    description:
      "At a lot of agencies, PPC, listings, and compliance are run by separate departments that barely talk to each other. At Markidly, every specialist works from the same plan, on the same account, together.",
    icon: Workflow,
  },
  {
    title: "Profitability Alongside Growth",
    description:
      "We report on what actually protects your margin, not just what makes a campaign look good on paper. A \"performing\" ad account can still be losing you money, and we watch for that.",
    icon: ShieldCheck,
  },
  {
    title: "Practical Amazon Experience",
    description:
      "Markidly was built by people who've run real Amazon accounts, not just managed ad budgets.",
    icon: Briefcase,
  },
  {
    title: "An Integrated View of Your Account",
    description:
      "On Amazon, a problem in one area rarely stays contained. A stockout undoes a great ad campaign, and a slow listing undoes a great PPC strategy.",
    icon: Network,
  },
  {
    title: "Transparent Communication",
    description:
      "You'll always know what we're doing, why we're doing it, and what happens next.",
    icon: MessageCircle,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_PREMIUM },
  },
};

export default function WhyMarkidly() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32">
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="border-b border-white/15 pb-12"
        >
          <Eyebrow tone="dark">Why Markidly</Eyebrow>
          <h2 className="max-w-4xl font-[family-name:var(--font-heading)] text-[clamp(2.4rem,5.5vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight text-white">
            What actually changes when we run your account?
          </h2>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-white/55">
              The difference is not another dashboard. It is how the whole
              account gets seen, managed, and improved.
            </p>
            <span className="shrink-0 text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-white/45 sm:text-right">
              Ways we work differently
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-[#f7f9fc] p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_44px_-14px_rgba(31,94,255,0.4)] sm:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/90 via-transparent to-navy/[0.05]"
                />
                <div className="relative z-10 mb-6 flex items-start justify-between">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-navy/20 bg-navy/5 text-navy transition-all duration-500 group-hover:border-primary group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-[0_0_20px_2px_rgba(31,94,255,0.4)]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-navy/30 transition-colors duration-500 group-hover:text-primary">
                    {pad(index + 1)}
                  </span>
                </div>
                <h3 className="relative z-10 text-[19px] font-semibold leading-snug text-primary sm:text-[20px]">
                  {item.title}
                </h3>
                <p className="relative z-10 mt-3 text-[14.5px] leading-relaxed text-ink">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
