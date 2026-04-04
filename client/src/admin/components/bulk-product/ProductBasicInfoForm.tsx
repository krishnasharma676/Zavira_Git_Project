
import React from 'react';
import { Package, Layers, Info } from 'lucide-react';

interface ProductBasicInfoFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  formData,
  setFormData,
  categories,
}) => {
  return (
    <section className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <header className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#7A578D]/10 rounded-sm text-[#7A578D]">
                <Package size={18} />
             </div>
             <h2 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Master Identity Archetype</h2>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-sm border border-gray-100">
             <Info size={12} className="text-gray-400"/>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Registry Profile</span>
          </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Artifact Identity Descriptor</label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Structure the master name of the artifact..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-tighter transition-all shadow-inner placeholder:italic group"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categorical Archive Hub</label>
          <div className="relative">
             <select
               required
               value={formData.categoryId}
               onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest cursor-pointer transition-all appearance-none shadow-inner"
             >
               <option value="">Nexus_SELECT_HUB</option>
               {categories.map((cat) => (
                 <option key={cat.id} value={cat.id}>
                   {cat.name.toUpperCase()} Nexus
                 </option>
               ))}
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <Layers size={16}/>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Universal Price (₹)</label>
             <input
               type="number"
               required
               value={formData.basePrice}
               onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black transition-all shadow-inner"
             />
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nexus Sale Price (₹)</label>
             <input
               type="number"
               value={formData.discountedPrice}
               onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black transition-all shadow-inner"
             />
           </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Narrative Description Ledger</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Structure the comprehensive operational narrative for this artifact..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-bold text-gray-700 resize-none transition-all shadow-inner placeholder:italic leading-relaxed tracking-tighter"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductBasicInfoForm;
