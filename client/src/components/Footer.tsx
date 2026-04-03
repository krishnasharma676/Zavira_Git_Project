import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Truck, 
  RefreshCw, 
  CreditCard
} from 'lucide-react';
import zaviraLogo from '../assets/zavira-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zavira-blackDeep text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800 pt-14 pb-8 transition-colors duration-300 font-sans relative overflow-hidden">
      
      {/* Background Accent: Minimalist Brand Watermark */}
      <div className="absolute top-0 -right-16 opacity-[0.03] dark:opacity-[0.06] pointer-events-none select-none -mt-4">
        <h1 className="text-[140px] font-black font-serif italic leading-none tracking-tighter">Zaviraa</h1>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Main Content Area */}
        <div className="max-w-5xl space-y-8">
          
          {/* Logo */}
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src={zaviraLogo} alt="Zaviraa" className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* Simple Message */}
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl font-serif italic text-gray-400 leading-snug">
              Beautiful <span className="text-zavira-purple font-black not-italic opacity-100">Jewelry for You</span>. High quality designs for your special moments.
            </p>

            {/* Horizontal Navigation Links */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2 border-b border-gray-50 dark:border-white/5 pb-6">
               {[
                 { name: 'Track Orders', path: '/track-order' },
                 { name: 'FAQ', path: '/contact' },
                 { name: 'Contact Us', path: '/contact' },
                 { name: 'Shop All', path: '/shop' }
               ].map((link) => (
                 <Link 
                   key={link.name} 
                   to={link.path} 
                   className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 hover:text-zavira-purple transition-all pb-0.5"
                 >
                   {link.name}
                 </Link>
               ))}
            </div>

            {/* Combined Icons Row: Socials + Trusts (3 remaining) */}
            <div className="flex flex-wrap items-center gap-8 pt-2">
              
              {/* Social Media Group */}
              <div className="flex gap-4 border-r border-gray-100 dark:border-white/5 pr-8">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-zavira-purple hover:bg-zavira-purple/10 transition-all border border-gray-100 dark:border-white/5">
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                ))}
              </div>

              {/* Repositioned Trust Features (3 remaining boxes) */}
              <div className="flex flex-wrap gap-8">
                 {[
                   { icon: Truck, title: 'Safe Delivery', desc: 'Secure Shipping' },
                   { icon: RefreshCw, title: 'Easy Returns', desc: '14 Day Exchange' },
                   { icon: CreditCard, title: 'Safe Payment', desc: 'Secure Checkout' }
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <feat.icon size={18} className="text-zavira-purple opacity-70" />
                      <div>
                         <h6 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{feat.title}</h6>
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-none opacity-60">{feat.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

            </div>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="pt-10 mt-14 flex flex-col md:flex-row justify-between items-center gap-4 text-xxs font-black uppercase tracking-widest text-gray-400 border-t border-gray-50 dark:border-white/5">
           <div className="flex items-center gap-8">
              <Link to="/privacy-policy" className="hover:text-zavira-purple transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-zavira-purple transition-colors">Terms of Service</Link>
              <p className="opacity-40 normal-case tracking-normal font-medium italic">© {currentYear} Zaviraa. Handcrafted in Bharat.</p>
           </div>
           
           <div className="flex items-center gap-4 grayscale opacity-30 h-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-full w-auto" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-full w-auto" alt="Mastercard" />
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
