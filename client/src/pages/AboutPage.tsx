import AboutHero from '../components/about/AboutHero';
import PhilosophySection from '../components/about/PhilosophySection';
import HistorySection from '../components/about/HistorySection';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-16 text-luxury-black dark:text-gray-100 transition-colors duration-300 min-h-screen overflow-hidden">
      <AboutHero />
      <PhilosophySection />
      <HistorySection />
    </div>
  );
};

export default AboutPage;

