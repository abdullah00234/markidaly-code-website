import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroMobile from "@/components/HeroMobile";
import TrustedBy from "@/components/TrustedBy";
import ProvenPerformance from "@/components/ProvenPerformance";
import SoundFamiliar from "@/components/SoundFamiliar";
import Services from "@/components/Services";
import Founders from "@/components/Founders";
import WhyMarkidly from "@/components/WhyMarkidly";
import CaseStudies from "@/components/CaseStudies";
import ProfitCalculator from "@/components/ProfitCalculator";
import OurProcess from "@/components/OurProcess";
import GrowthAudit from "@/components/GrowthAudit";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import BookGrowthAudit from "@/components/BookGrowthAudit";
import Footer from "@/components/Footer";

// Homepage section order (approved storytelling flow):
// Hero -> Proof Bar -> Sound Familiar -> Services -> About/Founders ->
// Why Choose Us -> Case Studies -> Profit Calculator -> Our Process ->
// Growth Audit -> Testimonials -> FAQ -> Final CTA ->
// Contact -> Footer
// (How We Work / "Our Approach" section hidden — component kept in codebase)
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HeroMobile />
        <TrustedBy />
        <ProvenPerformance />
        <SoundFamiliar />
        <Services />
        <Founders />
        <WhyMarkidly />
        <CaseStudies />
        <ProfitCalculator />
        <OurProcess />
        <GrowthAudit />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <BookGrowthAudit />
      </main>
      <Footer />
    </>
  );
}
