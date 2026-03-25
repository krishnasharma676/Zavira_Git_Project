import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface MegaMenuProps {
  categories: any[];
  isActive: (path: string) => boolean;
}

const MegaMenu = ({ categories, isActive }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <li 
      className="flex items-center h-full py-4 -my-4"

      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        onClick={toggleMenu}
        className={`flex items-center space-x-1 hover:text-[#7A578D] transition-colors ${isActive('/collections') || isOpen ? 'text-[#7A578D]' : ''}`}
      >
        <span>CATEGORIES</span>
        <ChevronDown size={14} className={`transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-[#7A578D]' : ''}`} />
      </button>

      <div className={`absolute left-0 right-0 top-full w-full bg-white dark:bg-[#0D0D0D] shadow-2xl border-t border-gray-100 dark:border-white/5 z-[150] transition-all duration-300 overflow-hidden pb-4 border-b-4 border-[#7A578D] ${
        isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'
      }`}>
        <div className="container mx-auto px-4 lg:px-8 pt-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {(categories.length > 0 ? categories : [
              { id: '1', name: 'Earrings', imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=300', slug: 'earrings' },
              { id: '2', name: 'Necklace', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300', slug: 'necklace' },
              { id: '3', name: 'Rings', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300', slug: 'rings' },
              { id: '4', name: 'Bracelets', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300', slug: 'bracelets' },
              { id: '5', name: 'Hair Accessories', imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=300', slug: 'hair-accessories' }
            ]).map((cat) => (
              <Link 
                key={cat.id} 
                to={`/shop?category=${cat.slug}`} 
                className="group/item flex flex-col items-center"
                onClick={closeMenu}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-50 dark:border-white/5">
                   <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-800 dark:text-gray-200 group-hover/item:text-[#7A578D] text-center leading-tight line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </li>
  );
};

export default MegaMenu;
