"use client";

import { motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import { EASE_PREMIUM } from "@/lib/motion";

type OnboardingStep = {
  n: string;
  tag: string;
  title: string;
  desc: string;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    n: "01",
    tag: "Day 0",
    title: "Onboarding form",
    desc: "You share the brand, Seller Central access and your real numbers — current revenue, ad spend and goals. Ten minutes, one form.",
  },
  {
    n: "02",
    tag: "Within 48h",
    title: "Manager assigned & audit",
    desc: "A dedicated account manager is assigned and runs a full pre-kickoff audit and plan of action, before you ever pay for execution.",
  },
  {
    n: "03",
    tag: "Day 3",
    title: "Kickoff & 90-day roadmap",
    desc: "On the onboarding call we walk the plan of action and a 90-day roadmap with revenue, ad-budget and TACoS projections.",
  },
  {
    n: "04",
    tag: "Week 1+",
    title: "Execution & cadence",
    desc: "Shared Slack and ClickUp, recurring 14- and 30-day PPC audits, daily call reviews and action items extracted within 24 hours.",
  },
];

export default function OnboardingProcess() {
  return (
    <section id="onboarding" className="bg-bg py-24 lg:py-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mx-auto max-w-2xl text-center"
        >
          <Eyebrow>How Onboarding Works</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
            From booking to execution in one week.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            No long ramp-up. Here&rsquo;s exactly what happens, and when,
            from the moment you share your account.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-x-8 gap-y-10 lg:mt-20 lg:grid-cols-4 lg:gap-y-0">
          {ONBOARDING_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.08 + i * 0.08 }}
              className={`group relative pl-6 lg:pl-8 ${
                i !== 0 ? "border-l border-line" : ""
              }`}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
                {step.tag}
              </p>

              <h3 className="mt-2 text-[18px] font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-primary">
                {step.title}
              </h3>

              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
