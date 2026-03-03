import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, Sun, Moon, Clock } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useWishlist } from '../store/useWishlist';
import api from '../api/axios';

import zaviraLogo from '../assets/zavira-logo.png';
import AnnouncementBar from './navbar/AnnouncementBar';
import UserMenu from './navbar/UserMenu';
import SearchModal from './navbar/SearchModal';
import MobileMenu from './navbar/MobileMenu';
import NavLinks from './navbar/NavLinks';
import AuthModal from './auth/AuthModal';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, categoryRes] = await Promise.all([
          api.get('/banners'),
          api.get('/categories')
        ]);
        
        const announcementBanners = bannerRes.data.data.filter((b: any) => b.type === 'ANNOUNCEMENT');
        setAnnouncements(announcementBanners);
        setCategories(categoryRes.data.data || []);
      } catch {
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const { data } = await api.get('/products', {
            params: { search: searchQuery, limit: 6 }
          });
          setSearchResults(data.data.products || []);
        } catch {
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const { openDrawer } = useCartDrawer();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 w-full z-50 bg-white dark:bg-[#121212] font-sans transition-colors duration-300">
      {/* Top Bar: Logo & Icons */}
      <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        
        {/* Left: Mobile Toggle */}
        <div className="flex-1 flex items-center justify-start shrink-0">
          <button
            className="lg:hidden text-gray-800 dark:text-gray-200"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center text-center">
          <Link to="/" className="flex items-center">
            <img src={zaviraLogo} alt="Zavira Logo" className="h-9 md:h-12 lg:h-13 w-auto object-contain" />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex-1 flex items-center justify-end space-x-4 lg:space-x-5 text-gray-800 dark:text-gray-200 shrink-0">
          
          <button onClick={() => setIsSearchOpen(true)} className="hover:text-[#7A578D] transition-colors p-1 hidden lg:block">
            <Search size={22} strokeWidth={1.5} />
          </button>

          <UserMenu 
            user={user} 
            isAuthenticated={isAuthenticated} 
            logout={logout} 
            isActive={isActive} 
          />

          <Link to="/track-order" className={`hover:text-[#7A578D] transition-colors p-1 hidden lg:block ${isActive('/track-order') ? 'text-[#7A578D]' : ''}`}>
             <Clock size={22} strokeWidth={1.5} className={isActive('/track-order') ? 'text-[#7A578D]' : ''} />
          </Link>

          <div className="relative">
            <Link to="/wishlist" className={`hover:text-[#7A578D] transition-colors p-1 block ${isActive('/wishlist') ? 'text-[#7A578D]' : ''}`}>
              <Heart size={22} strokeWidth={1.5} className={isActive('/wishlist') ? 'fill-[#7A578D]' : ''} />
              <span className="absolute -top-1 -right-1 bg-[#C9A0C8] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            </Link>
          </div>

          <div className="relative">
            <button onClick={openDrawer} className="hover:text-[#7A578D] transition-colors p-1 block relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-[#C9A0C8] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </button>
          </div>

          <button onClick={toggleDarkMode} className="hover:text-[#7A578D] transition-colors p-1 block ml-2">
             {isDarkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>

        </div>
      </div>

      <NavLinks categories={categories} isActive={isActive} />

      <AnnouncementBar announcements={announcements} />

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        categories={categories} 
        isActive={isActive} 
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        isSearching={isSearching} 
        searchResults={searchResults} 
      />
      <AuthModal />
    </nav>
  );
};

export default Navbar;


