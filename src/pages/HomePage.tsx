import React, { useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import PopularServices from '../components/PopularServices';
import WhyChooseUs from '../components/WhyChooseUs';
import SafetyTrust from '../components/SafetyTrust';
import Testimonials from '../components/Testimonials';
import BecomeAPro from '../components/BecomeAPro';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'HomeMaidy - Professional Home Cleaning Services';
  }, []);

  return (
    <PageContainer isHomePage>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <PopularServices />
      <WhyChooseUs />
      <SafetyTrust />
      <Testimonials />
      <BecomeAPro />
      <FinalCTA />
      <Footer />
    </PageContainer>
  );
};

export default HomePage;