import { CadenceScroll } from "./ui/cadence-scroll";
import { GradientWave } from "./ui/gradient-wave";
import Eyebrow from "./ui/Eyebrow";

const phases = {
  items: [
    {
      title: "Diagnose",
      description:
        "Deep dive into your account, data, and marketplace reality to identify what's really holding growth back.",
      media: "/images/diagnose-illustration.png",
    },
    {
      title: "Prioritize",
      description:
        "Focus on the highest-impact opportunities across advertising, listings, operations, and profitability.",
      media: "/images/prioritize-illustration.png",
    },
    {
      title: "Execute",
      description:
        "Implement a clear, coordinated plan across all key areas of your Amazon business.",
      media: "/images/execute-illustration.png",
    },
    {
      title: "Measure & Refine",
      description:
        "Track what's working, cut what's not, and continuously optimize for stronger, more profitable performance.",
      media: "/images/measure-refine-illustration.png",
    },
    {
      title: "Scale",
      description:
        "Once the foundation is strong, we help you scale sustainably with a proven, repeatable growth system.",
      media: "/images/scale-illustration.png",
    },
  ],
};

export default function OurProcess() {
  return (
    <section
      id="our-process"
      className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32"
    >
      <GradientWave
        className="pointer-events-none"
        colors={["#0b1f3a", "#0c78b8", "#1793c6", "#0b1f3a", "#16294a", "#0c78b8"]}
        darkenTop
        shadowPower={6}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="dark">Our Process</Eyebrow>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[40px]">
            Every account moves through the same five steps.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            A clear, repeatable system — from diagnosing what's holding you
            back to scaling what works.
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <CadenceScroll items={phases.items} />
        </div>
      </div>
    </section>
  );
}
