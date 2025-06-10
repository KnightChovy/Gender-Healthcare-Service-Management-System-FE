import React from "react";

import { SectionHero } from "../../components/Layouts/LayoutHomePage/SectionHero";
import { WhyChooseUs } from "../../components/Layouts/LayoutHomePage/WhyChooseUs";
import { MainServiceSection } from "../../components/Layouts/LayoutHomePage/MainServiceSection";
import { FeaturedSection } from "../../components/Layouts/LayoutHomePage/FeaturedSection";
import { DoctorSection } from "../../components/Layouts/LayoutHomePage/DoctorSection";
import { TestimonialsSection } from "../../components/Layouts/LayoutHomePage/TestimonialsSection";
import { BlogSection } from "../../components/Layouts/LayoutHomePage/BlogSection";
import { FAQSection } from "../../components/Layouts/LayoutHomePage/FAQSection";
import { Footer } from "../../components/Layouts/LayoutHomePage/Footer";
import { Navbar } from "../../components/ui/Navbar";

export const HomePage = () => {
  return (
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
  );
};
