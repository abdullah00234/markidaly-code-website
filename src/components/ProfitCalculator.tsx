"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Field, FieldContent, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import CTAButton from "./ui/CTAButton";
import Eyebrow from "./ui/Eyebrow";
import { EASE_PREMIUM } from "@/lib/motion";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ProfitCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState("150000");
  const [profitMargin, setProfitMargin] = useState("20");
  const [growthTarget, setGrowthTarget] = useState("15");

  const { additionalMonthly, additionalAnnual } = useMemo(() => {
    const revenue = parseNumber(monthlyRevenue);
    const margin = parseNumber(profitMargin) / 100;
    const growth = parseNumber(growthTarget) / 100;
    const monthly = revenue * growth * margin;
    return {
      additionalMonthly: monthly,
      additionalAnnual: monthly * 12,
    };
  }, [monthlyRevenue, profitMargin, growthTarget]);

  return (
    <section id="profit-calculator" className="bg-white py-24 lg:py-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto max-w-2xl text-center"
        >
          <Eyebrow>Profit Calculator</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.15] tracking-tight text-navy sm:text-[40px]">
            See what closing the gap could be worth.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Enter your own numbers to get a simple, illustrative estimate —
            not a guarantee of what we&rsquo;d achieve for your account.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
          className="mx-auto mt-14 grid max-w-4xl gap-8 rounded-[28px] border border-line bg-bg p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10"
        >
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel htmlFor="calc-revenue">Current Monthly Amazon Revenue</FieldLabel>
              <FieldContent>
                <Input
                  id="calc-revenue"
                  inputMode="numeric"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="calc-margin">Current Profit Margin (%)</FieldLabel>
              <FieldContent>
                <Input
                  id="calc-margin"
                  inputMode="numeric"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                />
                <FieldDescription>
                  Profit left after Amazon fees, ad spend, and cost of goods.
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="calc-growth">Revenue Growth You&rsquo;re Targeting (%)</FieldLabel>
              <FieldContent>
                <Input
                  id="calc-growth"
                  inputMode="numeric"
                  value={growthTarget}
                  onChange={(e) => setGrowthTarget(e.target.value)}
                />
                <FieldDescription>
                  This is your own assumption to test — adjust it to see how the
                  estimate changes.
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
                Estimated Additional Profit
              </p>
              <p className="mt-3 font-[family-name:var(--font-heading)] text-[36px] font-extrabold leading-none tracking-tight text-navy sm:text-[42px]">
                {currency.format(Math.max(additionalMonthly, 0))}
                <span className="ml-1 text-[15px] font-semibold text-ink-soft">/mo</span>
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                {currency.format(Math.max(additionalAnnual, 0))} per year
              </p>
            </div>

            <div className="mt-8">
              <CTAButton href="#book-audit" arrow className="w-full justify-center sm:w-auto">
                Book a Free Growth Audit
              </CTAButton>
              <p className="mt-4 text-[12.5px] leading-snug text-ink-soft">
                Illustrative only, based on the numbers above. Actual results
                depend on your account, category, and market conditions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
