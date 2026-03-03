const PhilosophySection = () => {
  const principles = [
    {
      title: 'Purity',
      description: 'Only the finest ethically sourced gemstones and 18k+ solid gold enter our atelier.'
    },
    {
      title: 'Precision',
      description: 'Each piece undergoes 200+ hours of artisan calibration for perfect brilliance.'
    },
    {
      title: 'Passion',
      description: 'Handcrafted rituals that celebrate the soul of the materials we work with.'
    }
  ];

  return (
    <section className="bg-luxury-cream/30 dark:bg-white/5 py-20 mb-20">
      <div className="container mx-auto px-6 text-center max-w-4xl">
         <h2 className="text-2xl font-sans uppercase tracking-widest mb-12">The Artisan Ethos</h2>
         <div className="grid md:grid-cols-3 gap-10">
            {principles.map((principle) => (
              <div key={principle.title}>
                <h3 className="text-luxury-gold text-[9px] uppercase tracking-[0.3em] font-bold mb-4">{principle.title}</h3>
                <p className="text-xs font-light leading-relaxed text-gray-600 dark:text-gray-400">{principle.description}</p>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
