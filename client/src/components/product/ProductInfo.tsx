import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import PurchaseActions from './PurchaseActions';
import LuxuryBadges from './LuxuryBadges';

interface ProductInfoProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number | ((q: number) => number)) => void;
  selectedVariant?: any;
  setSelectedVariant?: (variant: any) => void;
  selectedSize?: string;
  setSelectedSize?: (size: string) => void;
  handleAddToCart: () => void;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  toast: any;
}

const ProductInfo = ({ product, quantity, setQuantity, selectedVariant, setSelectedVariant, selectedSize, setSelectedSize, handleAddToCart, toggleItem, isInWishlist, toast }: ProductInfoProps) => {
  const primaryPrice = product.discountedPrice || product.basePrice;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#7A578D] uppercase tracking-[0.4em] text-[10px] mb-2 font-black">{product.category?.name || 'Jewelry'}</p>
        <h1 className="text-2xl lg:text-3xl font-sans font-black uppercase tracking-tight mb-3 leading-tight text-gray-900 dark:text-white">{product.name}</h1>
        
        <div className="flex items-center space-x-6 mb-4 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center text-yellow-500">
            <Star size={13} fill="currentColor" />
            <span className="ml-2 text-gray-900 dark:text-gray-200 font-semibold">4.8</span>
          </div>
          <span className="text-gray-400 font-light lowercase">|</span>
          <span className="text-gray-500 font-light lowercase italic tracking-wide">{product.reviews?.length || 0} verified reviews</span>
        </div>

        <div className="flex items-baseline space-x-4 mb-6">
          {product.discountedPrice ? (
            <>
              <span className="text-2xl text-gray-900 dark:text-white font-black">{formatCurrency(product.discountedPrice)}</span>
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatCurrency(product.basePrice || 0)}</span>
              <div className="bg-[#7A578D] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ml-2">Sale</div>
            </>
          ) : (
            <span className="text-2xl text-gray-900 dark:text-white font-black">{formatCurrency(product.basePrice || 0)}</span>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-6 text-xs max-w-lg">
          {product.description}
        </p>

        {/* Color Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-3">Choice of Color</h4>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant && setSelectedVariant(variant)}
                  className={`group relative flex flex-col items-center gap-1.5 transition-all ${
                    selectedVariant?.id === variant.id ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg shadow-lg transition-all duration-300 border-2 overflow-hidden flex items-center justify-center ${
                      selectedVariant?.id === variant.id ? 'border-[#7A578D] shadow-purple-500/20' : 'border-white dark:border-white/10 shadow-sm'
                    }`} 
                    style={{ backgroundColor: variant.colorCode || '#eee' }}
                  >
                    {selectedVariant?.id === variant.id && (
                       <Star size={12} fill="currentColor" className={variant.colorCode?.toUpperCase() === '#FFFFFF' ? 'text-black' : 'text-white'} />
                    )}
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-widest ${
                    selectedVariant?.id === variant.id ? 'text-[#7A578D]' : 'text-gray-400'
                  }`}>
                    {variant.color}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {(selectedVariant?.sizes?.length > 0 || product.sizes) && (
          <div className="mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] mb-3">Select Size</h4>
            <div className="flex flex-wrap gap-2">
              {selectedVariant?.sizes ? (
                selectedVariant.sizes.map((sObj: any) => (
                  <button
                    key={sObj.id}
                    disabled={sObj.stock <= 0}
                    onClick={() => setSelectedSize && setSelectedSize(sObj.size)}
                    className={`min-w-[44px] h-11 px-3 flex flex-col items-center justify-center border font-black text-xs uppercase tracking-widest transition-all rounded-lg ${
                      selectedSize === sObj.size 
                        ? 'border-[#7A578D] bg-[#7A578D] text-white' 
                        : sObj.stock > 0 
                          ? 'border-gray-100 text-gray-900 hover:border-[#7A578D] dark:border-gray-800 dark:text-gray-300'
                          : 'border-gray-50 text-gray-300 cursor-not-allowed bg-gray-50/50'
                    }`}
                  >
                    <span>{sObj.size}</span>
                    <span className="text-[7px] opacity-70 mt-0.5">{sObj.stock > 0 ? `${sObj.stock} IN STOCK` : 'OUT'}</span>
                  </button>
                ))
              ) : (
                product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean).map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize && setSelectedSize(size)}
                    className={`min-w-[40px] h-10 px-3 flex items-center justify-center border font-black text-xs uppercase tracking-widest transition-all rounded-lg ${
                      selectedSize === size 
                        ? 'border-[#7A578D] bg-[#7A578D] text-white' 
                        : 'border-gray-100 text-gray-900 hover:border-[#7A578D] dark:border-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <PurchaseActions 
          product={product} 
          quantity={quantity} 
          setQuantity={setQuantity} 
          handleAddToCart={handleAddToCart} 
          toggleItem={toggleItem} 
          isInWishlist={isInWishlist} 
          primaryPrice={primaryPrice} 
          toast={toast} 
        />

        <LuxuryBadges />
      </div>
    </div>
  );
};

export default ProductInfo;

