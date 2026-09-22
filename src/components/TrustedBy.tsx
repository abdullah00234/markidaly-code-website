"use client";

import { motion } from "motion/react";
import { BrandScroller, BrandScrollerReverse, type BrandLogo } from "./ui/brand-scroller";
import Eyebrow from "./ui/Eyebrow";
import { fadeUp, EASE_PREMIUM } from "@/lib/motion";

const ROW_1: BrandLogo[] = [
  { name: "CLn Skincare", src: "/images/logos/cln.png", width: 607, height: 212 },
  { name: "Mina Morocco", src: "/images/logos/mina.png", width: 651, height: 220 },
  { name: "MVP Hair Care", src: "/images/logos/mvp-hair-care.png", width: 157, height: 220, size: "tall" },
  { name: "Tosali", src: "/images/logos/tosali.png", width: 1220, height: 220 },
];

const ROW_2: BrandLogo[] = [
  { name: "Darsa Organics", src: "/images/logos/darsa-organics.png", width: 220, height: 220, size: "tall" },
  { name: "Darsam Chai", src: "/images/logos/darsam-chai.png", width: 452, height: 160 },
  { name: "Peacock Max", src: "/images/logos/peacock-max.png", width: 953, height: 220 },
  { name: "Kue", src: "/images/logos/kue.png", width: 146, height: 110 },
  { name: "Karlsten Pest Control", src: "/images/logos/karlsten-pest-control.png", width: 427, height: 152 },
];

export default function TrustedBy() {
  return (
    <section className="bg-bg py-14 sm:py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mx-auto max-w-xl text-center"
        >
          <Eyebrow>Trusted Partners</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[22px] font-bold leading-snug tracking-tight text-navy sm:text-[26px]">
            Backed by established brands across skincare, wellness &amp;
            specialty retail
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-10 overflow-hidden rounded-[28px] border border-line bg-white py-8 shadow-[0_20px_50px_-32px_rgba(11,31,58,0.18)] sm:mt-12"
        >
          <div className="flex flex-col gap-2">
            <BrandScroller items={ROW_1} duration="26s" />
            <BrandScrollerReverse items={ROW_2} duration="30s" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
