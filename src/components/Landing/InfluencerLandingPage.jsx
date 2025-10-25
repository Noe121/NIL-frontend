import { useState } from 'react';
import InfluencerHero from '../Landing/InfluencerHero';
import ProofCarousel from '../Landing/ProofCarousel';
import TierGrid from '../Landing/TierGrid';
import NicheFilters from '../Landing/NicheFilters';
import InfluencerGrid from '../Landing/InfluencerGrid';
import CreatorTestimonials from '../Landing/CreatorTestimonials';
import FinalCTA from '../Landing/FinalCTA';
import Footer from '../Landing/Footer';

export default function InfluencerLandingPage() {
  const [activeNiches, setActiveNiches] = useState([]);

  const handleNicheFilterChange = (filters) => {
    setActiveNiches(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <InfluencerHero />

      {/* Social Proof Carousel */}
      <ProofCarousel />

      {/* Tier System */}
      <TierGrid />

      {/* Niche Filters */}
      <NicheFilters onFilterChange={handleNicheFilterChange} />

      {/* Influencer Grid */}
      <InfluencerGrid filters={activeNiches} />

      {/* Testimonials */}
      <CreatorTestimonials />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
