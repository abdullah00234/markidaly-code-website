import CTAButton from "../ui/CTAButton";
import CaseStudyResultVisual from "./CaseStudyResultVisual";
import type { CaseStudySlideData } from "./data";

// Pure presentational — every case study renders through this exact layout.
// Only the data passed in changes; the structure never does.
export default function CaseStudySlide({ slide }: { slide: CaseStudySlideData }) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16 lg:gap-20">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
          Featured Case Study
        </p>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-[family-name:var(--font-heading)] text-[22px] font-bold text-white">
            {slide.brand}
          </h3>
          <span className="text-[13px] text-white/60">{slide.category}</span>
        </div>

        <h4 className="mt-4 font-[family-name:var(--font-heading)] text-[30px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[36px]">
          {slide.headline}
        </h4>

        <div className="mt-8 space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              The Problem
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">{slide.problem}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              What Changed
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">{slide.change}</p>
          </div>
        </div>

        <CTAButton
          href="#"
          variant="ghost"
          arrow
          className="mt-8 !text-white hover:!text-primary-bright"
        >
          Read Case Study
        </CTAButton>
      </div>

      <div>
        <CaseStudyResultVisual slide={slide} />
      </div>
    </div>
  );
}
