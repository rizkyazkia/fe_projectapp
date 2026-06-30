import { BsActivity } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import { PiHeartStraightFill } from "react-icons/pi";
import { MdChevronRight } from "react-icons/md";
import HeaderMain from "../../components/main/HeaderMain";
import Hero from "../../components/main/Hero";
import InteractiveModule from "../../components/main/InteractiveModul";
import IMTCalculator from "../../components/main/IMTCalculator";
import About from "../../components/main/About";
import Features from "../../components/main/Features";
import Banner from "../../components/main/Banner";
import Step from "../../components/main/Step";
import Testimonial from "../../components/main/Testimonial";
import CTAaction from "../../components/main/CTAaction";
import FooterMain from "../../components/main/FooterMain";

export default function LandingPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col">
      {/* 1. HEADER / NAVIGATION */}
      <HeaderMain />

      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. INTERACTIVE MODULE SECTION */}
      <InteractiveModule />

      {/* 3. MINI CALCULATOR (INTERACTIVE CTA ON LANDING) */}
      <IMTCalculator />

      {/* 4. COLLABORATION PILLARS (ABOUT SECTION) */}
      <About />

      {/* 5. FEATURES BENTO SECTION */}
      <Features />

      {/* 6. STATISTICS STRIP */}
      <Banner />

      {/* 7. THREE EASY STEPS */}
      <Step />

      {/* 8. TESTIMONIALS SECTION */}
      <Testimonial />

      {/* 9. CALL TO ACTION (CTA) SECTION */}
      <CTAaction />

      {/* 10. FOOTER */}
      <FooterMain />
    </div>
  );
}
