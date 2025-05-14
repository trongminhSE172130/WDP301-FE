import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import AboutSection from '../components/home/AboutSection';
import BlogSection from '../components/home/BlogSection';
import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <BlogSection />
      <CTASection />
    </div>
  );
};

export default HomePage;