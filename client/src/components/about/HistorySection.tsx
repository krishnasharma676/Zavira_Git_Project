const HistorySection = () => {
  return (
    <section className="container mx-auto px-6 mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
           <img src="https://images.unsplash.com/photo-1626784215021-2e39ccf541e5?q=80&w=1000" className="w-full aspect-square object-cover" alt="History" />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-sans uppercase tracking-widest mb-8">A Tradition of Innovation</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-luxury-gold pl-8 py-1.5">
              <span className="text-luxury-gold font-sans text-lg italic mb-1 block">2026</span>
              <p className="text-xs font-light italic text-gray-600 dark:text-gray-400">The birth of Verve in the heart of the design district.</p>
            </div>
            <div className="border-l-2 border-gray-100 dark:border-white/10 pl-8 py-1.5">
              <span className="text-gray-400 font-sans text-lg italic mb-1 block">Present</span>
              <p className="text-xs font-light italic text-gray-400">Expanding horizons across the global luxury landscape.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
