
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Check, X, RefreshCw, AlertTriangle, Trash2, Layers, Palette, Box, Activity, PackageCheck, Zap, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const VariantManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit stock state tracking
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [editedStock, setEditedStock] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const pRes = await api.get(`/products/${id}`);
      setProduct(pRes.data.data);

      const vRes = await api.get(`/variants/product/${id}`);
      setVariants(vRes.data.data);
    } catch (e) {
      toast.error('Nexus_NULL: FAILED_TO_SYNC_VARIANT_MATRIX');
      navigate('/admin/bulk-products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleUpdateStock = async (sizeId: string) => {
    if (editingSize !== sizeId) return;
    try {
      const stockVal = parseInt(editedStock);
      if (isNaN(stockVal) || stockVal < 0) {
        toast.error('INVALID_STOCK_VALUE_Sync_ERROR');
        return;
      }
      await api.patch(`/variants/sizes/${sizeId}/stock`, { stock: stockVal });
      toast.success('STOCK_Nexus_SYNCHRONIZED');
      setEditingSize(null);
      fetchData(); 
    } catch {
      toast.error('FAILED_TO_COMMIT_Nexus_UPDATES');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!window.confirm("Terminate this color artifact? This will purge all associated dimensional data.")) return;
    try {
      await api.delete(`/variants/${variantId}`);
      toast.success('ARTIFACT_PURGED_FROM_REGISTRY');
      fetchData();
    } catch {
      toast.error('FAILED_TO_TERMINATE_Nexus_FRAGMENT');
    }
  };

  if (loading) {
     return (
        <div className="flex h-[60vh] items-center justify-center animate-pulse">
            <RefreshCw className="animate-spin text-[#7A578D] shadow-xl shadow-[#7A578D]/20" size={40} />
        </div>
     );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/admin/bulk-products')} 
             className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-400 hover:text-[#7A578D] hover:border-[#7A578D] hover:shadow-xl transition-all shadow-sm flex items-center justify-center active:scale-95 group"
           >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Variant_Nexus_Hub</h1>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">{product?.name} Matrix Core</span>
                 </div>
                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">ID_ARCHIVE: {product?.id}</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-4 bg-black text-white p-6 rounded-sm shadow-2xl border-b-4 border-[#7A578D]">
           <div className="flex flex-col text-right pr-6 border-r border-white/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">COLLECTIVE_QUOTA</span>
              <span className="text-3xl font-black tracking-tighter leading-none">{product?.inventory?.stock || 0}</span>
           </div>
           <PackageCheck size={32} className="text-[#7A578D] opacity-50 ml-2" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-8 duration-700">
        {variants.map((v: any, idx) => (
           <section key={v.id} className="bg-white border border-gray-100 rounded-sm shadow-xl relative group/variant hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/variant:opacity-[0.05] transition-opacity">
                 <Palette size={200} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-x divide-gray-100">
                 {/* Color Identity Immersion */}
                 <div className="lg:col-span-4 p-8 flex flex-col items-center justify-center bg-gray-50/20 relative">
                    <div className="absolute top-4 right-4 z-10">
                       <button 
                         onClick={() => handleDeleteVariant(v.id)} 
                         className="p-3 bg-white text-red-500 border border-red-100 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95 group/purge"
                       >
                         <Trash2 size={24} className="group-hover/purge:rotate-12 transition-transform"/>
                       </button>
                    </div>

                    <div className="w-48 h-64 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-2xl relative group/img transform rotate-1 group-hover/variant:rotate-0 transition-all duration-700">
                       <img 
                         src={v.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x500?text=No+Asset'} 
                         className="w-full h-full object-cover grayscale group-active:grayscale-0 group-hover/variant:grayscale-0 group-hover/variant:scale-110 transition-all duration-1000" 
                         alt="Variant identity immersion" 
                       />
                       <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/10 shadow-2xl">
                          Nexus_STAGED
                       </div>
                    </div>

                    <div className="mt-8 space-y-4 text-center">
                       <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-sm border border-gray-100 shadow-inner group-hover/variant:shadow-xl transition-all w-full min-w-[200px]">
                          <div className="w-8 h-8 rounded-full border-4 border-white shadow-2xl ring-1 ring-black/5" style={{ backgroundColor: v.colorCode || '#000' }} />
                          <div className="text-left">
                             <h3 className="text-sm font-black uppercase tracking-tighter text-gray-900">{v.color}</h3>
                             <span className="text-[10px] font-mono font-black text-[#7A578D] opacity-60 tracking-widest leading-none">{v.colorCode}</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-center gap-2 text-gray-400">
                          <ShieldCheck size={14} className="text-emerald-500"/>
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Master SKU: {v.sku}</span>
                       </div>
                    </div>
                 </div>

                 {/* Dimension Allocation Hub */}
                 <div className="lg:col-span-8 p-10 space-y-10">
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-8 gap-4">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-black rounded-sm text-white shadow-xl">
                             <Layers size={18} />
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900">Dimension Allocation Hub</h4>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mt-1 block">Mapping STOCK against SPATIAL artifacts</span>
                          </div>
                       </div>
                       <div className="bg-emerald-50 px-5 py-2.5 rounded-sm border border-emerald-100 shadow-xl shadow-emerald-500/5 group/total overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover/total:rotate-0 transition-transform">
                             <PackageCheck size={20} className="text-emerald-500"/>
                          </div>
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest relative z-10 flex items-center gap-3">
                             Variant Quota Sync: <span className="text-[14px] font-black tracking-tighter text-emerald-900">{v.stock}_Nexus</span>
                          </span>
                       </div>
                    </header>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                       {v.sizes.map((s: any) => (
                          <div key={s.id} className={`bg-gray-50/50 border border-gray-100 p-8 rounded-sm shadow-inner group/size hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${editingSize === s.id ? 'bg-white border-[#7A578D] ring-4 ring-[#7A578D]/5 scale-105 z-10' : 'hover:bg-white hover:border-[#7A578D]/30'}`}>
                             <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-[0.02] group-hover/size:opacity-[0.05] transition-opacity">
                                <Box size={60} />
                             </div>
                             
                             <div className="flex items-start justify-between relative z-10 h-full">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${s.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{s.size} Nexus_Nexus</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-mono font-black text-gray-300 uppercase tracking-widest bg-white border border-gray-100 px-2 py-0.5 rounded-sm">SKU: {s.sku || 'NULL'}</span>
                                   </div>
                                   
                                   <div className="flex items-center gap-3 pt-2">
                                      <div className={`px-4 py-1.5 rounded-sm border shadow-sm flex items-baseline gap-1 ${s.stock < 10 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                         <span className="text-[18px] font-black tracking-tighter leading-none">{s.stock}</span>
                                         <span className="text-[8px] font-bold uppercase tracking-widest">Qty</span>
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3 h-full">
                                   {editingSize === s.id ? (
                                     <div className="flex flex-col gap-3 animate-in zoom-in-95 duration-300 origin-top-right">
                                        <div className="relative">
                                           <input 
                                             autoFocus
                                             type="number" 
                                             value={editedStock} 
                                             onChange={e => setEditedStock(e.target.value)} 
                                             className="w-24 bg-white border border-[#7A578D] rounded-sm py-3 px-4 text-center text-sm font-black outline-none focus:ring-4 focus:ring-[#7A578D]/20 shadow-2xl" 
                                           />
                                           <span className="absolute -top-2 left-2 bg-white px-1 text-[8px] font-black text-[#7A578D] uppercase tracking-widest">SYNC_VAL</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => handleUpdateStock(s.id)} 
                                            className="flex-1 bg-black text-white hover:bg-emerald-500 p-2.5 rounded-sm transition-all shadow-xl hover:scale-105"
                                          >
                                            <Check size={18} className="mx-auto" />
                                          </button>
                                          <button 
                                            onClick={() => setEditingSize(null)} 
                                            className="flex-1 bg-white text-gray-400 hover:text-red-500 p-2.5 rounded-sm transition-all border border-gray-100 hover:border-red-100 shadow-sm"
                                          >
                                            <X size={18} className="mx-auto" />
                                          </button>
                                        </div>
                                     </div>
                                   ) : (
                                     <button 
                                       onClick={() => { setEditingSize(s.id); setEditedStock(s.stock.toString()); }}
                                       className="w-10 h-10 bg-white border border-gray-100 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] opacity-0 group-hover/size:opacity-100 transition-all shadow-xl flex items-center justify-center hover:scale-110 active:scale-95"
                                       title="Edit Stock Matrix"
                                     >
                                       <Edit2 size={18} />
                                     </button>
                                   )}
                                   <div className="mt-auto opacity-0 group-hover/size:opacity-100 transition-opacity">
                                      <Activity size={18} className={`duration-1000 ${s.stock < 10 ? 'text-red-200' : 'text-[#7A578D]/20'}`} />
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </section>
        ))}

         {variants.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-100 rounded-sm opacity-20 group hover:opacity-40 transition-opacity duration-1000">
               <AlertTriangle size={64} className="text-gray-300 mb-8 animate-pulse" />
               <div className="space-y-4 text-center">
                  <h6 className="text-[13px] font-black uppercase tracking-[0.5em] text-gray-400">Registry_Nexus_VOID</h6>
                  <p className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest italic">No multi-variant artifacts detected in this product hierarchy.</p>
                  <button 
                    onClick={() => navigate(`/admin/bulk-products/edit/${id}`)} 
                    className="mt-8 px-8 py-3 bg-black text-white hover:bg-[#7A578D] text-[10px] font-black rounded-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95"
                  >
                     RE-INITIALIZE_NARRATIVE
                  </button>
               </div>
            </div>
         )}
      </div>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Temporal variant integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory Sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Authoritative audit mapping 100%</span>
         </div>
      </footer>
    </div>
  );
};

export default VariantManager;
