
import { useState } from 'react';
import { Search, Loader2, Package, Tag, PackageCheck, AlertCircle, ExternalLink, Layers, Ruler, Activity, Info, BarChart3, Box, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';

const SkuLookup = () => {
    const [sku, setSku] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!sku.trim()) return;
        
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.get(`/products/admin/sku/${sku}`);
            setResult(data.data);
            toast.success('ARTIFACT_IDENTIFIED_SUCCESSFULLY');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Nexus_NULL: ARTIFACT_NOT_FOUND');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
                <div>
                   <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">SKU_Nexus_Lookup</h1>
                   <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Intelligent Artifact Identification System Active</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 italic">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cross-inventory protocol active</span>
                   </div>
                </div>
            </header>

            {/* Authoritative Command Center */}
            <section className="bg-white border border-gray-100 p-1 rounded-sm shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#7A578D]/30 group-hover:bg-[#7A578D] transition-all duration-700" />
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 p-3">
                    <div className="relative flex-1 group">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#7A578D] transition-colors" size={20} />
                        <input 
                            type="text" 
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            placeholder="INJECT_Nexus_SKU (PRODUCT_ID, VARIANT_ID, OR SKU_Nexus)..."
                            className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-sm font-black uppercase tracking-widest placeholder:italic transition-all shadow-inner"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading || !sku}
                        className="h-full px-12 bg-black text-white rounded-sm text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 border-b-4 border-black/30 group py-5"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <><Search size={24} className="group-hover:rotate-12 transition-transform"/> INITIALIZE_SCAN</>}
                    </button>
                </form>
            </section>

            {result ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Left: Artifact Immersion Hub */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-gray-100 p-3 rounded-sm shadow-xl relative group">
                            <div className="aspect-[3/4] bg-gray-900 overflow-hidden relative rounded-sm">
                                <img 
                                    src={result.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x500?text=No+Artifact'} 
                                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    alt="Identified artifact"
                                />
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   IDENT_MATCH: {result.matchType}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                   <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest mb-1 block">Master Archetype</span>
                                   <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight truncate">{result.product.name}</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-black text-white p-8 rounded-sm shadow-2xl relative overflow-hidden group border-b-8 border-[#7A578D]">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Package size={120} />
                            </div>
                            <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-[0.4em] mb-4 block">ACTIVE_Nexus_SKU</span>
                            <h4 className="text-2xl font-black tracking-tighter uppercase font-mono break-all">{sku}</h4>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                               <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Registry ID</span>
                                  <span className="text-[10px] font-black text-[#7A578D]">{result.product.id}</span>
                               </div>
                               <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5">
                                  <Info size={18} className="text-white/40" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Authoritative Dossier */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white border border-gray-100 p-10 rounded-sm shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                              <ShieldCheck size={280} />
                           </div>
                           
                           <header className="flex flex-col md:flex-row justify-between items-start border-b border-gray-50 pb-10 mb-10 gap-6">
                              <div>
                                 <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-black text-white bg-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                        {result.product.category?.name || 'GENERIC_Nexus'}
                                    </span>
                                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-100">
                                       <Activity size={12} className="text-emerald-500 animate-pulse"/>
                                       <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">In_Registry</span>
                                    </div>
                                 </div>
                                 <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-tight drop-shadow-sm">{result.product.name}</h2>
                                 <div className="flex items-center gap-4 mt-6">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100">
                                       <BarChart3 size={14} className="text-gray-400"/>
                                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Listing state Active</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-left md:text-right bg-gray-50 p-6 rounded-sm border border-gray-100 shadow-inner min-w-[200px]">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 block">Fiscal Liability</span>
                                 <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">{(result.product.discountedPrice || result.product.basePrice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                 {result.product.discountedPrice && (
                                     <p className="text-[11px] text-red-500 font-black line-through opacity-40 uppercase tracking-widest">Base: {result.product.basePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                 )}
                              </div>
                           </header>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                               <div className="space-y-6">
                                   <div className="flex items-center gap-4 text-[#7A578D] font-black text-[11px] uppercase tracking-[0.3em] mb-2">
                                      <Box size={18} /> Physical Matrix
                                   </div>
                                   <div className="divide-y divide-gray-50 bg-gray-50/50 p-6 rounded-sm border border-gray-100 shadow-inner">
                                       {[
                                           { label: 'Temporal Mass', value: `${result.product.weight} ${result.product.weightUnit}`, icon: Ruler },
                                           { label: 'Compliance Code', value: result.product.hsnCode || 'Nexus_NULL', icon: Info },
                                           { label: 'Fiscal Rate', value: `${result.product.taxRate}% GST`, icon: Activity },
                                           { label: 'Dimensional Hub', value: `${result.product.length}x${result.product.width}x${result.product.height} ${result.product.dimensionUnit}`, icon: Layers }
                                       ].map(item => (
                                           <div key={item.label} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                                  <item.icon size={12} className="opacity-50"/> {item.label}
                                               </span>
                                               <span className="text-[12px] font-black text-gray-900 uppercase tracking-tighter">{item.value}</span>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                               
                               <div className="space-y-6">
                                   <div className="flex items-center gap-4 text-emerald-600 font-black text-[11px] uppercase tracking-[0.3em] mb-2">
                                      <PackageCheck size={18} /> Inventory Status
                                   </div>
                                   <div className="space-y-4">
                                       <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-sm shadow-xl shadow-emerald-500/5 relative group/stock overflow-hidden">
                                          <div className="absolute top-0 right-0 p-4 opacity-10 grayscale group-hover/stock:grayscale-0 group-hover/stock:rotate-12 transition-all duration-700">
                                             <Package size={60} className="text-emerald-500"/>
                                          </div>
                                          <div className="relative z-10">
                                             <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-4">Total Collective Quota</p>
                                             <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-emerald-900 tracking-tighter leading-none">{result.product.inventory?.stock || 0}</span>
                                                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">UNITS_Nexus</span>
                                             </div>
                                          </div>
                                       </div>
                                       
                                       <div className="bg-gray-900 p-6 rounded-sm border border-black shadow-2xl relative group overflow-hidden">
                                          <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-5 animate-pulse">
                                             <Zap size={64} className="text-white"/>
                                          </div>
                                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 italic">Identified Context Mapping</p>
                                          <div className="flex items-center gap-4">
                                             <div className="w-1.5 h-8 bg-[#7A578D] rounded-full" />
                                             <p className="text-[12px] font-black text-white uppercase tracking-widest leading-tight">
                                                 {result.matchType === 'Variant Color' ? `Nexus_DETECTION: COLOR_VARIANT_STREAM` : `Nexus_DETECTION: SIZE_AXIS_Nexus [${result.size}]`}
                                             </p>
                                          </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           
                           <footer className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                               <div className="flex gap-6">
                                   <button 
                                       onClick={() => window.open(`/product/${result.product.slug}`, '_blank')}
                                       className="flex items-center gap-3 text-[11px] font-black text-[#7A578D] uppercase tracking-widest hover:text-black transition-all group"
                                   >
                                       <ExternalLink size={18} className="group-hover:scale-110 transition-transform" /> VIEW_ON_PLATFORM
                                   </button>
                               </div>
                               <div className="flex gap-3">
                                   <button className="flex-1 md:none px-8 h-12 bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm active:scale-95">
                                       UPDATE_Nexus_QUOTA
                                   </button>
                                   <button 
                                      onClick={() => window.open(`/admin/products/${result.product.id}`, '_blank')}
                                      className="flex-1 md:none px-8 h-12 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#7A578D] transition-all shadow-2xl active:scale-95 border-b-4 border-black/30"
                                   >
                                       EDIT_ARTIFACT_Nexus
                                   </button>
                               </div>
                           </footer>
                        </section>

                        {/* Associated Variant Nexus */}
                        {result.product.variants?.length > 0 && (
                            <div className="bg-white border border-gray-100 p-10 rounded-sm shadow-xl relative animate-in fade-in duration-1000">
                                <header className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                       <div className="p-2 bg-[#7A578D]/5 rounded-sm text-[#7A578D]">
                                          <Layers size={18} />
                                       </div>
                                       <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-900">Collective Variant Stream Hub</h5>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-1.5 rounded-sm border border-gray-100">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{result.product.variants.length} COLORS_DETECTED</span>
                                    </div>
                                </header>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {result.product.variants.map((v: any, index: number) => (
                                        <div key={index} className={`flex items-center gap-4 p-4 rounded-sm border-2 transition-all group/v shadow-sm hover:shadow-xl hover:-translate-y-1 ${v.id === result.variantId ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-xl shadow-[#7A578D]/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}>
                                            <div className="w-12 h-16 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-2xl transition-all group-hover/v:scale-110">
                                                <img src={v.images?.[0]?.imageUrl || result.product.images?.[0]?.imageUrl} className="w-full h-full object-cover grayscale opacity-80 group-hover/v:grayscale-0 group-hover/v:opacity-100 transition-all duration-700" alt="Variant preview" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-black uppercase text-gray-900 leading-none mb-1.5 group-hover/v:text-[#7A578D] transition-colors">{v.color}</p>
                                                <div className="flex flex-col gap-1">
                                                   <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest">SKU: {v.sku || 'N/A'}</span>
                                                   {v.id === result.variantId && (
                                                      <div className="flex items-center gap-1.5 text-[#7A578D] animate-in zoom-in-50">
                                                         <ShieldCheck size={10} />
                                                         <span className="text-[8px] font-black uppercase tracking-widest italic">Nexus_MATCH</span>
                                                      </div>
                                                   )}
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-300 group-hover/v:text-[#7A578D] transition-all transform group-hover/v:translate-x-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                !loading && (
                    <div className="py-32 flex flex-col items-center justify-center border-4 border-dashed border-gray-50 rounded-sm opacity-20 group hover:opacity-40 transition-opacity duration-1000">
                        <Activity size={80} className="text-gray-300 mb-8 animate-pulse" />
                        <div className="space-y-4 text-center">
                           <h6 className="text-[13px] font-black uppercase tracking-[0.5em] text-gray-400">Registry_Nexus_Standby</h6>
                           <p className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest italic">Awaiting secure SKU cryptographic injection...</p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default SkuLookup;
