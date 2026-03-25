import { Search } from 'lucide-react';
import ProductCard from '../ProductCard';

interface ProductGridProps {
  products: any[];
  loading: boolean;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  addItem: (item: any) => void;
  setSearchParams: (params: any) => void;
}

const ProductGrid = ({
  products,
  loading,
  toggleItem,
  isInWishlist,
  addItem,
  setSearchParams
}: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {loading ? (
        Array(8).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-[#1A1A1A] w-full aspect-[4/5] rounded-xl mb-4" />
            <div className="h-3 bg-gray-100 dark:bg-[#1A1A1A] rounded-full w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 dark:bg-[#1A1A1A] rounded-full w-1/2" />
          </div>
        ))
      ) : products.length > 0 ? (
        products.map((product: any) => (
          <ProductCard 
            key={product._cardKey || product.id}

            product={product} 
            toggleItem={toggleItem} 
            isInWishlist={isInWishlist} 
            addItem={addItem} 
          />
        ))
      ) : (
        <div className="col-span-full py-20 text-center">
           <div className="text-gray-300 dark:text-gray-700 flex justify-center mb-4">
              <Search size={48} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">No products found</h3>
           <p className="text-sm text-gray-500 mb-8 mt-2">Try adjusting your filters or search terms.</p>
            <button onClick={() => setSearchParams({})} className="luxury-button rounded-full">CLEAR ALL FILTERS</button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
