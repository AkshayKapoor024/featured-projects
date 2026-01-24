import React from 'react';
import Hero from '../components/Hero';
import BattleModes from '../components/BattleModes';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    // Responsive Container: Prevents horizontal scroll from animations & ensures full height
    <div className="min-h-screen bg-[#020617] text-white w-full overflow-x-hidden flex flex-col relative">
      <main className="flex-grow w-full">
        <Hero />
        <BattleModes />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;