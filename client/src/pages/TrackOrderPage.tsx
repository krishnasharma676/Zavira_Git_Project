import { useState } from 'react';

import TrackForm from '../components/track/TrackForm';

const TrackOrderPage = () => {
  const [searchBy, setSearchBy] = useState('orderId');

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0D0D0D] font-sans flex flex-col transition-colors duration-300">
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-[#121212] py-6 border-b border-gray-100 dark:border-white/5 shadow-sm">
        <div className="container mx-auto px-4 flex justify-center">
          <h2 className="text-3xl font-sans font-black tracking-tight text-[#7A578D]">Zavira</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <TrackForm searchBy={searchBy} setSearchBy={setSearchBy} />
      </main>

      {/* Footer Bar */}
      <footer className="bg-white dark:bg-[#121212] py-6 border-t border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4 md:mb-0">
            <span>Email: <a href="mailto:Hello@zavira.com" className="hover:text-[#7A578D] dark:hover:text-[#7A578D] transition-colors">Hello@zavira.com</a></span>
            <span className="hidden md:inline text-gray-200 dark:text-white/5">|</span>
            <span>Concierge: 9643196811</span>
            <span className="hidden md:inline text-gray-200 dark:text-white/5">|</span>
            <a href="/privacy" className="hover:text-[#7A578D] dark:hover:text-[#7A578D] transition-colors">Privacy Policy</a>
          </div>
          <div className="flex items-center space-x-2 grayscale dark:invert opacity-40 hover:opacity-100 transition-opacity">
            <span>Powered By</span>
            <img 
              src="https://www.shiprocket.in/wp-content/uploads/2019/02/shiprocket_logo_header.png" 
              alt="Shiprocket" 
              className="h-4"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackOrderPage;

