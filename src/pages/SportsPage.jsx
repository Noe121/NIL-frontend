import SportsHero from '@/components/Sports/SportsHero';
import StudentAthletesCarousel from '@/components/Sports/StudentAthletesCarousel';
import DealsManagement from '@/components/Sports/DealsManagement';
import ComplianceRules from '@/components/Sports/ComplianceRules';
import SportsStatsCTA from '@/components/Sports/SportsStatsCTA';
import Testimonials from '@/components/Landing/Testimonials';
import EarlyAccess from '@/components/Landing/EarlyAccess';
import Footer from '@/components/Landing/Footer';
import { useNavigate } from 'react-router-dom';

const SportsPage = () => {
  const navigate = useNavigate();

  const handleAthleteClick = (athleteId) => {
    navigate(`/athlete/${athleteId}`);
  };

  return (
    <>
      <SportsHero />
      <StudentAthletesCarousel onAthleteClick={handleAthleteClick} />
      <DealsManagement />
      <ComplianceRules />
      <SportsStatsCTA />
      <Testimonials />
      <EarlyAccess />
      <Footer />
    </>
  );
};

export default SportsPage;
