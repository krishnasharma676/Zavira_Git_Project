
import React from 'react';
import { X, ChevronRight } from 'lucide-react';

interface GalleryViewerProps {
  galleryView: { isOpen: boolean; images: any[]; activeIndex: number };
  setGalleryView: (view: any) => void;
}

const GalleryViewer: React.FC<GalleryViewerProps> = ({ galleryView, setGalleryView }) => {
  if (!galleryView.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 backdrop-blur-3xl ring-inset ring-1 ring-white/10">
      <div className="absolute inset-0 bg-black/95 transition-all" onClick={() => setGalleryView({ ...galleryView, isOpen: false })} />
      <div className="relative bg-white/5 w-full max-w-6xl h-[90vh] rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col border border-white/10 animate-in zoom-in-95 duration-500">
        
        {/* Navigation Controls Hub */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 shadow-2xl">
             Artifact {galleryView.activeIndex + 1} <span className="mx-2 opacity-20">/</span> {galleryView.images.length}
          </div>
          <button 
            onClick={() => setGalleryView({ ...galleryView, isOpen: false })} 
            className="w-12 h-12 bg-white/10 backdrop-blur-xl hover:bg-red-500 hover:text-white transition-all rounded-full flex items-center justify-center text-white/80 border border-white/10 hover:border-red-400 group active:scale-90"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
        
        {/* Main Immersion Area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden group">
          <button 
            disabled={galleryView.activeIndex === 0} 
            onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex - 1 })} 
            className={`absolute left-8 z-20 w-16 h-16 rounded-full bg-white/5 backdrop-blur-2xl shadow-2xl flex items-center justify-center text-white border border-white/10 transition-all ${galleryView.activeIndex === 0 ? 'opacity-0 scale-75 pointer-events-none' : 'hover:bg-white hover:text-black hover:scale-110 active:scale-95'}`}
          >
            <ChevronRight size={32} className="rotate-180" />
          </button>
          
          <img 
            key={galleryView.activeIndex} 
            src={galleryView.images[galleryView.activeIndex]?.imageUrl} 
            className="max-w-[85%] max-h-[85%] object-contain p-4 animate-in zoom-in-95 fade-in duration-700 select-none pointer-events-none" 
            alt="Asset immersion" 
            style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,1))' }}
          />
          
          <button 
            disabled={galleryView.activeIndex === galleryView.images.length - 1} 
            onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex + 1 })} 
            className={`absolute right-8 z-20 w-16 h-16 rounded-full bg-white/5 backdrop-blur-2xl shadow-2xl flex items-center justify-center text-white border border-white/10 transition-all ${galleryView.activeIndex === galleryView.images.length - 1 ? 'opacity-0 scale-75 pointer-events-none' : 'hover:bg-white hover:text-black hover:scale-110 active:scale-95'}`}
          >
            <ChevronRight size={32} />
          </button>

          {/* Asset Info Overlay */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-10 py-5 rounded-[24px] border border-white/5 shadow-2xl flex flex-col items-center gap-2 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-700 delay-100">
             <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Asset Resolution</span>
             <span className="text-white text-[11px] font-black uppercase tracking-widest">{galleryView.images[galleryView.activeIndex]?.id || 'MASTER_SOURCE'}</span>
          </div>
        </div>
        
        {/* Horizontal Navigation Ledger */}
        <div className="px-8 py-8 bg-black/50 backdrop-blur-4xl border-t border-white/5 flex justify-center items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          {galleryView.images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setGalleryView({ ...galleryView, activeIndex: i })} 
              className={`relative w-20 h-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-500 ${i === galleryView.activeIndex ? 'border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] ring-8 ring-white/5' : 'border-transparent grayscale opacity-20 hover:grayscale-0 hover:opacity-100 hover:scale-105 active:scale-90 hover:border-white/20'}`}
            >
              <img src={img.imageUrl} className="w-full h-full object-cover" alt="Asset reference" />
              {i === galleryView.activeIndex && (
                 <div className="absolute inset-0 bg-white/10 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryViewer;
