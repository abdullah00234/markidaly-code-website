"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";
import { Marquee } from "@/components/ui/marquee";

type Brand = {
  name: string;
  logo: string;
};

const BRANDS: Brand[] = [
  { name: "Mina Morocco", logo: "/images/brands/mina-morocco.svg" },
  { name: "Darsa Organics", logo: "/images/brands/darsa-organics.svg" },
  { name: "CLn Skincare", logo: "/images/brands/cln-skincare.svg" },
  { name: "Herb to Body", logo: "/images/brands/herb-to-body.svg" },
  { name: "Darsam Chai", logo: "/images/brands/darsam-chai.svg" },
  { name: "KUE", logo: "/images/brands/kue.svg" },
  { name: "Karlsten Pest Control", logo: "/images/brands/karlsten-pest-control.svg" },
  { name: "LifeSource Vitamins", logo: "/images/brands/lifesource-vitamins.svg" },
  { name: "Peacock Max", logo: "/images/brands/peacock-max.svg" },
  { name: "Tosali", logo: "/images/brands/tosali.svg" },
  { name: "MVP Hair Care", logo: "/images/brands/mvp-hair-care.svg" },
];

const headingReveal = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_PREMIUM } },
};

export default function TrustedBy() {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? "show" : "hidden";

  return (
    <section aria-labelledby="trusted-brands-heading" className="bg-white py-16 sm:py-20 lg:py-[90px]">
      <div className="container-page">
        <motion.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-5xl"
        >
          <motion.h2
            id="trusted-brands-heading"
            variants={headingReveal}
            className="mb-8 font-[family-name:var(--font-heading)] text-[15px] font-semibold leading-[1.2] text-ink"
          >
            Trusted by leading brands worldwide
          </motion.h2>
        </motion.div>

        <motion.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingReveal}
          className="relative mx-auto max-w-5xl"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <Marquee
            pauseOnHover
            repeat={2}
            className="[--gap:2.75rem] py-1 sm:[--gap:3.5rem]"
            style={{ "--duration": "60s" } as CSSProperties}
          >
            {BRANDS.map((brand) => (
              <span
                key={brand.name}
                className="relative block h-10 w-[110px] shrink-0 sm:h-12 sm:w-[140px] md:h-14 md:w-[160px]"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="160px"
                  className="object-contain opacity-60 grayscale contrast-125 brightness-[0.92] transition-opacity duration-300 group-hover:opacity-100"
                />
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
