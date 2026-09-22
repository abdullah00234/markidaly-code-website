"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import { EASE_PREMIUM, fadeUp, staggerContainer } from "@/lib/motion";

// No real client testimonials have been supplied yet. Rather than fabricate
// quotes, names, companies, ratings, or stats to fill this section, it
// renders a clean, structurally-ready empty state — drop real testimonials
// into TESTIMONIALS below (name, company, role, quote) and the card layout
// (avatar initials derived from the real name, name, role, company, quote)
// renders automatically, no other changes needed. Deliberately just these
// four fields and exactly three slots — no star ratings or stat badges,
// since those can't be shown truthfully without verified per-client data.
type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [];

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full min-h-[268px] flex-col rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_48px_-28px_rgba(31,94,255,0.28)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-bright text-[12.5px] font-bold text-white">
          {initialsFor(testimonial.name)}
        </span>
        <div>
          <p className="text-[14.5px] font-semibold leading-tight text-navy">{testimonial.name}</p>
          <p className="mt-0.5 text-[12px] font-medium leading-tight text-ink-soft/70">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-[14px] leading-relaxed text-ink-soft">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <div className="group relative flex h-full min-h-[268px] flex-col overflow-hidden rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_48px_-28px_rgba(31,94,255,0.22)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.08),transparent_70%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Avatar-shaped placeholder — same position/size as the filled
          card's initials badge, so a real testimonial can drop in without
          the layout shifting. Deliberately empty: no invented initials. */}
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary/30">
          <Quote className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft/55">
            Client Voice
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-heading)] text-[11px] font-semibold tracking-[0.08em] text-primary/40">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col gap-2.5" aria-hidden>
        <span className="h-[2px] w-4/5 rounded-full bg-ink-soft/15" />
        <span className="h-[2px] w-3/5 rounded-full bg-ink-soft/15" />
        <span className="h-[2px] w-2/5 rounded-full bg-ink-soft/15" />
      </div>

      <div className="relative mt-auto border-t border-line pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft/55">
          Testimonial Slot
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft/45">
          Awaiting approved client testimonial
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const slots = Array.from({ length: 3 }, (_, i) => TESTIMONIALS[i]);

  return (
    <section className="relative overflow-hidden bg-bg py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(76,134,255,0.14),transparent_50%),radial-gradient(circle_at_88%_80%,rgba(31,94,255,0.12),transparent_50%)]"
      />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="container-page mx-auto max-w-2xl text-center"
        >
          <Eyebrow>What clients say</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
            Proof, not just promises.
          </h2>
        </motion.div>

        <div className="container-page mt-14">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3"
          >
            {slots.map((testimonial, i) => (
              <motion.div key={i} variants={fadeUp}>
                {testimonial ? (
                  <TestimonialCard testimonial={testimonial} />
                ) : (
                  <EmptySlot index={i} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
