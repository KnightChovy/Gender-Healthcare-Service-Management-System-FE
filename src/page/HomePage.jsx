import React from "react";

import { Link } from "react-router-dom";
import { Navbar } from "../components/Layouts/LayoutHomePage/Navbar";
import { SectionHero } from "../components/Layouts/LayoutHomePage/SectionHero";
import { WhyChooseUs } from "../components/Layouts/LayoutHomePage/WhyChooseUs";
import { MainServiceSection } from "../components/Layouts/LayoutHomePage/MainServiceSection";
import { FeaturedSection } from "../components/Layouts/LayoutHomePage/FeaturedSection";
import { DoctorSection } from "../components/Layouts/LayoutHomePage/DoctorSection";
import { TestimonialsSection } from "../components/Layouts/LayoutHomePage/TestimonialsSection";
import { BlogSection } from "../components/Layouts/LayoutHomePage/BlogSection";
import { FAQSection } from "../components/Layouts/LayoutHomePage/FAQSection";
import { Footer } from "../components/Layouts/LayoutHomePage/Footer";
export const HomePage = () => {
  return (
    <div className="wrap">
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <Navbar />
      </header>
      <main>
        {/* Section: hero */}
        <SectionHero />

        {/* Section: Dịch vụ chính */}
        <MainServiceSection />

        {/* Section: Giá trị cốt lõi */}
        <WhyChooseUs />

        {/* Section: Gói dịch vụ nổi bật */}
        <FeaturedSection />

        {/* Section: Đội ngũ chuyên gia */}
        <DoctorSection />

        {/* Section: Đánh giá khách hàng */}
        <TestimonialsSection />

        {/* Section: Blog & Tin tức */}
        <BlogSection />

        {/* Section: FAQ */}
        <FAQSection />
      </main>
      <footer className="bg-gray-100 text-gray-700 text-sm">
        <Footer />
      </footer>
    </div>
  );
};
