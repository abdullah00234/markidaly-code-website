import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import BrandResults from "@/components/BrandResults";
import SoundFamiliar from "@/components/SoundFamiliar";
import Services from "@/components/Services";
import Founders from "@/components/Founders";
import WhyMarkidly from "@/components/WhyMarkidly";
import CaseStudies from "@/components/CaseStudies";
import OurProcess from "@/components/OurProcess";
import HowWeWork from "@/components/HowWeWork";
import GrowthAudit from "@/components/GrowthAudit";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import BookGrowthAudit from "@/components/BookGrowthAudit";
import Footer from "@/components/Footer";

// Homepage section order (approved storytelling flow):
// Hero -> Proof Bar -> Sound Familiar -> Services -> About/Founders ->
// Why Choose Us -> Case Studies -> Our Process ->
// How We Work -> Growth Audit -> Testimonials -> FAQ -> Final CTA ->
// Contact -> Footer
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <BrandResults />
        <SoundFamiliar />
        <Services />
        <Founders />
        <WhyMarkidly />
        <CaseStudies />
        <OurProcess />
        <HowWeWork />
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
