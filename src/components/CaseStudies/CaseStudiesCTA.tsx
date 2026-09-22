import CTAButton from "../ui/CTAButton";

export default function CaseStudiesCTA() {
  return (
    <div className="mt-12 border-t border-white/10 pt-10 text-center">
      <h3 className="font-[family-name:var(--font-heading)] text-[22px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[26px]">
        See what better account management can do.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/70">
        Explore the full stories behind the numbers.
      </p>
      <div className="mt-6">
        <CTAButton href="#" arrow>
          Read the Full Case Studies
        </CTAButton>
      </div>
    </div>
  );
}
