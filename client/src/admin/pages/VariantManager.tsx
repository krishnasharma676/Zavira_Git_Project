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
    <div className="space-y-4 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/bulk-products')} className="p-1.5 bg-gray-50 rounded-lg hover:bg-[#7A578D] hover:text-white transition-colors">
             <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter text-gray-900 leading-none">Manage Variants</h1>
            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-0.5">
               {product?.name} (ID: {product?.id})
            </p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-center">
           <span className="block text-[7px] font-black uppercase tracking-widest text-gray-400">Virtual Stock</span>
           <span className="text-base font-black text-gray-900 leading-none">{product?.inventory?.stock || 0}</span>
        </div>
      </header>

      <div className="space-y-4">
        {variants.map((v: any, idx) => (
           <div key={v.id} className="bg-white border flex flex-col md:flex-row gap-4 border-gray-100 rounded-xl p-4 shadow-sm overflow-hidden relative">
              
              <div className="absolute top-3 right-3">
                <button onClick={() => handleDeleteVariant(v.id)} className="p-1.5 border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all">
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Color Details & Primary Image */}
              <div className="w-full md:w-1/4 flex flex-col items-center gap-3 text-center border-r border-gray-50 pr-4">
                  <div className="w-20 h-28 rounded-lg bg-gray-50 overflow-hidden shadow-sm">
                     <img src={v.images?.[0]?.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="Variant" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: v.colorCode || '#000' }} />
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">{v.color}</h3>
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono font-bold">{v.sku}</span>
                  </div>
              </div>

              {/* Sizes and Stock Edit */}
              <div className="w-full md:w-3/4 flex flex-col justify-center">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    Size Allocations & Inventory <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[7px]">Group Stock: {v.stock}</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                     {v.sizes.map((s: any) => (
                        <div key={s.id} className="border border-gray-100 rounded-lg p-2 bg-gray-50 flex items-center justify-between group">
                           <div>
                              <span className="block text-[12px] font-black text-gray-900 leading-none">{s.size}</span>
                              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">SKU: {s.sku || 'N/A'}</span>
                           </div>
                           
                           <div className="flex flex-col items-end gap-1">
                              {editingSize === s.id ? (
                                <div className="flex items-center gap-1">
                                   <input 
                                     autoFocus
                                     type="number" 
                                     value={editedStock} 
                                     onChange={e => setEditedStock(e.target.value)} 
                                     className="w-12 text-center text-[10px] font-bold py-0.5 px-0.5 rounded border border-[#7A578D] outline-none" 
                                   />
                                   <button onClick={() => handleUpdateStock(s.id)} className="text-green-600 hover:text-white hover:bg-green-500 p-0.5 rounded transition-colors"><Check size={12}/></button>
                                   <button onClick={() => setEditingSize(null)} className="text-red-500 hover:text-white hover:bg-red-500 p-0.5 rounded transition-colors"><X size={12}/></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                   <span className={`text-[11px] font-black ${s.stock < 10 ? 'text-red-500 flex items-center gap-1' : 'text-green-600'}`}>
                                     {s.stock < 10 && <AlertTriangle size={9} />}
                                     {s.stock}
                                   </span>
                                   <button 
                                     onClick={() => { setEditingSize(s.id); setEditedStock(s.stock.toString()); }}
                                     className="bg-white p-1 rounded-md border border-gray-200 text-gray-400 hover:text-[#7A578D] opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                   >
                                     <Edit2 size={10} />
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
            <div className="py-10 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
               <p className="font-bold text-[10px] uppercase tracking-widest">No Variants Found</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default VariantManager;
