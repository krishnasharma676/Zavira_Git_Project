import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface MegaMenuProps {
  categories: any[];
  isActive: (path: string) => boolean;
}

const MegaMenu = ({ categories, isActive }: MegaMenuProps) => {
  return (
    <li className="group flex items-center h-full py-4 -my-4">
      <button className={`flex items-center space-x-1 hover:text-[#7A578D] group-hover:text-[#7A578D] transition-colors ${isActive('/collections') ? 'text-[#7A578D]' : ''}`}>
        <span>CATEGORIES</span>
        <ChevronDown size={14} className="group-hover:rotate-180 group-hover:text-[#7A578D] transition-transform duration-300 text-gray-400" />
      </button>

      {/* Mega Menu Panel */}
      <div className="absolute left-0 right-0 top-full w-full bg-white dark:bg-[#0D0D0D] shadow-2xl border-t border-gray-100 dark:border-white/5 z-[150] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden pb-8 border-b-4 border-[#7A578D]">
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="grid grid-cols-5 gap-6">
            {(categories.length > 0 ? categories : [
              { id: '1', name: 'Earrings', imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=300', slug: 'earrings' },
              { id: '2', name: 'Necklace', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300', slug: 'necklace' },
              { id: '3', name: 'Rings', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300', slug: 'rings' },
              { id: '4', name: 'Bracelets', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300', slug: 'bracelets' },
              { id: '5', name: 'Hair Accessories', imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=300', slug: 'hair-accessories' }
            ]).map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group/item flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-50 dark:bg-zinc-900">
                   <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200 group-hover/item:text-[#7A578D]">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaMenu;
