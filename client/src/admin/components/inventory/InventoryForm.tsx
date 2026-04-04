
import React from 'react';
import { Package, Truck, Image as ImageIcon, Upload, X, RefreshCw, Trash2, Layers } from 'lucide-react';

interface InventoryFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
  attributes: { key: string; value: string }[];
  setAttributes: (attrs: any[]) => void;
  existingImages: { id: string; imageUrl: string }[];
  previewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number, type: 'existing' | 'new') => void;
  removeExistingImage: (id: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingProduct: any;
  generateSKU: (name: string) => string;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  formData,
  setFormData,
  categories,
  attributes,
  setAttributes,
  existingImages,
  previewUrls,
  handleImageChange,
  removeImage,
  removeExistingImage,
  handleSubmit,
  isSubmitting,
  editingProduct,
  generateSKU,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      {editingProduct && (
        <div className="bg-[#7A578D]/5 p-4 rounded-sm border border-[#7A578D]/10 flex items-center justify-between">
            <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest">Master Artifact Identifier</span>
            <span className="text-[10px] font-mono font-black text-[#7A578D] uppercase tracking-tighter">{editingProduct.id}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Metadata */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Artifact Name</label>
          <input 
            required 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            disabled={isSubmitting} 
            placeholder="Structure the name of the artifact..."
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black uppercase tracking-tighter disabled:opacity-50 transition-all shadow-inner" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categorical Hub</label>
          <div className="relative">
             <select 
                required 
                value={formData.categoryId} 
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })} 
                disabled={isSubmitting} 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black uppercase tracking-widest disabled:opacity-50 appearance-none shadow-inner"
             >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <Layers size={14}/>
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Integrity</label>
          <input 
            type="number" 
            value={formData.stock} 
            onChange={e => setFormData({ ...formData, stock: e.target.value })} 
            disabled={isSubmitting} 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black disabled:opacity-50 shadow-inner" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Universal Price (₹)</label>
          <input 
            type="number" 
            required 
            value={formData.basePrice} 
            onChange={e => setFormData({ ...formData, basePrice: e.target.value })} 
            disabled={isSubmitting} 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black disabled:opacity-50 shadow-inner" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fiscal Deduction (₹)</label>
          <input 
            type="number" 
            value={formData.discountedPrice} 
            onChange={e => setFormData({ ...formData, discountedPrice: e.target.value })} 
            disabled={isSubmitting} 
            placeholder="Market sale price..."
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black disabled:opacity-50 shadow-inner" 
          />
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU Identification</label>
          <div className="relative">
            <input 
                value={formData.sku} 
                onChange={e => setFormData({ ...formData, sku: e.target.value })} 
                disabled={isSubmitting} 
                placeholder="ZV-MASTER-ARCHIVE" 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-mono font-black uppercase tracking-widest disabled:opacity-50 pr-12 shadow-inner" 
            />
            <button 
                type="button" 
                onClick={() => setFormData({ ...formData, sku: generateSKU(formData.name) })} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#7A578D] transition-colors active:rotate-180 duration-500"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dimensional Variance</label>
          <input 
            value={formData.sizes} 
            onChange={e => setFormData({ ...formData, sizes: e.target.value })} 
            disabled={isSubmitting} 
            placeholder="S, M, L (Separated by comma)" 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black uppercase tracking-widest disabled:opacity-50 shadow-inner" 
          />
        </div>

        {/* Logistics Nexus Details */}
        <div className="md:col-span-2 p-6 bg-gray-50/50 border border-gray-100 rounded-sm space-y-4 shadow-sm">
          <header className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
            <div className="p-2 bg-[#7A578D]/10 rounded-sm text-[#7A578D]">
               <Truck size={18} />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Logistics Fulfillment Archive</h3>
          </header>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Weight */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Mass Property</label>
              <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden focus-within:border-[#7A578D] transition-all shadow-sm">
                <input type="number" step="0.01" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="0.5" className="w-full bg-transparent py-2.5 px-4 outline-none text-xs font-black text-gray-900 border-r border-gray-50" />
                <select value={formData.weightUnit} onChange={e => setFormData({...formData, weightUnit: e.target.value})} className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-3 outline-none cursor-pointer uppercase tracking-widest">
                  <option value="kg">KG</option>
                  <option value="gm">GM</option>
                </select>
              </div>
            </div>

            {/* Spatial Dimensions */}
            {[
              { label: 'Length Axis', key: 'length' },
              { label: 'Width Axis', key: 'width' },
              { label: 'Height Axis', key: 'height' }
            ].map((dim) => (
              <div key={dim.key} className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">{dim.label}</label>
                <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden focus-within:border-[#7A578D] transition-all shadow-sm">
                  <input type="number" value={formData[dim.key]} onChange={e => setFormData({ ...formData, [dim.key]: e.target.value })} placeholder="10" className="w-full bg-transparent py-2.5 px-4 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                  <select 
                     value={dim.key === 'length' ? formData.dimensionUnit : (dim.key === 'width' ? formData.widthUnit : formData.heightUnit)} 
                     onChange={e => setFormData({...formData, [dim.key === 'length' ? 'dimensionUnit' : (dim.key === 'width' ? 'widthUnit' : 'heightUnit')]: e.target.value})} 
                     className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-2 outline-none cursor-pointer uppercase"
                  >
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                    <option value="inch">IN</option>
                  </select>
                </div>
              </div>
            ))}

            {/* HSN & Tax */}
            <div className="col-span-2 space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Fiscal HSN Code</label>
              <input value={formData.hsnCode} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} placeholder="e.g. 6109 (GARMENT ARCHIVE)" className="w-full bg-white border border-gray-200 rounded-sm py-2.5 px-4 outline-none focus:border-[#7A578D] text-xs font-black uppercase shadow-sm placeholder:italic" />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Tax Liability (%)</label>
              <input type="number" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: e.target.value })} placeholder="18" className="w-full bg-white border border-gray-200 rounded-sm py-2.5 px-4 outline-none focus:border-[#7A578D] text-xs font-black shadow-sm" />
            </div>
          </div>
        </div>

        {/* exposure Strategy */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-4 cursor-pointer bg-orange-50 border border-orange-100 p-4 rounded-sm hover:bg-orange-100 transition-all group shadow-sm active:scale-[0.98]">
            <div className="relative">
                <input type="checkbox" checked={formData.hotDeals} onChange={e => setFormData({ ...formData, hotDeals: e.target.checked })} className="peer hidden" />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-all"></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-md"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-orange-900 uppercase tracking-widest">Aggressive Exposure (HOT DEAL)</span>
              <span className="text-[10px] font-bold text-orange-700/70 uppercase">Elevate product prominence in the marketplace nexus.</span>
            </div>
          </label>
        </div>

        {/* Narrative Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Narrative Archive</label>
          <textarea 
            rows={4} 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-4 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium text-gray-700 resize-none disabled:opacity-50 shadow-inner placeholder:italic" 
            placeholder="Structure the comprehensive operational narrative for this artifact..." 
          />
        </div>

        {/* Asset Management */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="p-2 bg-[#7A578D]/5 rounded-sm text-[#7A578D]">
               <ImageIcon size={18} />
            </div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Visual Artifact Ledger</label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#7A578D] transition-all group shadow-sm active:scale-95">
              <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              <div className="p-3 bg-white rounded-full shadow-md group-hover:bg-[#7A578D] group-hover:text-white transition-all">
                 <Upload size={24} className="text-gray-400 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black text-gray-400 mt-3 uppercase tracking-widest">Add Artifact</span>
            </label>

            {existingImages.map(img => (
              <div key={img.id} className="aspect-square rounded-sm overflow-hidden relative group border-2 border-transparent hover:border-[#7A578D] transition-all shadow-sm">
                <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    type="button" 
                    onClick={() => removeExistingImage(img.id)} 
                    className="text-white hover:text-red-400 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}

            {previewUrls.map((url, i) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden relative group border-2 border-[#7A578D] shadow-xl animate-in zoom-in-90">
                <img src={url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <button type="button" onClick={() => removeImage(i, 'new')} className="text-white bg-red-600 p-2 rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl"><X size={18} /></button>
                </div>
                <div className="absolute top-2 right-2 bg-[#7A578D] text-white text-[8px] font-black px-2 py-1 rounded-sm shadow-xl uppercase tracking-widest">Staged</div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7A578D]/5 rounded-sm text-[#7A578D]">
                   <FileText size={18} />
                </div>
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Technical Ledger</label>
            </div>
            <button 
                type="button" 
                onClick={() => setAttributes([...attributes, { key: '', value: '' }])} 
                className="text-[9px] font-black text-white bg-black px-4 py-2 rounded-sm hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95 border-b-2 border-black/30"
            >
              + ARCHIVE PROPERTY
            </button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
            {attributes.map((attr, i) => (
              <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-sm p-1 shadow-inner focus-within:border-[#7A578D]/30 transition-all">
                   <input 
                      placeholder="Property (e.g. FABRIC)" 
                      value={attr.key} 
                      onChange={e => { const u = [...attributes]; u[i].key = e.target.value; setAttributes(u); }} 
                      className="w-full bg-transparent py-2.5 px-4 outline-none text-[10px] font-black uppercase tracking-widest text-[#7A578D] placeholder:text-gray-300" 
                   />
                </div>
                <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-sm p-1 shadow-inner focus-within:border-[#7A578D]/30 transition-all">
                   <input 
                      placeholder="Value (e.g. PREMIUM COTTON)" 
                      value={attr.value} 
                      onChange={e => { const u = [...attributes]; u[i].value = e.target.value; setAttributes(u); }} 
                      className="w-full bg-transparent py-2.5 px-4 outline-none text-[10px] font-black uppercase tracking-tighter text-gray-900 placeholder:text-gray-300" 
                   />
                </div>
                <button type="button" onClick={() => setAttributes(attributes.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 p-2 transition-all hover:rotate-12"><Trash2 size={18} /></button>
              </div>
            ))}
            {attributes.length === 0 && (
              <div className="py-8 text-center bg-gray-50/30 border-2 border-dashed border-gray-100 rounded-sm group hover:border-[#7A578D]/20 transition-all">
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic flex items-center justify-center gap-3">
                    <AlertTriangle size={16} className="opacity-40" />
                    No technical properties staged for this archival entry.
                 </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full h-14 bg-black text-white rounded-sm text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 border-b-4 border-black/30 group"
      >
        {isSubmitting ? (
          <>
            <RefreshCw size={24} className="animate-spin" />
            <span>SYNCHRONIZING_ARCHIVE...</span>
          </>
        ) : (
          <>
            <Package size={24} className="group-hover:translate-y-[-2px] transition-transform" />
            <span>{editingProduct ? 'COMMIT_ARTIFACT_UPDATES' : 'COMMISSION_NEW_ARTIFACT'}</span>
          </>
        )}
      </button>
    </form>
  );
};

const FileText = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;

export default InventoryForm;
