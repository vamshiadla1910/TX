import "./About.css";
import AboutHeroSection from "./AboutHeroSection";
import MissionSection from "./MissionSection";
import VisionSection from "./VisionSection";
import OfferingsSection from "./OfferingsSection";
import PillarsSection from "./PillarsSection";
import JourneySection from "./JourneySection";
import CTASection from "./CTASection";

export default function About() {
  return (
    <div className="about-page">

      {/* 1. Hero */}
      <AboutHeroSection />

      {/* 2. Mission */}
      <MissionSection />

      {/* 3. Vision */}
      <VisionSection />
 
      {/* 4. Offerings */}
      <OfferingsSection />

      {/* 5. Four Pillars */}
      <PillarsSection />

      {/* 6. Journey */}
      <JourneySection />

      {/* 7. Call To Action */}
      <CTASection />

    </div>
  );
}