
import React from 'react';
import { Package, Truck, Palette, AlertTriangle } from 'lucide-react';

interface ProductDetailsExpandedProps {
  product: any;
  columnsLength: number;
}

const ProductDetailsExpanded: React.FC<ProductDetailsExpandedProps> = ({
  product,
  columnsLength,
}) => {
  if (!product) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Product Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Package size={18} className="text-[#7A578D]" /> Bulk Identity
              </h3>
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2">Description Ledger</span>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed max-w-[350px]">
                  {product.description || 'No description provided'}
                </p>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                  <Truck size={18} className="text-[#7A578D]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Shipping Hub</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weight:</span>
                  <span className="text-xs font-black text-gray-900">{product.weight || 0} KG</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dims (LxWxH):</span>
                  <span className="text-xs font-black text-gray-900">
                    {product.length || 0}x{product.width || 0}x{product.height || 0} CM
                  </span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tax Rate:</span>
                  <span className="text-xs font-black text-gray-900">{product.taxRate || 0}% GST</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">HSN Code:</span>
                  <span className="text-xs font-mono font-black text-gray-900">{product.hsnCode || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Breakdown */}
          <div className="space-y-3 lg:border-l-2 lg:border-gray-200 lg:pl-10 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Palette size={18} className="text-[#7A578D]" /> Color Variant Matrix
              </h3>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-sm shadow-inner">
                {product.variants?.length || 0} Colors Managed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.variants?.length > 0 ? (
                product.variants.map((v: any) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-sm hover:shadow-lg hover:border-[#7A578D]/30 transition-all group cursor-default shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm overflow-hidden border border-gray-100 shrink-0 shadow-sm relative group-hover:scale-110 transition-transform">
                        <img
                          src={v.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'}
                          className="w-full h-full object-cover"
                          alt="Variant focus"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{v.color}</span>
                        <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                          #{v.id}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                      <span
                        className={`text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm ${
                          (v.inventory?.stock || 0) > 0
                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                            : 'bg-red-50/50 border-red-100 text-red-600'
                        }`}
                      >
                        {v.inventory?.stock || 0} UNITS
                      </span>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-xl ring-1 ring-black/5"
                        style={{ backgroundColor: v.colorCode }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-16 flex flex-col items-center justify-center bg-white rounded-sm border-2 border-dashed border-gray-200">
                  <AlertTriangle className="text-gray-300 mb-4" size={48} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    No active variants detected
                  </p>
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
