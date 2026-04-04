
import React from 'react';
import { X, ChevronRight } from 'lucide-react';

interface ProductGalleryViewerProps {
  galleryView: {
    isOpen: boolean;
    images: any[];
    activeIndex: number;
  };
  setGalleryView: (view: any) => void;
}

const ProductGalleryViewer: React.FC<ProductGalleryViewerProps> = ({
  galleryView,
  setGalleryView,
}) => {
  if (!galleryView.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={() => setGalleryView({ ...galleryView, isOpen: false })}
      />
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-sm overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-4 right-6 z-30">
          <button
            onClick={() => setGalleryView({ ...galleryView, isOpen: false })}
            className="w-8 h-8 bg-black/50 hover:bg-black text-white backdrop-blur-md transition-all rounded-full flex items-center justify-center border border-white/20"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-100 relative overflow-hidden group">
          <button
            disabled={galleryView.activeIndex === 0}
            onClick={() =>
              setGalleryView({
                ...galleryView,
                activeIndex: galleryView.activeIndex - 1,
              })
            }
            className={`absolute left-6 z-20 p-4 rounded-full bg-white/80 hover:bg-white shadow-xl border border-gray-200 text-gray-900 transition-all transform hover:scale-110 active:scale-95 ${
              galleryView.activeIndex === 0
                ? 'opacity-0 scale-90 pointer-events-none'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronRight size={28} className="rotate-180" />
          </button>
          <img
            key={galleryView.activeIndex}
            src={galleryView.images[galleryView.activeIndex]?.imageUrl}
            className="max-w-full max-h-full object-contain animate-in fade-in duration-500 shadow-2xl"
            alt="Gallery focus"
          />
          <button
            disabled={galleryView.activeIndex === galleryView.images.length - 1}
            onClick={() =>
              setGalleryView({
                ...galleryView,
                activeIndex: galleryView.activeIndex + 1,
              })
            }
            className={`absolute right-6 z-20 p-4 rounded-full bg-white/80 hover:bg-white shadow-xl border border-gray-200 text-gray-900 transition-all transform hover:scale-110 active:scale-95 ${
              galleryView.activeIndex === galleryView.images.length - 1
                ? 'opacity-0 scale-90 pointer-events-none'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex justify-center gap-3 overflow-x-auto shadow-inner no-scrollbar">
          {galleryView.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setGalleryView({ ...galleryView, activeIndex: i })}
              className={`w-16 h-16 rounded-sm overflow-hidden border-2 shrink-0 transition-all ${
                i === galleryView.activeIndex
                  ? 'border-[#7A578D] scale-110 shadow-lg z-10'
                  : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img src={img.imageUrl} className="w-full h-full object-cover" alt="Gallery thumbnail" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGalleryViewer;
