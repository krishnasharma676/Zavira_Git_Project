import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, AlertTriangle, Images, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

interface VariantForm {
  id?: string; // NEW: Track existing variants
  color: string;
  colorCode: string;
  colorId?: string;
  sizes: { id?: string; size: string; stock: string; sku: string }[];
  images: File[];
  previewUrls: string[];
  existingImages?: { id: string; imageUrl: string }[]; // NEW: Track live images
}

const BulkProductCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    discountedPrice: '',
    categoryId: '',
    hotDeals: false,
    featured: false,
    trending: false,
    weight: '0',
    length: '0',
    width: '0',
    height: '0',
    hsnCode: '',
    taxRate: '0',
    weightUnit: 'kg',
  });

  const [variants, setVariants] = useState<VariantForm[]>([
    { color: '', colorCode: '#000000', sizes: [{ size: '', stock: '', sku: '' }], images: [], previewUrls: [] }
  ]);

  const [savedColors, setSavedColors] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catsRes, colorsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/colors')
        ]);
        setCategories(catsRes.data.data);
        setSavedColors(colorsRes.data.data);

        if (id) {
          console.log('Fetching Product ID:', id);
          const { data: pRes } = await api.get(`/products/${id}`);
          const p = pRes.data;
          console.log('Fetched Product:', p);
          
          if (p) {
            setFormData({
              name: p.name || '',
              description: p.description || '',
              basePrice: (p.basePrice || 0).toString(),
              discountedPrice: (p.discountedPrice || '').toString(),
              categoryId: p.categoryId || '',
              hotDeals: p.hotDeals || false,
              featured: p.featured || false,
              trending: p.trending || false,
              weight: (p.weight || 0).toString(),
              length: (p.length || 0).toString(),
              width: (p.width || 0).toString(),
              height: (p.height || 0).toString(),
              hsnCode: p.hsnCode || '',
              taxRate: (p.taxRate || 0).toString(),
              weightUnit: (p.weightUnit as string) || 'kg',
            });

            // Fetch variants
            const { data: vRes } = await api.get(`/variants/product/${id}`);
            const vData = vRes.data;
            console.log('Fetched Variants:', vData);
            
            if (vData && Array.isArray(vData)) {
              const fetchedVariants = vData.map((v: any) => ({
                id: v.id,
                color: v.color || '',
                colorCode: v.colorCode || '#000000',
                colorId: v.colorId || '',
                sizes: (v.sizes || []).map((s: any) => ({ id: s.id, size: s.size, stock: s.stock.toString(), sku: s.sku || '' })),
                images: [],
                previewUrls: [],
                existingImages: v.images || []
              }));
              
              if (fetchedVariants.length > 0) {
                setVariants(fetchedVariants);
              }
            }
          }
        }
      } catch (error) {
        toast.error('Initialization failed');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleAddVariant = () => {
    setVariants([...variants, { color: '', colorCode: '#000000', sizes: [{ size: '', stock: '', sku: '' }], images: [], previewUrls: [] }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddSize = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes.push({ size: '', stock: '', sku: '' });
    setVariants(newVariants);
  };

  const handleRemoveSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
    setVariants(newVariants);
  };

  const handleImageChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      const newVariants = [...variants];
      newVariants[variantIndex].images = [...newVariants[variantIndex].images, ...selectedFiles];
      newVariants[variantIndex].previewUrls = [...newVariants[variantIndex].previewUrls, ...newUrls];
      setVariants(newVariants);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    newVariants[variantIndex].previewUrls = newVariants[variantIndex].previewUrls.filter((_, i) => i !== imageIndex);
    setVariants(newVariants);
  };

  const handleDeleteImage = async (vIdx: number, imgId: string) => {
    if (!window.confirm('Delete live image?')) return;
    try {
      await api.delete(`/products/${id}/images/${imgId}`);
      const newV = [...variants];
      newV[vIdx].existingImages = newV[vIdx].existingImages?.filter(x => x.id !== imgId);
      setVariants(newV);
      toast.success('Live image purged');
    } catch { toast.error('Purge failed'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (variants.some(v => !v.color)) {
      toast.error('Color is required for all variants');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = new FormData();
      Object.keys(formData).forEach(key => {
        let val = (formData as any)[key];
        if (key === 'weight' && formData.weightUnit === 'gm') {
          val = (parseFloat(val) / 1000).toString();
        }
        if (key !== 'weightUnit' && val !== undefined && val !== null) {
          productData.append(key, val.toString());
        }
      });
      
      let totalStock = 0;
      variants.forEach(v => v.sizes.forEach(s => { totalStock += Number(s.stock) || 0; }));
      productData.append('stock', totalStock.toString());
      productData.append('attributes', JSON.stringify({ isVariantProduct: true }));
      
      let productId = id;
      if (id) {
        await api.patch(`/products/${id}`, productData);
      } else {
        const { data } = await api.post('/products', productData);
        productId = data.data.id;
      }

      // Handle variants creation for new ones or added images
      // NOTE: Simplification for now - we only send new variants or variants with new images to the bulk endpoint
      // A more robust implementation would have a specific sync endpoint
      const newOrModifiedVariants = variants.filter(v => !v.id || v.images.length > 0);
      
      if (newOrModifiedVariants.length > 0) {
        const variantFormData = new FormData();
        const payload = newOrModifiedVariants.map((v, i) => {
          v.images.forEach(img => {
            variantFormData.append(`variant_${i}_images`, img);
          });
          return {
            id: v.id, // If ID exists, backend should ideally update
            color: v.color,
            colorCode: v.colorCode,
            colorId: v.colorId,
            sizes: v.sizes
          };
        });
        variantFormData.append('variants', JSON.stringify(payload));
        await api.post(`/variants/product/${productId}`, variantFormData);
      }

      toast.success(id ? 'Product Updated Successfully!' : 'Bulk Product Created Successfully!');
      if (!id) {
         navigate('/admin/bulk-products');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><RefreshCw className="animate-spin text-[#7A578D]" /></div>;

  return (
    <div className="space-y-3.5 max-w-5xl mx-auto py-4 px-4 animate-in fade-in duration-500">
      <header className="border-b border-gray-100 pb-1.5">
        <h1 className="text-lg font-sans font-black uppercase tracking-tight text-gray-900 leading-none">
          {id ? 'Update Bulk Product' : 'Bulk Product Creation'}
        </h1>
        <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
          {id ? 'ID: ' + id : <Images size={11} className="text-[#7A578D]" />} {id ? 'Refining the configuration lattice' : 'Manage multiple colors & sizes effortlessly'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core Product Details */}
        <section className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-2.5">
          <h2 className="text-[10px] font-black text-gray-800 uppercase tracking-widest border-b border-gray-50 pb-1">Core Product Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Category</label>
              <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Base Price (₹)</label>
              <input type="number" required value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Promotional Price (₹)</label>
              <input type="number" value={formData.discountedPrice} onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Description</label>
            <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-100">
             <div className="col-span-full flex items-center gap-3">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7A578D]">Shipping Intelligence Hub</span>
                <div className="h-px bg-gray-100 flex-1" />
             </div>
             
             {/* Weight & Unit */}
             <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">Total Weight</label>
                <div className="flex bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#7A578D]/20 focus-within:border-[#7A578D] transition-all shadow-sm">
                   <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="0.5" className="w-full bg-transparent py-2 px-3 outline-none text-[11px] font-black" />
                   <select value={formData.weightUnit} onChange={(e) => setFormData({...formData, weightUnit: e.target.value})} className="bg-gray-100/50 border-l border-gray-100 px-3 outline-none text-[9px] font-black uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                      <option value="kg">KG</option>
                      <option value="gm">GM</option>
                   </select>
                </div>
             </div>

             {/* Dimensions */}
             {[
               { label: 'Length (cm)', key: 'length', placeholder: 'Length' },
               { label: 'Width (cm)', key: 'width', placeholder: 'Width' },
               { label: 'Height (cm)', key: 'height', placeholder: 'Height' }
             ].map((dim) => (
                <div key={dim.key} className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">{dim.label}</label>
                   <input type="number" value={(formData as any)[dim.key]} onChange={(e) => setFormData({...formData, [dim.key]: e.target.value})} placeholder={dim.placeholder} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[11px] font-black shadow-sm transition-all" />
                </div>
             ))}

             {/* HSN & Tax */}
             <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">HSN CODE</label>
                <input value={formData.hsnCode} onChange={(e) => setFormData({...formData, hsnCode: e.target.value})} placeholder="CODE" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[11px] font-black uppercase shadow-sm transition-all" />
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">GST RATE (%)</label>
                <input type="number" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: e.target.value})} placeholder="18" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[11px] font-black shadow-sm transition-all" />
             </div>
          </div>
        </section>

        {/* Variant Configurations */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">Color Variants</h2>
            <button type="button" onClick={handleAddVariant} className="bg-[#7A578D]/10 text-[#7A578D] hover:bg-[#7A578D] hover:text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5">
              <Plus size={12} /> Add New Color
            </button>
          </div>

          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="bg-white rounded-lg border border-gray-100 shadow-xl p-3 relative overflow-hidden group/var ring-1 ring-[#7A578D]/5 animate-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Metadata & Sizes */}
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center gap-2.5 bg-gray-50/50 p-1.5 rounded-md border border-gray-100">
                <div className="w-5 h-5 bg-[#7A578D] text-white rounded-md flex items-center justify-center text-[9px] font-black">{variantIndex + 1}</div>
                <div className="flex-1 grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <input placeholder="Color Name" value={variant.color} onChange={(e) => { const v = [...variants]; v[variantIndex].color = e.target.value; setVariants(v); }} className="w-full bg-white border border-gray-100 rounded-lg py-1 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase shadow-sm" />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type="color" value={variant.colorCode} onChange={(e) => { const v = [...variants]; v[variantIndex].colorCode = e.target.value; setVariants(v); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full h-full min-h-[28px] rounded-lg border border-gray-200 flex items-center gap-2 px-2 bg-white shadow-sm">
                        <div className="w-3.5 h-3.5 rounded-md border border-gray-200 shadow-inner" style={{ backgroundColor: variant.colorCode }} />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{variant.colorCode}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveVariant(variantIndex)} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>

              {/* Sizes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                {variant.sizes.map((sizeObj, sizeIndex) => (
                  <div key={sizeIndex} className="group/size bg-gray-50/30 rounded-md border border-gray-100 p-1.5 space-y-1.5 transition-all hover:bg-white hover:shadow-md hover:border-[#7A578D]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest">Dimension {sizeIndex + 1}</span>
                      <button type="button" onClick={() => { const v = [...variants]; v[variantIndex].sizes = v[variantIndex].sizes.filter((_, i) => i !== sizeIndex); setVariants(v); }} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={10} /></button>
                    </div>
                    <div className="space-y-1">
                      <input placeholder="Size" value={sizeObj.size} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].size = e.target.value; setVariants(v); }} className="w-full bg-white border border-gray-100 rounded-md py-0.5 px-1.5 text-[9px] font-black uppercase outline-none focus:border-[#7A578D]" />
                      <div className="flex gap-1">
                        <input type="number" placeholder="Qty" value={sizeObj.stock} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].stock = e.target.value; setVariants(v); }} className="w-12 bg-white border border-gray-100 rounded-md py-0.5 px-1.5 text-[9px] font-black outline-none focus:border-[#7A578D]" />
                        <input placeholder="SKU" value={sizeObj.sku} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].sku = e.target.value; setVariants(v); }} className="flex-1 bg-white border border-gray-100 rounded-md py-0.5 px-1.5 text-[9px] font-mono font-black uppercase outline-none focus:border-[#7A578D]" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddSize(variantIndex)} className="h-full min-h-[80px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-[#7A578D]/40 hover:text-[#7A578D] transition-all bg-gray-50/20 group/add">
                  <div className="p-1 rounded-full bg-white shadow-sm border border-gray-100 group-hover/add:scale-110 transition-transform"><Plus size={12} /></div>
                  <span className="text-[7.5px] font-black uppercase tracking-widest">Add SKU</span>
                </button>
              </div>
            </div>

            {/* Right: Images Upload */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Media Assets</label>
              <div className="grid grid-cols-3 gap-1.5 overflow-hidden">
                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#7A578D]/40 transition-all group/upload relative overflow-hidden">
                  <input type="file" multiple className="hidden" onChange={(e) => handleImageChange(variantIndex, e)} accept="image/*" />
                  <Upload size={14} className="text-gray-300 group-hover/upload:text-[#7A578D] transition-colors relative z-10" />
                  <span className="text-[7px] font-black text-gray-400 mt-1 uppercase relative z-10">Upload</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                </label>
                {/* Existing Images */}
                {variant.existingImages?.map((img) => (
                  <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group/img border border-gray-100 shadow-sm">
                    <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button type="button" onClick={() => handleDeleteImage(variantIndex, img.id)} className="text-white p-1 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                    <div className="absolute top-0.5 left-0.5 bg-[#7A578D] text-white text-[5px] font-black px-1 rounded uppercase">Live</div>
                  </div>
                ))}
                {/* New Preview Images */}
                {variant.previewUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden relative group/img border-2 border-blue-200 border-dotted">
                    <img src={url} className="w-full h-full object-cover opacity-70" alt="" />
                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                      <button type="button" onClick={() => { const v = [...variants]; v[variantIndex].previewUrls = v[variantIndex].previewUrls.filter((_, idx) => idx !== i); v[variantIndex].images = v[variantIndex].images.filter((_, idx) => idx !== i); setVariants(v); }} className="text-gray-600 bg-white shadow-md p-1 rounded-full hover:scale-110 transition-transform"><Trash2 size={10} /></button>
                    </div>
                    <div className="absolute top-0.5 left-0.5 bg-blue-500 text-white text-[5px] font-black px-1 rounded-sm uppercase">New</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          ))}
        </section>

        <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] h-10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all shadow-xl shadow-purple-500/10 flex items-center justify-center gap-2 group">
        {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Plus className="group-hover:rotate-90 transition-transform" size={14} />}
        {isSubmitting ? 'Syncing...' : (id ? 'Confirm Changes' : 'Execute Bulk Creation')}
      </button>
      </form>
    </div>
  );
};

export default BulkProductCreate;
