import CTAButton from "./ui/CTAButton";

// Mobile-only counterpart to Hero.tsx. The desktop hero is a scroll-driven
// WebGL scene (see HeroScene.tsx) that's overkill on small screens — this is
// a plain static section with the same background treatment (gradient +
// dot-grid, both pure CSS/GPU-composited) and the same intro copy/CTAs, but
// no canvas, no GSAP timeline, nothing scroll-linked. Hero.tsx hides itself
// at this breakpoint (`hidden md:block`) and doesn't even mount HeroScene
// below `md`, so this is the only hero that loads on mobile.
export default function HeroMobile() {
  return (
    <section className="relative block overflow-hidden rounded-b-[40px] md:hidden">
      <div aria-hidden className="absolute bg-gradient-hero-dark animate-hero-gradient" />
      {/* Same faint gold corner glow as the desktop hero background, for
          parity now that this version has no 3D scene to carry the accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/[0.1] blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute opacity-[0.07] animate-hero-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="container-page relative z-10 flex min-h-[90vh] min-h-[90svh] min-h-[90dvh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[rgba(20,45,80,0.55)] px-1.5 py-1.5">
          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0b1f3a]">
            Amazon Growth Agency
          </span>
        </div>

        <h1 className="text-[clamp(2.4rem,9vw,3.2rem)] font-black leading-[0.98] tracking-[-0.04em] text-hero-white [text-wrap:balance]">
          Built to Grow Brands on Amazon.
        </h1>

        <p className="mt-5 max-w-[32ch] text-[clamp(1rem,4vw,1.15rem)] leading-relaxed text-hero-white [text-wrap:balance]">
          We combine strategy, data, creative, and performance marketing to
          help Amazon brands scale profitably.
        </p>

        <div className="mt-9 flex w-full max-w-sm flex-col gap-4">
          <CTAButton
            href="#book-audit"
            arrow
            className="w-full justify-center hover:!bg-none hover:!bg-black hover:!brightness-100"
          >
            Get Your Growth Audit
          </CTAButton>
          <CTAButton
            href="#services"
            variant="outline-dark"
            arrow
            className="w-full justify-center"
          >
            Explore Services
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
