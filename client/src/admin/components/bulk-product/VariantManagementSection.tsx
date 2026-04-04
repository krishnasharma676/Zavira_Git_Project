
import React from 'react';
import { Plus, Palette, Layers, Info } from 'lucide-react';
import VariantItem from './VariantItem';

interface VariantManagementSectionProps {
  variants: any[];
  setVariants: (v: any[]) => void;
  productName: string;
  generateSKU: (name?: string) => string;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (vIndex: number, iIndex: number) => void;
  onDeleteLiveImage: (vIndex: number, imgId: string) => void;
  onAddSize: (vIndex: number) => void;
  onRemoveSize: (vIndex: number, sIndex: number) => void;
}

const VariantManagementSection: React.FC<VariantManagementSectionProps> = ({
  variants,
  setVariants,
  productName,
  generateSKU,
  onAddVariant,
  onRemoveVariant,
  onImageChange,
  onRemoveImage,
  onDeleteLiveImage,
  onAddSize,
  onRemoveSize,
}) => {
  return (
    <section className="space-y-6 pt-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-6 bg-white border border-gray-100 rounded-sm shadow-sm gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-[#7A578D]/5 rounded-sm text-[#7A578D] shadow-inner">
              <Palette size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Color Variant Matrix
              </h2>
              <div className="flex items-center gap-2 mt-2">
                 <Layers size={12} className="text-gray-400"/>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {variants.length} ACTIVE_COLOR_Nexus_STREAMS
                 </p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-sm border border-gray-100 italic transition-all hover:bg-white hover:shadow-sm">
              <Info size={12} className="text-[#7A578D]"/>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Commissioning unique color artifacts</span>
           </div>
           <button
             type="button"
             onClick={onAddVariant}
             className="bg-black text-white h-12 px-6 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/20 active:scale-95 border-b-4 border-black/30 group"
           >
             <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
             <span>NEW_COLOR_Nexus</span>
           </button>
        </div>
      </header>

      <div className="space-y-8">
        {variants.map((variant, index) => (
          <div key={index} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
            <VariantItem
              variant={variant}
              variantIndex={index}
              variants={variants}
              setVariants={setVariants}
              productName={productName}
              generateSKU={generateSKU}
              onRemoveVariant={onRemoveVariant}
              onImageChange={onImageChange}
              onRemoveImage={onRemoveImage}
              onDeleteLiveImage={onDeleteLiveImage}
              onAddSize={onAddSize}
              onRemoveSize={onRemoveSize}
            />
          </div>
        ))}

        {variants.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-sm group hover:border-[#7A578D]/30 transition-all opacity-40">
             <Palette size={48} className="text-gray-300 mb-4 group-hover:text-[#7A578D] group-hover:scale-110 transition-all duration-700" />
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">No variants commissioned in current framework.</span>
             <button
               type="button"
               onClick={onAddVariant}
               className="mt-6 text-[10px] font-black text-[#7A578D] bg-white px-6 py-2.5 rounded-full border border-[#7A578D]/20 shadow-xl hover:bg-[#7A578D] hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
             >
                INITIALIZE_FIRST_VARIANT
             </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VariantManagementSection;
