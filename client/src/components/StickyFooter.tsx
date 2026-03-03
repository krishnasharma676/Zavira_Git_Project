import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useWishlist } from '../store/useWishlist';

const StickyFooter = () => {
  const location = useLocation();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { openDrawer } = useCartDrawer();

  // Cart is special – open drawer. Others are regular Links.
  const navItems = [
    { label: 'Home', icon: Home, path: '/', isCart: false },
    { label: 'Account', icon: User, path: '/profile', isCart: false },
    { label: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlistItems.length, isCart: false },
    { label: 'Cart', icon: ShoppingBag, path: '/cart', badge: totalItems, isCart: true }
  ];

  return (
    <>
      {/* Bottom Sticky Floating Island */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md dark:bg-[#121212]/90 border border-gray-200/50 dark:border-white/10 z-[100] px-8 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-max">
        <div className="flex justify-center items-center space-x-6 sm:space-x-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const content = (
              <>
                <div className="relative flex items-center justify-center">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-[#7A578D] text-white text-[8px] min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center font-black shadow-sm z-10">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
              </>
            );
            return item.isCart ? (
              <button
                key={item.label}
                onClick={openDrawer}
                className={`flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                  isActive ? 'text-[#7A578D]' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {content}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                  isActive ? 'text-[#7A578D]' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StickyFooter;
