import { useState } from 'react';
import { Search, Loader2, Package, Tag, PackageCheck, AlertCircle, ExternalLink, ArrowRight, Layers, Ruler } from 'lucide-react';
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
            toast.success('Product found!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Product not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
            <header className="flex flex-col gap-2 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#7A578D]/10 rounded-sm text-[#7A578D]">
                        <Search size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">SKU Intelligent Lookup</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cross-inventory product identification system</p>
                    </div>
                </div>
            </header>

            <section className="bg-white border border-gray-100 p-8 rounded-none shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            placeholder="Enter unique SKU code (Product, Variant, or Size ID)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#7A578D] focus:bg-white rounded-none text-[13px] font-bold uppercase tracking-widest outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading || !sku}
                        className="px-10 bg-black hover:bg-[#7A578D] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-none transition-all disabled:bg-gray-100 disabled:text-gray-400 flex items-center gap-3"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> SEARCH</>}
                    </button>
                </form>
            </section>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Left side: Product Visuals */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white border border-gray-100 p-2 rounded-none shadow-sm group">
                            <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative border border-gray-100">
                                <img 
                                    src={result.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-xl">
                                   MATCH: {result.matchType}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[#7A578D] text-white p-6 rounded-none text-center border-b-4 border-black/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Internal Recognition</p>
                            <p className="text-lg font-black tracking-tighter uppercase">{sku}</p>
                        </div>
                    </div>

                    {/* Right side: Detailed Dossier */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white border border-gray-100 p-10 rounded-none shadow-sm flex-1">
                            <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-10">
                                <div>
                                    <span className="text-[10px] font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1 rounded-sm uppercase tracking-widest border border-[#7A578D]/10">
                                        {result.product.category?.name || 'Uncategorized'}
                                    </span>
                                    <h2 className="text-3xl font-black text-gray-900 mt-4 uppercase leading-tight tracking-tight">{result.product.name}</h2>
                                    <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">Master Product ID: {result.product.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Listing Price</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(result.product.discountedPrice || result.product.basePrice)}</p>
                                    {result.product.discountedPrice && (
                                        <p className="text-xs text-red-500 font-bold line-through mt-1 opacity-50">{formatCurrency(result.product.basePrice)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-10">
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 border-l-4 border-[#7A578D] pl-3">Specifications</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Weight', value: `${result.product.weight} ${result.product.weightUnit}` },
                                            { label: 'HSN CODE', value: result.product.hsnCode || 'N/A' },
                                            { label: 'TAX RATE', value: `${result.product.taxRate}% GST` },
                                            { label: 'DIMS (LWH)', value: `${result.product.length}x${result.product.width}x${result.product.height} ${result.product.dimensionUnit}` }
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                                <span className="text-[11px] font-black text-gray-900 uppercase">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 border-l-4 border-emerald-500 pl-3">Global Ledger</h3>
                                    <div className="space-y-2">
                                        <div className="p-4 bg-gray-50 border border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-sm flex items-center justify-center text-emerald-500 shadow-sm">
                                                    <PackageCheck size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Stock</p>
                                                    <p className="text-xl font-black text-gray-900">{result.product.inventory?.stock || 0} Units</p>
                                                </div>
                                            </div>
                                        </div>
                                        {result.variantId && (
                                            <div className="p-4 bg-[#7A578D]/5 border border-[#7A578D]/10">
                                                <p className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest mb-1 italic">Matched Context</p>
                                                <p className="text-[11px] font-black text-gray-800 uppercase">
                                                    {result.matchType === 'Variant Color' ? `Color variant identified` : `Specific size context: ${result.size}`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => window.open(`/product/${result.product.slug}`, '_blank')}
                                        className="flex items-center gap-2 text-[10px] font-black text-[#7A578D] uppercase tracking-widest hover:text-black transition-colors"
                                    >
                                        <ExternalLink size={14} /> View Site
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[10px] font-black uppercase tracking-widest transition-all">
                                        Update Inventory
                                    </button>
                                    <button className="px-6 py-3 bg-[#7A578D] text-white hover:bg-black text-[10px] font-black uppercase tracking-widest transition-all">
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Variants Preview */}
                        {result.product.variants?.length > 0 && (
                            <div className="bg-white border border-gray-100 p-8 rounded-none shadow-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                   <Layers size={14} className="text-[#7A578D]" /> Associated Variants 
                                   <span className="ml-auto text-[9px] text-gray-400 font-bold">{result.product.variants.length} COLORS</span>
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {result.product.variants.map((v: any, index: number) => (
                                        <div key={index} className={`flex items-center gap-3 p-3 border-2 transition-all ${v.id === result.variantId ? 'border-[#7A578D] bg-[#7A578D]/5' : 'border-gray-50 bg-gray-50'}`}>
                                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                                                <img src={v.images?.[0]?.imageUrl || result.product.images?.[0]?.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="pr-4">
                                                <p className="text-[10px] font-black uppercase text-gray-900 leading-none">{v.color}</p>
                                                <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">SKU: {v.sku || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!result && !loading && (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 opacity-40">
                    <AlertCircle size={40} className="text-gray-300 mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 tracking-[0.3em]">Ready for lookup. No active search context.</p>
                </div>
            )}
        </div>
    );
};

export default SkuLookup;
