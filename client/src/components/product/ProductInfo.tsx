import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import PurchaseActions from './PurchaseActions';

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
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{product.name}</p>
        
        {/* Rating Badge - DYNAMIC */}
        <div className="inline-flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 px-3 py-1.5 mb-4 rounded-[3px] text-sm font-bold text-gray-800 dark:text-gray-200 hover:border-black transition-colors cursor-pointer">
          <span className="flex items-center gap-1">
            {product.reviews?.length > 0 
              ? (product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length).toFixed(1) 
              : "0.0"}
            <Star size={14} className="text-[#7A578D] fill-[#7A578D] -mt-[0.5px]" />
          </span>
          <span className="text-gray-300 font-light mx-1">|</span>
          <span className="text-[#7A578D] font-normal">
            {product.reviews?.length >= 1000 
              ? `${(product.reviews.length / 1000).toFixed(1)}k` 
              : (product.reviews?.length || 0)} Ratings
          </span>
        </div>

        <hr className="border-gray-200 dark:border-white/10 mb-5" />

        {/* Pricing - DYNAMIC */}
        <div className="flex items-baseline space-x-3 mb-1">
          <span className="text-2xl text-gray-900 dark:text-white font-bold">
            {formatCurrency(product.discountedPrice || product.basePrice || 0).replace('₹', '₹ ')}
          </span>
          {product.discountedPrice && product.basePrice > product.discountedPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                MRP {formatCurrency(product.basePrice || 0).replace('₹', '₹ ')}
              </span>
              <span className="text-lg font-bold text-[#FF905A]">
                ({Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)}% OFF)
              </span>
            </>
          )}
        </div>
        <p className="text-[#7A578D] text-[13px] font-bold mb-5">inclusive of all taxes</p>

        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-6 text-xs max-w-lg">
          {product.description}
        </p>

        {/* Color Variants - DYNAMIC */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-8">
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-gray-900 dark:text-white mb-4">MORE COLOR</h4>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant && setSelectedVariant(variant)}
                  className={`relative flex items-center justify-center transition-all duration-300 rounded-full group outline-none`}
                  title={variant.color}
                >
                  <div 
                    className={`rounded-full p-0.5 transition-all duration-300 border ${
                      selectedVariant?.id === variant.id ? 'border-[#7A578D] scale-110 shadow-sm' : 'border-transparent hover:border-gray-300'
                    }`} 
                  >
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-100 shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: variant.colorCode || '#E5E7EB' }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes - DYNAMIC */}
        {(selectedVariant?.sizes?.length > 0 || product.sizes) && (
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-4">
            </div>
            <div className="flex flex-wrap gap-3">
              {(selectedVariant?.sizes && selectedVariant.sizes.length > 0) ? (
                selectedVariant.sizes.map((sObj: any) => (
                  <button
                    key={sObj.id}
                    disabled={sObj.stock <= 0}
                    onClick={() => setSelectedSize && setSelectedSize(sObj.size)}
                    className={`w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all rounded-full ${
                      selectedSize === sObj.size 
                        ? 'border-[#7A578D] text-[#7A578D] border-2' 
                        : sObj.stock > 0 
                          ? 'border-gray-200 text-gray-700 hover:border-[#7A578D] dark:border-gray-700 dark:text-gray-300'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed border-dashed bg-gray-50'
                    }`}
                  >
                    <span>{sObj.size}</span>
                  </button>
                ))
              ) : (
                String(product.sizes || '').split(',').map((s: string) => s.trim()).filter(Boolean).map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize && setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all rounded-full ${
                      selectedSize === size 
                        ? 'border-[#7A578D] text-[#7A578D] border-2' 
                        : 'border-gray-200 text-gray-700 hover:border-[#7A578D] dark:border-gray-700 dark:text-gray-300'
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
      </div>
    </div>
  );
};

export default ProductInfo;

