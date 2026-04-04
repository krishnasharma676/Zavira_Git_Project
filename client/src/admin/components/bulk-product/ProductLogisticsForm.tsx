
import React from 'react';
import { Truck, Scale, Box, Ruler, FileText, Percent } from 'lucide-react';

interface ProductLogisticsFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

const ProductLogisticsForm: React.FC<ProductLogisticsFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <section className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-2">
         <div className="p-2 bg-[#7A578D]/5 rounded-sm text-[#7A578D]">
            <Truck size={18} />
         </div>
         <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7A578D]">Logistics Intelligence Matrix</h3>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Mass Archive */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 flex items-center gap-2">
             <Scale size={10} /> Mass
          </label>
          <div className="flex bg-gray-50/50 border border-gray-200 rounded-sm overflow-hidden focus-within:ring-4 focus-within:ring-[#7A578D]/5 focus-within:border-[#7A578D]/40 transition-all shadow-inner">
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="0.5"
              className="w-full bg-transparent py-2.5 px-4 outline-none text-xs font-black text-gray-900 border-r border-gray-100"
            />
            <select
              value={formData.weightUnit}
              onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
              className="bg-gray-100/30 px-3 outline-none text-[10px] font-black uppercase text-[#7A578D] cursor-pointer hover:bg-gray-100 transition-colors tracking-widest"
            >
              <option value="kg">KG</option>
              <option value="gm">GM</option>
            </select>
          </div>
        </div>

        {/* Spatial Axis Mapping */}
        {[
          { label: 'Length', key: 'length', unitKey: 'dimensionUnit', icon: Ruler },
          { label: 'Width', key: 'width', unitKey: 'widthUnit', icon: Ruler },
          { label: 'Height', key: 'height', unitKey: 'heightUnit', icon: Ruler },
        ].map((dim) => (
          <div key={dim.key} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 flex items-center gap-2">
               <dim.icon size={10} /> {dim.label}
            </label>
            <div className="flex bg-gray-50/50 border border-gray-200 rounded-sm overflow-hidden focus-within:ring-4 focus-within:ring-[#7A578D]/5 focus-within:border-[#7A578D]/40 transition-all shadow-inner">
              <input
                type="number"
                value={formData[dim.key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [dim.key]: e.target.value })}
                placeholder="10"
                className="w-full bg-transparent py-2.5 px-4 outline-none text-xs font-black text-gray-900 border-r border-gray-100"
              />
              <select
                value={formData[dim.unitKey as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [dim.unitKey]: e.target.value })}
                className="bg-gray-100/30 px-3 outline-none text-[10px] font-black uppercase text-[#7A578D] cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="cm">CM</option>
                <option value="mm">MM</option>
                <option value="inch">IN</option>
              </select>
            </div>
          </div>
        ))}

        {/* Fiscal Compliance Nexus */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 flex items-center gap-2">
             <FileText size={10} /> HSN_CODE
          </label>
          <input
            value={formData.hsnCode}
            onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
            placeholder="ARCHIVE_CODE"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-2.5 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase shadow-inner transition-all placeholder:italic tracking-widest"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 flex items-center gap-2">
             <Percent size={10} /> Liability
          </label>
          <div className="relative">
             <input
               type="number"
               value={formData.taxRate}
               onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
               placeholder="18"
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-2.5 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black shadow-inner transition-all"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 font-black text-[10px] uppercase">% TAX</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductLogisticsForm;
