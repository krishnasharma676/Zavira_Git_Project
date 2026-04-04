
import React from 'react';
import { Trash2, RefreshCw, Upload, Plus, Palette, Box, Layers, Image as ImageIcon, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface VariantItemProps {
  variant: any;
  variantIndex: number;
  variants: any[];
  setVariants: (v: any[]) => void;
  productName: string;
  generateSKU: (name?: string) => string;
  onRemoveVariant: (index: number) => void;
  onImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (vIndex: number, iIndex: number) => void;
  onDeleteLiveImage: (vIndex: number, imgId: string) => void;
  onAddSize: (vIndex: number) => void;
  onRemoveSize: (vIndex: number, sIndex: number) => void;
}

const VariantItem: React.FC<VariantItemProps> = ({
  variant,
  variantIndex,
  variants,
  setVariants,
  productName,
  generateSKU,
  onRemoveVariant,
  onImageChange,
  onRemoveImage,
  onDeleteLiveImage,
  onAddSize,
  onRemoveSize,
}) => {
  return (
    <div className="bg-white rounded-sm border border-gray-100 shadow-sm relative overflow-hidden group/var hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-bottom-4 ring-1 ring-[#7A578D]/5">
      
      {/* Structural Header Hub */}
      <header className="flex flex-col lg:flex-row items-stretch lg:items-center bg-gray-50/50 border-b border-gray-100 p-6 gap-6">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-black text-white rounded-sm flex items-center justify-center text-xl font-black shadow-2xl border-b-4 border-[#7A578D]/50 relative group">
              {variantIndex + 1}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#7A578D] rounded-full animate-ping opacity-20" />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Color Artifact Identification</span>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">{variant.color || 'Nexus_PENDING_COLOR'}</h4>
           </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="relative group">
              <input
                placeholder="COLOR_Nexus_DESCRIPTOR"
                value={variant.color}
                onChange={(e) => {
                  const v = [...variants];
                  v[variantIndex].color = e.target.value;
                  setVariants(v);
                }}
                className="w-full bg-white border border-gray-200 rounded-sm py-4 px-12 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest shadow-inner transition-all placeholder:italic group-hover:border-gray-300"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A578D]">
                 <Palette size={18} />
              </div>
           </div>
           
           <div className="flex gap-3">
              <div className="relative flex-1 group">
                <input
                  type="color"
                  value={variant.colorCode}
                  onChange={(e) => {
                    const v = [...variants];
                    v[variantIndex].colorCode = e.target.value;
                    setVariants(v);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="w-full h-full min-h-[50px] rounded-sm border border-gray-200 flex items-center gap-4 px-5 bg-white shadow-inner hover:border-[#7A578D]/40 transition-all group-hover:scale-[1.01]">
                  <div className="w-8 h-8 rounded-sm border border-black/10 shadow-lg transform rotate-3 flex items-center justify-center" style={{ backgroundColor: variant.colorCode }}>
                     <div className="w-full h-full bg-white/20 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] font-mono font-black text-gray-900 uppercase tracking-widest">{variant.colorCode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { if(window.confirm('Terminate this color artifact?')) onRemoveVariant(variantIndex); }}
                className="px-5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all border border-gray-100 hover:border-red-200 shadow-sm active:scale-90 group-hover:bg-white"
              >
                <Trash2 size={24} />
              </button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-x divide-gray-100 p-4 lg:p-0">
        
        {/* Dimension Matrix Axis */}
        <div className="lg:col-span-8 p-8 space-y-6">
           <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-black rounded-sm text-white">
                    <Layers size={18}/>
                 </div>
                 <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">Dimension Registry Matrix</h5>
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100">
                 <span className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest">{variant.sizes?.length || 0} ACTIVE_DIMENSIONS</span>
              </div>
           </header>

           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             {variant.sizes.map((sizeObj: any, sizeIndex: number) => (
               <div
                 key={sizeIndex}
                 className="group/size bg-gray-50/30 rounded-sm border border-gray-100 p-6 space-y-5 transition-all hover:bg-white hover:shadow-2xl hover:border-[#7A578D]/30 shadow-sm relative overflow-hidden animate-in zoom-in-95"
               >
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Axis_{sizeIndex + 1}</span>
                    </div>
                   <button
                     type="button"
                     onClick={() => onRemoveSize(variantIndex, sizeIndex)}
                     className="text-gray-300 hover:text-red-500 transition-all bg-white rounded-full p-2 hover:scale-110 shadow-sm border border-gray-100"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>

                 <div className="space-y-4 relative z-10">
                   <div className="relative group">
                      <input
                        placeholder="Dimensional Scalar (e.g. XL, 42)"
                        value={sizeObj.size}
                        onChange={(e) => {
                          const v = [...variants];
                          v[variantIndex].sizes[sizeIndex].size = e.target.value;
                          setVariants(v);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-sm py-3 px-10 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 transition-all shadow-inner"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                         <Box size={16} />
                      </div>
                   </div>

                   <div className="flex gap-4">
                     <div className="w-28 relative">
                        <input
                          type="number"
                          placeholder="SYNC_QTY"
                          value={sizeObj.stock}
                          onChange={(e) => {
                            const v = [...variants];
                            v[variantIndex].sizes[sizeIndex].stock = e.target.value;
                            setVariants(v);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 text-xs font-black outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 transition-all shadow-inner"
                        />
                        <div className="absolute right-3 top-[-8px] bg-white text-[8px] font-black text-gray-300 px-1 uppercase tracking-widest">Qty</div>
                     </div>
                     <div className="flex-1 relative group">
                       <input
                         placeholder="SKU_Nexus_Nexus"
                         value={sizeObj.sku}
                         onChange={(e) => {
                           const v = [...variants];
                           v[variantIndex].sizes[sizeIndex].sku = e.target.value;
                           setVariants(v);
                         }}
                         className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 pr-12 text-xs font-mono font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 transition-all shadow-inner"
                       />
                       <button
                         type="button"
                         onClick={() => {
                           const v = [...variants];
                           v[variantIndex].sizes[sizeIndex].sku = generateSKU(productName || variant.color);
                           setVariants(v);
                         }}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#7A578D] transition-all duration-500 hover:rotate-180"
                       >
                         <RefreshCw size={16} />
                       </button>
                        <div className="absolute right-3 top-[-8px] bg-white text-[8px] font-black text-gray-300 px-1 uppercase tracking-widest">Master SKU</div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Decorative Structural Element */}
                 <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] rotate-12 group-hover/size:rotate-0 transition-transform duration-1000">
                    <Box size={120} />
                 </div>
               </div>
             ))}
             
             <button
               type="button"
               onClick={() => onAddSize(variantIndex)}
               className="h-full min-h-[180px] border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center gap-4 text-gray-300 hover:border-[#7A578D] hover:text-[#7A578D] hover:bg-white transition-all bg-gray-50/50 group/add shadow-inner active:scale-95"
             >
               <div className="p-4 rounded-full bg-white shadow-xl border border-gray-100 group-hover/add:scale-110 group-hover/add:bg-black group-hover/add:text-white transition-all">
                 <Plus size={28} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">COMMISSION_DIMENSION</span>
             </button>
           </div>
        </div>

        {/* Visual Asset Archive Nexus */}
        <div className="lg:col-span-4 p-8 bg-gray-50/20 space-y-6">
           <header className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-2">
              <div className="p-2 bg-[#7A578D]/5 rounded-sm text-[#7A578D]">
                 <ImageIcon size={18} />
              </div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7A578D]">Asset Registry Hub</h5>
           </header>

           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             <label className="aspect-square bg-gray-100 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-[#7A578D] hover:bg-white transition-all group/upload relative overflow-hidden shadow-inner active:scale-95">
               <input
                 type="file"
                 multiple
                 className="hidden"
                 onChange={(e) => onImageChange(variantIndex, e)}
                 accept="image/*"
               />
               <Upload
                 size={32}
                 className="text-gray-300 group-hover/upload:text-[#7A578D] transition-all relative z-10 mb-3 group-hover/upload:-translate-y-2 duration-500"
               />
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] relative z-10 group-hover/upload:text-[#7A578D]">
                 Nexus_ARCHIVE
               </span>
               <div className="absolute inset-0 bg-[#7A578D]/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
             </label>

             {variant.existingImages?.map((img: any) => (
               <div
                 key={img.id}
                 className="aspect-[3/4] rounded-sm overflow-hidden relative group/img border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-700"
               >
                 <img
                   src={img.imageUrl}
                   className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover/img:grayscale-0 group-hover/img:scale-110"
                   alt="Color variant immersion"
                 />
                 <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-[4px]">
                   <button
                     type="button"
                     onClick={() => { if(window.confirm('Terminate this visual artifact?')) onDeleteLiveImage(variantIndex, img.id); }}
                     className="bg-white/10 hover:bg-red-500 text-white p-4 rounded-full transition-all shadow-2xl scale-50 group-hover/img:scale-100 duration-500 border border-white/20"
                   >
                     <Trash2 size={24} />
                   </button>
                 </div>
                 <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest shadow-2xl border border-emerald-400/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE_Nexus
                 </div>
               </div>
             ))}

             {variant.previewUrls.map((url: string, i: number) => (
               <div
                 key={i}
                 className="aspect-[3/4] rounded-sm overflow-hidden relative group/img border-2 border-[#7A578D] shadow-2xl animate-in zoom-in-95 duration-500"
               >
                 <img src={url} className="w-full h-full object-cover" alt="Staged asset" />
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                   <button
                     type="button"
                     onClick={() => onRemoveImage(variantIndex, i)}
                     className="text-white bg-red-600 shadow-2xl p-3 rounded-full hover:scale-125 transition-all"
                   >
                     <Trash2 size={20} />
                   </button>
                 </div>
                 <div className="absolute top-3 left-3 bg-[#7A578D] text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest shadow-2xl border border-[#7A578D]/50 flex items-center gap-1.5">
                    <Zap size={10} className="animate-pulse" />
                    STAGED_Nexus
                 </div>
               </div>
             ))}
           </div>
           
           {(!variant.existingImages?.length && !variant.previewUrls?.length) && (
             <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-sm bg-gray-50/20 group-hover/var:bg-white transition-all">
                <AlertTriangle size={24} className="text-gray-200 mb-2"/>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-center px-4">No visual artifacts archived for this color stream.</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VariantItem;
