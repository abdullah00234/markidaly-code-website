"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  LayoutDashboard,
  Target,
  Search,
  Store,
  Rocket,
  PackageCheck,
  Globe,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import CTAButton from "./ui/CTAButton";
import { EASE_PREMIUM } from "@/lib/motion";

const SERVICES: {
  title: string;
  bullets: string[];
  icon: LucideIcon;
  gradient: string;
  image?: string;
}[] = [
  {
    title: "Amazon Account Management",
    bullets: [
      "Day-to-Day Account Operations",
      "Health & Performance Reporting",
      "Growth Priority Planning",
    ],
    icon: LayoutDashboard,
    gradient: "linear-gradient(135deg, #1f5eff, #0b1f3a)",
    image: "/images/amazon-account-management.png",
  },
  {
    title: "Amazon PPC Management",
    bullets: [
      "Campaign Strategy & Targeting",
      "Bidding & Budget Optimization",
      "ROAS / ACOS-Driven Growth",
    ],
    icon: Target,
    gradient: "linear-gradient(135deg, #4c86ff, #16294a)",
    image: "/images/amazon-ppc-management.png",
  },
  {
    title: "Amazon Listing Optimization & CRO",
    bullets: [
      "Titles, Bullets & Backend Keywords",
      "Images & A+ Content",
      "Ongoing Conversion Rate Optimization",
    ],
    icon: Search,
    gradient: "linear-gradient(135deg, #1646c9, #1f5eff)",
    image: "/images/amazon-listing-optimization.png",
  },
  {
    title: "Storefront & Brand Experience",
    bullets: [
      "Brand Store Design",
      "Premium A+ Content & Brand Story",
      "Repeat-Buyer Brand Experience",
    ],
    icon: Store,
    gradient: "linear-gradient(135deg, #1793c6, #0b1f3a)",
    image: "/images/storefront-brand-experience.png",
  },
  {
    title: "Product Launch & Ranking",
    bullets: [
      "Launch Strategy & Roadmap",
      "Keyword & Ranking Work",
      "Early-Stage PPC Support",
    ],
    icon: Rocket,
    gradient: "linear-gradient(135deg, #1f5eff, #4c86ff)",
    image: "/images/product-launch-ranking.png",
  },
  {
    title: "Inventory, Operations & Account Health",
    bullets: [
      "Inventory & FBA Planning",
      "Account Health Monitoring",
      "Compliance & Suppression Resolution",
    ],
    icon: PackageCheck,
    gradient: "linear-gradient(135deg, #16294a, #1646c9)",
    image: "/images/inventory-operations-account-health.png",
  },
  {
    title: "Marketplace Expansion",
    bullets: [
      "New Amazon Marketplace Rollout",
      "Walmart Marketplace Management",
      "Cross-Channel Operational Setup",
    ],
    icon: Globe,
    gradient: "linear-gradient(135deg, #0b1f3a, #4c86ff)",
    image: "/images/marketplace-expansion.png",
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

function ServiceRow({
  service,
  isOpen,
  onOpen,
  onToggleClick,
}: {
  service: (typeof SERVICES)[number];
  isOpen: boolean;
  onOpen: () => void;
  onToggleClick: () => void;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      variants={rowVariants}
      className="border-b border-white/10 first:border-t"
    >
      <button
        type="button"
        onMouseEnter={onOpen}
        onFocus={onOpen}
        onClick={onToggleClick}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 py-5 text-left sm:gap-5 sm:py-6"
      >
        <span
          className={`flex-1 font-[family-name:var(--font-heading)] text-[17px] font-bold leading-snug tracking-tight transition-colors duration-300 sm:text-[19px] ${
            isOpen ? "text-white" : "text-white/80"
          }`}
        >
          {service.title}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-9 sm:w-9 ${
            isOpen
              ? "rotate-45 bg-primary text-white"
              : "bg-white/10 text-white"
          }`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-wrap items-center gap-5 pb-5 transition-all duration-300 sm:gap-6 sm:pb-6 ${
              isOpen
                ? "translate-y-0 opacity-100 delay-75"
                : "-translate-y-1 opacity-0"
            }`}
          >
            {service.image ? (
              <div
                aria-hidden
                className="relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-36"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 144px, 128px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden
                className="flex h-20 w-32 shrink-0 items-center justify-center rounded-2xl sm:h-24 sm:w-36"
                style={{ backgroundImage: service.gradient }}
              >
                <Icon className="h-8 w-8 text-white/90" strokeWidth={1.75} />
              </div>
            )}
            <ul className="flex flex-1 flex-wrap gap-x-7 gap-y-2">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-2 text-[13px] text-white"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-black"
                    strokeWidth={2.5}
                  />
                  {bullet}
                </li>
              ))}
            </ul>
            <CTAButton
              href="#our-process"
              variant="primary"
              size="sm"
              arrow
              className="shrink-0"
            >
              Learn More
            </CTAButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  // Lazily derives the real value on the client's first render instead of
  // defaulting to true and correcting it with a setState in an effect — the
  // default of true is only ever seen server-side, where matchMedia doesn't
  // exist. The effect below just keeps this in sync if hover capability
  // changes later (e.g. a mouse is attached to a touch device).
  const [canHover, setCanHover] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = () => setCanHover(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <section id="services" className="bg-white py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        className="container-page mx-auto max-w-2xl text-center"
      >
        <Eyebrow>Services</Eyebrow>
        <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-navy sm:text-[40px]">
          One team, every lever that moves your account.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
          Amazon account management, PPC, listing optimization, and inventory
          operations aren&rsquo;t separate vendors at Markidly. They&rsquo;re
          one team working from one plan. Explore what we do below, or book a
          growth audit to talk through your specific account.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-[1600px] px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}
          className="rounded-[40px] border border-white/10 bg-[#0C78B8] px-6 py-12 sm:rounded-[48px] sm:px-10 sm:py-14 lg:px-14"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-primary-bright" />
              {String(SERVICES.length).padStart(2, "0")} Services
            </span>
          </div>

          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {SERVICES.map((service, i) => (
              <ServiceRow
                key={service.title}
                service={service}
                isOpen={prefersReducedMotion ? i === 0 : active === i}
                onOpen={() => canHover && setActive(i)}
                onToggleClick={() =>
                  !canHover && setActive((prev) => (prev === i ? -1 : i))
                }
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
