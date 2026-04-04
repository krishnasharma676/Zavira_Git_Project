
import React from 'react';
import { Package, Truck, Clock, Layers, AlertTriangle } from 'lucide-react';

interface ProductDetailsExpandedProps {
  product: any;
  columnsLength: number;
}

const ProductDetailsExpanded: React.FC<ProductDetailsExpandedProps> = ({
  product,
  columnsLength,
}) => {
  if (!product) return null;

  const specs = product.attributes ? Object.entries(product.attributes) : [];

  return (
    <tr className="bg-gray-50/30">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          
          {/* Identity & Fiscal Metadata */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2">
                <Package size={14}/> Identity Archive
             </h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Internal UUID</span>
                   <span className="text-[10px] font-mono font-black text-gray-900 tracking-tighter truncate max-w-[150px]" title={product.id}>{product.id}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pricing Structure</span>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-gray-900 tracking-tighter">₹{product.discountedPrice || product.basePrice}</span>
                      {product.discountedPrice && (
                        <span className="text-[9px] font-bold text-gray-300 line-through">₹{product.basePrice}</span>
                      )}
                   </div>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fiscal Identifiers</span>
                   <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[9px] font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-0.5 rounded border border-[#7A578D]/10">HSN: {product.hsnCode || 'NP'}</span>
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">TAX: {product.taxRate || 0}%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Logistics & Inventory Matrix */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2">
                <Truck size={14}/> Logistics Nexus
             </h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mass Displacement</span>
                   <span className="text-[10px] font-black text-gray-900 uppercase">
                      {product.weight || 0} {product.weightUnit || 'KG'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Spatial Dimensions</span>
                   <span className="text-[10px] font-black text-gray-900 uppercase">
                      {product.length || 0} x {product.width || 0} x {product.height || 0} {product.dimensionUnit || 'CM'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock Integrity</span>
                   <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${(product.inventory?.stock || 0) < 10 ? 'bg-red-500 shadow-lg shadow-red-500/30 animate-pulse' : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${(product.inventory?.stock || 0) < 10 ? 'text-red-700' : 'text-emerald-700'}`}>
                         {product.inventory?.stock || 0} UNITS_AVAILABLE
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Temporal & Categorical Archive */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2">
                <Clock size={14}/> History Nexus
             </h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Origin Archive</span>
                   <span className="font-black text-[10px] text-gray-900 uppercase">
                      {new Date(product.createdAt).toLocaleDateString()}
                      <span className="text-[9px] text-gray-400 ml-2">{new Date(product.createdAt).toLocaleTimeString()}</span>
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Categorical Hub</span>
                   <div className="flex items-center gap-2 mt-1">
                      <Layers size={12} className="text-[#7A578D]"/>
                      <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest">
                         {product.category?.name || 'ROOT_INDEXED'}
                      </span>
                   </div>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Exposure State</span>
                   <div className="mt-1">
                      {product.hotDeals ? (
                         <span className="text-[8px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-sm shadow-sm tracking-widest uppercase">HOT_DEAL_ACTIVE</span>
                      ) : (
                         <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-sm tracking-widest uppercase">STANDARD_EXPOSURE</span>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Descriptive Narrative */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Narrative Archive</h3>
             <div className="bg-white border border-gray-100 p-4 rounded-sm shadow-sm relative group overflow-hidden h-full min-h-[120px]">
                <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-5">
                   <Package size={64}/>
                </div>
                <p className="text-[10px] font-bold text-gray-700 leading-relaxed uppercase tracking-tighter relative z-10 italic">
                   {product.description || 'No descriptive narrative archived for this product artifact.'}
                </p>
             </div>
          </div>

          {/* Specifications Matrix */}
          <div className="md:col-span-4 mt-2 space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" /> Specifications Ledger <div className="h-px flex-1 bg-gray-200" />
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {specs.length > 0 ? specs.map(([key, value], idx) => (
                  <div key={idx} className="flex flex-col p-3 bg-white border border-gray-50 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#7A578D] transition-colors">{key}</span>
                     <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter truncate" title={String(value)}>{String(value)}</span>
                  </div>
                )) : (
                  <div className="col-span-full py-4 text-center border border-dashed border-gray-100 rounded-sm">
                     <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">No technical specifications archived for this unit.</span>
                  </div>
                )}
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ProductDetailsExpanded;
