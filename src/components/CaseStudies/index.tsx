import CaseStudiesHeader from "./CaseStudiesHeader";
import GrowthStats from "./GrowthStats";
import CaseStudySlider from "./CaseStudySlider";

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-white py-24 lg:py-32">
      <CaseStudiesHeader />

      <div className="container-page mt-16 sm:mt-20">
        <GrowthStats />
      </div>

      <div className="mt-20 lg:mt-24">
        <CaseStudySlider />
      </div>
    </section>
  );
}
