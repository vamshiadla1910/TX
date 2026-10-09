import React from "react";
import OnePlatform from "../../components/OnePlatform/OnePlatform";
import LearnerJourney from "../Learner_journey/Learner_journey";
import CTA from "../../components/CTA/CTA";
import Mode from "../../components/Modes/Modes";
import FAQ from "../../components/FAQ/FAQ";
import "./Home.css";
import Courses from "../../pages/Courses/Courses";
import TrustSection from "../../components/TrustSection/TrustSection";
import Hero from "../../components/Hero/Hero";
// import Blog from "../Blog/Blog/Blog";
import Pricing from "../../components/Pricing/Pricing";
import HiringPartners from "../../components/HiringPartners/HiringPartner";
import WhoWeAre from "../../components/WhoWeAre/WhoWeAre";
import StudentReviews from "../StudentReviews/StudentReviews";
import Programtraning from "../../components/ProgramTraning/programtraning";
import InternshipSection from "../../components/Internship/Internship";
import Contact from "../Contact/ContactForm";
 
const Home = () => {
  return (
    <>
      <Hero />

      

      {/* who we are Section */}
      <WhoWeAre />
      {/* Delivery Modes Section */}
      <OnePlatform />
 
      < Programtraning />

      <Mode />

      < InternshipSection/>
 
      {/* Courses Section */}
      <Courses />
     
      <HiringPartners />
 
      {/* CTA / Credential Verification */}
      <CTA />
 
 
      <StudentReviews/>
 
      {/* FAQ Section */}
      <FAQ />
 
    </>
   
  );
}
 
export default Home;
 