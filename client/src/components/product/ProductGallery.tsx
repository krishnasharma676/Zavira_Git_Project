import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  productName: string;
}

const ProductGallery = ({ images, selectedImage, setSelectedImage, productName }: ProductGalleryProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imgRef.current) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative aspect-[4/3] lg:max-h-[480px] bg-gray-50 dark:bg-[#1A1A1A] overflow-hidden group rounded-xl cursor-crosshair shadow-sm border border-gray-100 dark:border-white/5 mx-auto"
        onMouseMove={handleMouseMove}


        onMouseLeave={() => {
          if(imgRef.current) {
            imgRef.current.style.transformOrigin = 'center center';
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            ref={imgRef}
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={images[selectedImage]}
            className="w-full h-full object-contain bg-white dark:bg-black transition-transform duration-200 group-hover:scale-[1.8] ease-out will-change-transform"

            style={{ transformOrigin: "center center" }}
            alt={productName}
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </motion.div>
      
      <div className="flex flex-wrap gap-2 md:gap-3">
        {images.map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden border-2 transition-all rounded-lg ${
              selectedImage === idx ? 'border-[#7A578D] shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt="" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
