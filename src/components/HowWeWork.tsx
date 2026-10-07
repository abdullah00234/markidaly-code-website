"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  ListChecks,
  Search,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { MeshGradient } from "./ui/mesh-gradient";
import { EASE_PREMIUM } from "@/lib/motion";

const STEPS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Diagnose",
    description:
      "Deep dive into your account, data, and marketplace reality to identify what's really holding growth back.",
    icon: Search,
  },
  {
    title: "Prioritize",
    description:
      "Focus on the highest-impact opportunities across advertising, listings, operations, and profitability.",
    icon: ListChecks,
  },
  {
    title: "Execute",
    description:
      "Implement a clear, coordinated plan across all key areas of your Amazon business.",
    icon: Settings,
  },
  {
    title: "Measure & Refine",
    description:
      "Track what's working, cut what's not, and continuously optimize for stronger, more profitable performance.",
    icon: BarChart3,
  },
  {
    title: "Scale",
    description:
      "Once the foundation is strong, we help you scale sustainably with a proven, repeatable growth system.",
    icon: TrendingUp,
  },
];

function ApproachVisual() {
  return (
    <div className="relative mt-6 w-full max-w-[560px]">
      <Image
        src="/images/approach-dashboard.png"
        alt="Markidly dashboard showing rising Amazon sales performance alongside product inventory"
        width={735}
        height={459}
        className="h-auto w-full"
        sizes="(min-width: 1024px) 560px, 90vw"
      />
    </div>
  );
}

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="relative overflow-hidden bg-white py-12 md:py-14 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(85%_75%_at_50%_40%,black,transparent)]"
      >
        <MeshGradient
          className="h-full w-full"
          colors={["#ffffff", "#eaf0ff", "#4c86ff", "#1f5eff"]}
          speed={0.35}
          distortion={0.65}
          swirl={0.4}
          swirlIterations={6}
          softness={1}
          shape="wave"
          shapeScale={0.8}
          scale={1.6}
          rotation={135}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[320px] w-[320px] rounded-full bg-primary/[0.06] blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[900px] rounded-full bg-primary-light/40 blur-[140px]"
      />

      <div className="container-page relative">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* LEFT */}
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            >
              <Eyebrow>Our Approach</Eyebrow>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.65, ease: EASE_PREMIUM, delay: 0.05 }}
              className="font-[family-name:var(--font-heading)] text-[28px] font-extrabold leading-[1.1] tracking-tight text-navy min-[400px]:text-[32px] sm:text-[38px] sm:leading-[1.05] md:text-[44px] lg:text-[50px] lg:leading-[1.05] xl:text-[56px]"
            >
              A clear operating system for Amazon growth.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.1 }}
              className="mt-3 max-w-[480px] text-[14px] leading-relaxed text-ink-soft sm:text-[16px] lg:text-[17px]"
            >
              The problems are different every time. Our approach isn&apos;t.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 }}
            >
              <Link
                href="#book-audit"
                className="group mt-5 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-primary px-5 text-[13.5px] font-semibold text-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_16px_32px_-12px_rgba(31,94,255,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-primary-dark hover:shadow-[0_1px_2px_rgba(11,31,58,0.08),0_20px_40px_-12px_rgba(31,94,255,0.65)] sm:h-[52px] sm:w-auto sm:justify-start sm:gap-2 sm:px-7 sm:text-[14.5px]"
              >
                Book a Free Growth Audit
                <ArrowRight
                  aria-hidden
                  strokeWidth={2.25}
                  className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 }}
            >
              <ApproachVisual />
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="min-w-0 lg:pt-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: i * 0.08 }}
                  className="group grid grid-cols-[16px_1fr] sm:grid-cols-[24px_1fr]"
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary-light"
                    />
                    <span
                      aria-hidden
                      className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px_#ffffff] transition-transform duration-300 group-hover:scale-110 sm:h-3 sm:w-3"
                    />
                  </div>

                  <div className="flex items-stretch gap-3 sm:gap-5">
                    <div className="flex shrink-0 items-center py-3.5 sm:py-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-light bg-primary-light/70 shadow-sm transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary-light sm:h-16 sm:w-16">
                        <Icon
                          aria-hidden
                          strokeWidth={1.75}
                          className="h-5 w-5 text-primary sm:h-7 sm:w-7"
                        />
                      </div>
                    </div>

                    <div
                      className={`flex flex-1 items-center gap-3 py-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:gap-5 sm:py-5 ${
                        i !== 0 ? "border-t border-primary-light/60" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-bold text-navy sm:text-[19px]">
                          {step.title}
                        </h3>
                        <p className="mt-1 max-w-[380px] text-[12.5px] leading-relaxed text-ink-soft sm:text-[14px]">
                          {step.description}
                        </p>
                      </div>

                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:h-10 sm:w-10"
                      >
                        <ArrowRight className="h-3 w-3 sm:h-[15px] sm:w-[15px]" strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
