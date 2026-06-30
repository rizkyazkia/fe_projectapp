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
import GameSection from "../../components/game/gamesection";



export default function LandingPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col">

      {/* 1. HEADER / NAVIGATION */}
      <HeaderMain />

      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. INTERACTIVE MODULE SECTION */}
      <InteractiveModule />

      {/* 3. MINI CALCULATOR */}
      <IMTCalculator />

      {/* 4. ABOUT */}
      <About />

      {/* 5. FEATURES */}
      <Features />

      {/* 6. BANNER */}
      <Banner />

      {/* 7. STEP */}
      <Step />

      {/* 8. TESTIMONIAL */}
      <Testimonial />

      {/* 9. CTA */}
      <CTAaction />

      {/* 10. FOOTER */}
      <FooterMain />

    </div>
  );
}
