import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [zoomStyle, setZoomStyle] = useState<{[key: number]: string}>({});

  if (!images || images.length === 0) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    
    setZoomStyle({
      [idx]: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 gap-1 md:gap-2">
        {images.map((img: string, idx: number) => (
          <div 
            key={idx} 
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={handleMouseLeave}
            className={`w-full overflow-hidden bg-gray-50 dark:bg-[#1A1A1A] relative cursor-crosshair ${
              idx === 0 && images.length % 2 !== 0 ? 'col-span-2' : ''
            }`}
          >
            <img
              src={img}
              alt={`${productName} - View ${idx + 1}`}
              style={{ 
                transformOrigin: zoomStyle[idx] || 'center center',
              }}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.8]`}
              loading={idx > 1 ? "lazy" : "eager"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
