import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Check, X, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
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
      toast.error('Failed to load variants');
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
        toast.error('Invalid stock value');
        return;
      }
      await api.patch(`/variants/sizes/${sizeId}/stock`, { stock: stockVal });
      toast.success('Stock updated');
      setEditingSize(null);
      fetchData(); // reload variants to reflect recalculated stocks
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!window.confirm("Delete this entire variant? This action cannot be undone.")) return;
    try {
      await api.delete(`/variants/${variantId}`);
      toast.success('Variant removed');
      fetchData();
    } catch {
      toast.error('Failed to remote variant');
    }
  };

  if (loading) {
     return (
        <div className="flex h-[50vh] items-center justify-center">
            <RefreshCw className="animate-spin text-[#7A578D]" size={30} />
        </div>
     );
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-4 gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/bulk-products')} className="p-2.5 bg-gray-50 rounded-sm border border-gray-200 hover:bg-[#7A578D] hover:text-white hover:border-[#7A578D] transition-all shadow-sm flex items-center justify-center">
             <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Manage Variants</h1>
            <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-wider">
               {product?.name} <span className="text-xs ml-1 opacity-70">(ID: {product?.id})</span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 px-2 py-1 rounded-sm text-center shadow-sm">
           <span className="block text-xs font-bold uppercase tracking-widest text-[#7A578D] mb-1">Global Stock</span>
           <span className="text-lg font-bold text-gray-900 leading-none">{product?.inventory?.stock || 0}</span>
        </div>
      </header>

      <div className="space-y-2">
        {variants.map((v: any, idx) => (
           <div key={v.id} className="bg-white border border-gray-100 rounded-sm p-2 shadow-sm overflow-hidden relative group/variant hover:shadow-md transition-shadow flex flex-col md:flex-row gap-2">
              
              <div className="absolute top-2 right-4 z-10 opacity-0 group-hover/variant:opacity-100 transition-opacity">
                <button onClick={() => handleDeleteVariant(v.id)} className="p-2 border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all shadow-sm flex items-center justify-center" title="Delete Variant">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Color Details & Primary Image */}
              <div className="w-full md:w-1/3 flex flex-col items-center gap-2 text-center md:border-r border-gray-100 md:pr-6">
                  <div className="w-32 h-40 rounded-sm bg-gray-50 overflow-hidden shadow-sm border border-gray-100 relative group-hover/variant:scale-105 transition-transform duration-500">
                     <img src={v.images?.[0]?.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="Variant" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-gray-100" style={{ backgroundColor: v.colorCode || '#000' }} title={v.colorName || v.color} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">{v.color}</h3>
                    </div>
                    <span className="text-xs text-gray-400 font-mono font-bold tracking-widest block">{v.sku}</span>
                  </div>
              </div>

              {/* Sizes and Stock Edit */}
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-50 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A578D] flex items-center gap-2">
                       Size Allocations & Inventory
                    </h4>
                    <span className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider w-fit shadow-inner">
                       Variant Total: {v.stock}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                     {v.sizes.map((s: any) => (
                        <div key={s.id} className="border border-gray-100 rounded-sm p-3 bg-gray-50 hover:bg-white flex items-center justify-between group/size hover:shadow-sm hover:border-[#7A578D]/30 transition-all">
                           <div className="flex flex-col gap-0.5">
                              <span className="block text-xs font-bold text-gray-900 leading-none">{s.size}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {s.sku || 'N/A'}</span>
                           </div>
                           
                           <div className="flex flex-col items-end">
                              {editingSize === s.id ? (
                                <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
                                   <input 
                                     autoFocus
                                     type="number" 
                                     value={editedStock} 
                                     onChange={e => setEditedStock(e.target.value)} 
                                     className="w-16 text-center text-xs font-bold py-1 px-1 rounded border-2 border-[#7A578D] outline-none focus:ring-2 focus:ring-[#7A578D]/20 shadow-sm" 
                                   />
                                   <div className="flex flex-col gap-1">
                                     <button onClick={() => handleUpdateStock(s.id)} className="text-green-600 bg-green-50 hover:text-white hover:bg-green-500 p-1 rounded-md transition-colors border border-green-200 hover:border-green-500"><Check size={14}/></button>
                                     <button onClick={() => setEditingSize(null)} className="text-red-500 bg-red-50 hover:text-white hover:bg-red-500 p-1 rounded-md transition-colors border border-red-200 hover:border-red-500"><X size={14}/></button>
                                   </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                   <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-bold ${s.stock < 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                     {s.stock < 10 && <AlertTriangle size={12} />}
                                     {s.stock}
                                   </div>
                                   <button 
                                     onClick={() => { setEditingSize(s.id); setEditedStock(s.stock.toString()); }}
                                     className="bg-white p-1.5 rounded border border-gray-200 text-gray-400 hover:text-[#7A578D] hover:border-[#7A578D] opacity-0 group-hover/size:opacity-100 transition-all shadow-sm"
                                     title="Edit Stock"
                                   >
                                     <Edit2 size={14} />
                                   </button>
                                </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
              </div>
           </div>
        ))}
         {variants.length === 0 && (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-sm">
               <AlertTriangle size={32} className="text-gray-300 mb-3" />
               <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">No Variants Found</p>
               <button onClick={() => navigate(`/admin/bulk-products/edit/${id}`)} className="mt-4 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase tracking-wider transition-colors">Go back to product Edit</button>
            </div>
         )}
      </div>
    </div>
  );
};

export default VariantManager;
