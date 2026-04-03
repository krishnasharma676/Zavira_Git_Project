import { Sparkles } from 'lucide-react';

import EmptyCart from '../components/cart/EmptyCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCartPage } from '../hooks/useCartPage';

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, tax, shipping, total } = useCartPage();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] pt-8 pb-24 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
             <header className="mb-12">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A0C8] mb-4">
                  <Sparkles size={14} />
                  <span>Review your items</span>
                </div>
                <h1 className="text-4xl font-sans font-black uppercase tracking-tight text-gray-900 dark:text-white mb-4">Shopping Cart</h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{items.length} Items in your cart</p>
             </header>

             <div className="space-y-10">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    removeItem={removeItem} 
                    updateQuantity={updateQuantity} 
                  />
                ))}
             </div>
          </div>

          {/* Sidebar */}
          <CartSummary 
            subtotal={subtotal} 
            tax={tax} 
            shipping={shipping} 
            total={total} 
          />

        </div>
      </div>
    </div>
  );
};

export default CartPage;

