import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CreditCard,
  Mail,
  ArrowRight,
  Phone,
  MapPin
} from 'lucide-react';
import zaviraLogo from '../assets/zavira-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#080808] text-gray-800 dark:text-gray-300 transition-colors duration-500 font-sans relative overflow-hidden pt-8 border-t border-gray-100 dark:border-white/5">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#7A578D]/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7A578D]/20 to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Section: Newsletter & Brand Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 border-b border-gray-100 dark:border-white/5 pb-10">
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Sign up for <span className="italic text-[#7A578D]">exclusive</span> early access.
            </h2>
            <div className="relative max-w-md group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-5 text-[11px] font-black tracking-[0.2em] focus:outline-none focus:border-[#7A578D] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
              <button className="absolute right-0 bottom-5 text-gray-400 group-focus-within:text-[#7A578D] transition-colors flex items-center gap-2 hover:translate-x-1 transform transition-transform">
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Join The Club</span>
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-12 xl:col-span-6 xl:offset-1 lg:flex items-center gap-10">
            <div className="hidden lg:block w-px h-24 bg-gray-100 dark:bg-white/5 mx-auto" />
            <div className="space-y-4 flex-1">
              <p className="text-[14px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium italic">
                "Zaviraa isn't just about jewelry; it's about the <span className="text-gray-900 dark:text-white font-bold">moments</span> and <span className="text-gray-900 dark:text-white font-bold">memories</span> they represent. We craft each piece with the same devotion you give to your most cherished relationships."
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0D0D0D] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i*10}`} alt="User" />
                      </div>
                    ))}
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Joined by 50,000+ others</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Main Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-3 space-y-6">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img src={zaviraLogo} alt="Zavira" className="h-8 w-auto object-contain dark:contrast-125" />
            </Link>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 group cursor-pointer">
                <MapPin size={14} className="text-[#7A578D] opacity-40 group-hover:opacity-100" />
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Gujarat, Bharat</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 group cursor-pointer">
                <Phone size={14} className="text-[#7A578D] opacity-40 group-hover:opacity-100" />
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+91 99999 00000</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-7 h-7 rounded-full border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-[#7A578D] hover:border-[#7A578D]/30 transition-all hover:-translate-y-0.5">
                   <Icon size={12} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5 lg:offset-1">
            <h3 className="text-gray-900 dark:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">Curation</h3>
            <ul className="space-y-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {['Bridal Suite', 'The Gold Bar', 'Solitaires', 'Classics', 'New Arrivals'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="hover:text-[#7A578D] transition-all hover:pl-1 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-gray-900 dark:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">Heritage</h3>
            <ul className="space-y-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {['Our Origin', 'Craftsmanship', 'Bespoke', 'Ethics', 'Press'].map(item => (
                <li key={item}>
                  <Link to="/about" className="hover:text-[#7A578D] transition-all hover:pl-1 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-gray-900 dark:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">Support</h3>
            <ul className="space-y-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               {['Appointments', 'Size Guide', 'Returns', 'Tracking', 'Contact'].map(item => (
                <li key={item}>
                  <Link to="/track-order" className="hover:text-[#7A578D] transition-all hover:pl-1 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2 space-y-5">
            <h3 className="text-gray-900 dark:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">Newsletter</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
              Join our list for exclusive releases & artisan stories.
            </p>
            <div className="relative group/input pt-1">
              <input 
                type="email" 
                placeholder="EMAIL" 
                className="w-full bg-transparent border-b border-gray-100 dark:border-white/10 py-2 text-[10px] font-black tracking-widest focus:outline-none focus:border-[#7A578D] transition-all"
              />
              <ArrowRight size={14} className="absolute right-0 bottom-2 text-gray-300 group-focus-within/input:text-[#7A578D] transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Giant Typographic Logo */}
        <div className="relative pt-2 pb-2 overflow-hidden select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex justify-center">
            <h1 className="text-[10vw] font-serif font-black tracking-tighter leading-none text-[#7A578D] uppercase">
                ZAVIRAA
            </h1>
        </div>

        {/* Global Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-white/5 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-40 grayscale">
            {[
              { icon: ShieldCheck, text: 'Certified Gold' },
              { icon: Truck, text: 'Insured Delivery' },
              { icon: RefreshCw, text: 'Easy Returns' },
              { icon: CreditCard, text: 'Secure Checkout' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                <item.icon size={16} strokeWidth={1.5} className="text-[#7A578D]" />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
             <div className="flex items-center gap-6">
                <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">T&C</Link>
                <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookie Settings</Link>
             </div>
             <p className="opacity-60">
               © {currentYear} Zaviraa. <span className="text-[#7A578D] italic lowercase tracking-tight">Handcrafted Excellence.</span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


