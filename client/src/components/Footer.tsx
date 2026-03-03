import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import zaviraLogo from '../assets/zavira-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFCFD] dark:bg-[#0D0D0D] text-gray-800 dark:text-gray-300 transition-colors duration-500 font-sans relative overflow-hidden border-t border-gray-100 dark:border-white/5">
      {/* Decorative Gradient elements for Dark Mode */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7A578D]/20 to-transparent" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#7A578D]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#C9A0C8]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 pt-12 pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-500">
              <img src={zaviraLogo} alt="Zavira" className="h-10 w-auto object-contain dark:brightness-110" />
            </Link>
            <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium max-w-sm">
              Dedicated to the art of exceptional craftsmanship. Every piece in our collection is a testament to timeless elegance and modern sophistication.
            </p>
            <div className="flex space-x-5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-1.5 rounded-full border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-[#7A578D] hover:border-[#7A578D] transition-all duration-300">
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4">
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-[0.2em] relative inline-block">
                Shop
                <span className="absolute -bottom-1 left-0 w-4 h-px bg-[#7A578D]"></span>
              </h3>
              <ul className="space-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                {['Bridal Suite', 'Gold Jewelry', 'Diamonds', 'Modern Styles', 'New Arrivals'].map(item => (
                  <li key={item}>
                    <Link to="/shop" className="hover:text-[#7A578D] hover:translate-x-1 transition-all duration-300 inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] relative inline-block">
                About Us
                <span className="absolute -bottom-1 left-0 w-4 h-px bg-[#7A578D]"></span>
              </h3>
              <ul className="space-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                {['Our Story', 'How it’s Made', 'Custom Jewelry', 'Gifts', 'Sustainability'].map(item => (
                  <li key={item}>
                    <Link to="/about" className="hover:text-[#7A578D] hover:translate-x-1 transition-all duration-300 inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 col-span-2 md:col-span-1">
              <h3 className="text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] relative inline-block">
                Customer Support
                <span className="absolute -bottom-1 left-0 w-4 h-px bg-[#7A578D]"></span>
              </h3>
              <ul className="space-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                {['Shipping Information', 'Authenticity', 'Returns & Exchange', 'Track Your Order'].map(item => (
                  <li key={item}>
                    <Link to="/track-order" className="hover:text-[#7A578D] hover:translate-x-1 transition-all duration-300 inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-30 grayscale scale-90">
            {[ShieldCheck, Truck, RefreshCw, CreditCard].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={16} strokeWidth={1} />
                <span className="text-[8px] font-black uppercase tracking-widest">Certified</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block border-r border-gray-100 dark:border-gray-800 pr-6">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Located In</p>
               <p className="text-[11px] font-sans italic dark:text-white">Bharat</p>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
               © {currentYear} Zavira. <span className="text-[#7A578D] italic">Elegance Redefined.</span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


