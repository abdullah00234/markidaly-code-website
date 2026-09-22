import { CadenceScroll } from "./ui/cadence-scroll";
import Eyebrow from "./ui/Eyebrow";

// Three-phase framing of the account lifecycle — Research, then Design &
// Optimize, then Grow & Scale. Sits above the tactical five-step "How We
// Work" breakdown; this is the higher-level story, that is the mechanics.
const phases = {
  items: [
    {
      title: "Research",
      description:
        "Your brand's history is unique, and so is your growth plan. We dig into advertising, listings, conversion, inventory, and operations to surface the real trouble spots and the biggest opportunities in your account, not just the symptom you called about.",
      media: "/images/our-process/research.svg",
    },
    {
      title: "Design & Optimize",
      description:
        "With a clear plan in place, execution is everything. Our specialists get to work doing what they do best: building a scroll-stopping product listing, allocating the ideal budget, or constructing a laser-focused DSP campaign.",
      media: "/images/our-process/design-optimize.svg",
    },
    {
      title: "Grow & Scale",
      description:
        "Once things are dialed in, we ramp up investment in what's working and go after your growth targets, methodically, using everything we learned along the way while protecting margin.",
      media: "/images/our-process/grow-scale.svg",
    },
  ],
};

export default function OurProcess() {
  return (
    <section
      id="our-process"
      className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32"
    >
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
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="dark">Our Process</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[40px]">
            Every account moves through the same three phases.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            Research uncovers where the growth is. Design & optimize is where
            it gets built. Grow & scale is where it compounds.
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <CadenceScroll items={phases.items} />
        </div>
      </div>
    </section>
  );
}
