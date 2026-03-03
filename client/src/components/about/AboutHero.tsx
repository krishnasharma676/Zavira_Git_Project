import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="container mx-auto px-6 mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-luxury-gold uppercase tracking-[0.4em] text-[8px] mb-4 font-bold">The Verve Legacy</p>
          <h1 className="text-3xl md:text-5xl font-sans uppercase tracking-widest leading-tight mb-6">
            Where Art <br /> <span className="italic">Meets</span> Eternity
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-base mb-8">
            Since 2026, Verve has been redefining the landscape of luxury. We don't just craft jewelry; we curate memories that transcend generations. Every gemstone is a chapter, every setting a masterpiece.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
           <img src="https://images.unsplash.com/photo-1573408302185-91275f923992?q=80&w=1000" className="w-full aspect-[4/5] object-cover shadow-2xl" alt="Atelier" />
           <div className="absolute -bottom-10 -left-10 w-64 h-64 border border-luxury-gold/30 -z-10 hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
