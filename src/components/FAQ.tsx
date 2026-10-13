"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import { EASE_PREMIUM } from "@/lib/motion";

const FAQS = [
  {
    q: "Who is Markidly a good fit for?",
    a: "Established consumer brands that already have an active Amazon presence and want to improve or scale performance, whether that's one part of the account or the whole thing. We work best with brands looking for experienced operators to take real ownership of the account, not task-by-task execution.",
  },
  {
    q: "What Amazon services do you manage?",
    a: "Amazon account management, Amazon PPC, Amazon listing optimization and conversion rate optimization, Amazon storefront and brand experience, Amazon product launch and ranking, Amazon inventory and account health management, and Amazon marketplace expansion, including Walmart. Full details are on the Services page.",
  },
  {
    q: "Do you manage PPC only, or the full Amazon account?",
    a: "Both. Some brands start with one service and expand once they see how the pieces connect. Others bring us in to run the full account from day one. There's no minimum scope to get started.",
  },
  {
    q: "How do you measure success?",
    a: "Revenue and ROAS matter, but they're not the whole picture. We weigh them against actual profitability, so a campaign that looks good on a report but isn't making you money doesn't get called a win.",
  },
  {
    q: "How involved are the founders?",
    a: "Directly. Sameer and Abu Bakar aren't just involved in strategy calls. They work hands-on across the accounts alongside the specialist team, from decisions through execution. You're not handed off after the first call.",
  },
  {
    q: "How do you approach profitability vs. ROAS?",
    a: "ROAS tells you whether a campaign is performing. It doesn't tell you whether it's making you money once you factor in real costs. We manage toward the second number, not just the first.",
  },
  {
    q: "Can you help with inventory or account-health issues?",
    a: "Yes. Inventory planning, FBA and operational issues, compliance, and account health are one of our core service areas, not an add-on.",
  },
  {
    q: "Do you work with brands outside the U.S.?",
    a: "Yes. We manage U.S.-based brands, and we also work with brands in the UK and Europe, and to a lesser extent Canada and Australia.",
  },
  {
    q: "What happens during the initial growth audit?",
    a: "We review your advertising, listings, inventory, and account health together, and come back within three to four business days with a clear read on what's working, what's costing you, and an action plan for what we'd prioritize first. No generic report, no pitch deck.",
  },
  {
    q: "How do you start working with a new brand?",
    a: "Book a free growth audit. We'll review your account, walk you through what we find, and if it's a fit, agree on a plan and priorities together. There's no pressure and no long-term lock-in to get started.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-bg py-24 lg:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
            Questions worth asking before you commit.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-4xl divide-y divide-line border-y border-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[16px] font-semibold text-navy">{item.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 max-w-3xl text-[14.5px] leading-relaxed text-ink-soft">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
