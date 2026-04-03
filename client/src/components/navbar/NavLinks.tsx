import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';

interface NavLinksProps {
  categories: any[];
  isActive: (path: string) => boolean;
}

const NavLinks = ({ categories, isActive }: NavLinksProps) => {
  return (
    <div className="hidden lg:block bg-white dark:bg-[#121212] transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="w-full relative py-3">
        <ul className="flex items-center justify-center space-x-10 text-[14px] font-bold uppercase text-gray-900 dark:text-gray-100 tracking-normal">
          <MegaMenu categories={categories} isActive={isActive} />

          <li className="flex items-center relative">
            <Link to="/hot-deals" className={`hover:text-[#7A578D] transition-colors relative flex items-center ${isActive('/hot-deals') ? 'text-[#7A578D]' : ''}`}>
              HOT DEALS
              <div className="absolute -top-3.5 -right-7 bg-[#ed4c14] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm scale-90 -rotate-2 transform">
                SALE
              </div>
            </Link>
          </li>

          <li className="flex items-center">
            <Link to="/shop" className={`hover:text-[#7A578D] transition-colors ${isActive('/shop') ? 'text-[#7A578D]' : ''}`}>STORE</Link>
          </li>
          <li className="flex items-center">
            <Link to="/track-order" className={`hover:text-[#7A578D] transition-colors ${isActive('/track-order') ? 'text-[#7A578D]' : ''}`}>TRACK ORDER</Link>
          </li>
          <li className="flex items-center">
            <Link to="/contact" className={`hover:text-[#7A578D] transition-colors ${isActive('/contact') ? 'text-[#7A578D]' : ''}`}>CONTACT US</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavLinks;
