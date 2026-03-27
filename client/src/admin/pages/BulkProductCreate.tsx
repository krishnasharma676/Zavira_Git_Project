import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, AlertTriangle, Images, RefreshCw, Truck } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { useAdminStore } from '../../store/useAdminStore';

interface VariantForm {
  id?: string; // NEW: Track existing variants
  color: string;
  colorCode: string;
  colorId?: string;
  sizes: { id?: string; size: string; stock: string; sku: string }[];
  images: File[];
  previewUrls: string[];
  existingImages?: { id: string; imageUrl: string }[];
}

const BulkProductCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, colors: savedColors, fetchColors } = useAdminStore();
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
    dimensionUnit: 'cm',
    widthUnit: 'cm',
    heightUnit: 'cm',
  });

  const [variants, setVariants] = useState<VariantForm[]>([
    { color: '', colorCode: '#000000', sizes: [{ size: '', stock: '', sku: '' }], images: [], previewUrls: [] }
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        fetchColors(); // Fetch colors lazily for this page
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
              dimensionUnit: (p.dimensionUnit as string) || 'cm',
              widthUnit: (p.widthUnit as string) || 'cm',
              heightUnit: (p.heightUnit as string) || 'cm',
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
  }, [id, fetchColors]);

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
        if (val !== undefined && val !== null) {
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
    <div className="space-y-2 max-w-[1600px] mx-auto py-1 px-2 animate-in fade-in duration-500">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">
          {id ? 'Update Bulk Product' : 'Bulk Product Creation'}
        </h1>
        <p className="text-gray-500 text-xs font-medium mt-2 flex items-center gap-2">
          {id ? 'ID: ' + id : <Images size={16} className="text-[#7A578D]" />} {id ? 'Refining the configuration lattice' : 'Manage multiple colors & sizes effortlessly'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Core Product Details */}
        <section className="bg-white p-2 rounded-sm border border-gray-100 shadow-sm space-y-2">
          <h2 className="text-xs font-bold text-[#7A578D] uppercase tracking-wider border-b border-gray-100 pb-4">Core Product Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Product Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold uppercase transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Category</label>
              <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold uppercase cursor-pointer transition-all">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Base Price (₹)</label>
              <input type="number" required value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Promotional Price (₹)</label>
              <input type="number" value={formData.discountedPrice} onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium resize-none transition-all" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-6 mt-4 border-t border-gray-100">
             <div className="col-span-full flex items-center gap-2 mb-1">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] px-3 bg-[#7A578D]/5 py-1.5 rounded-sm border border-[#7A578D]/10 flex items-center gap-2">
                  <Truck size={12} /> Logistics Intelligence Axis
                </span>
                <div className="h-px bg-gray-100 flex-1" />
             </div>
             
             {/* Weight & Unit */}
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Weight</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#7A578D]/10 focus-within:border-[#7A578D] transition-all shadow-sm">
                   <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="0.5" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                   <select value={formData.weightUnit} onChange={(e) => setFormData({...formData, weightUnit: e.target.value})} className="bg-gray-100/50 px-2 outline-none text-[10px] font-black uppercase text-[#7A578D] cursor-pointer hover:bg-gray-100 transition-colors">
                      <option value="kg">KG</option>
                      <option value="gm">GM</option>
                   </select>
                </div>
             </div>

             {/* Dimensions */}
             {[
                { label: `Length`, key: 'length', placeholder: 'Length', unitKey: 'dimensionUnit' },
                { label: `Width`, key: 'width', placeholder: 'Width', unitKey: 'widthUnit' },
                { label: `Height`, key: 'height', placeholder: 'Height', unitKey: 'heightUnit' }
              ].map((dim) => (
                <div key={dim.key} className="space-y-1.5 text-center">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 text-left">{dim.label}</label>
                   <div className="flex bg-gray-50 border border-gray-200 rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#7A578D]/10 focus-within:border-[#7A578D] transition-all shadow-sm">
                     <input type="number" value={(formData as any)[dim.key]} onChange={(e) => setFormData({...formData, [dim.key]: e.target.value})} placeholder="10" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                     <select value={(formData as any)[dim.unitKey]} onChange={(e) => setFormData({...formData, [dim.unitKey]: e.target.value})} className="bg-gray-100/50 px-2 outline-none text-[10px] font-black uppercase text-[#7A578D] cursor-pointer hover:bg-gray-100 transition-colors">
                        <option value="cm">CM</option>
                        <option value="mm">MM</option>
                        <option value="inch">IN</option>
                     </select>
                   </div>
                </div>
              ))}

             {/* HSN & Tax */}
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">HSN CODE</label>
                <input value={formData.hsnCode} onChange={(e) => setFormData({...formData, hsnCode: e.target.value})} placeholder="CODE" className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/10 focus:border-[#7A578D] text-xs font-black uppercase shadow-sm transition-all" />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">GST RATE (%)</label>
                <input type="number" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: e.target.value})} placeholder="18" className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/10 focus:border-[#7A578D] text-xs font-black shadow-sm transition-all" />
             </div>
          </div>
        </section>

        {/* Variant Configurations */}
        <section className="space-y-1 pt-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#7A578D] pl-3">Color Variants</h2>
            <button type="button" onClick={handleAddVariant} className="bg-black text-white hover:bg-[#7A578D] px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm">
              <Plus size={14} /> Add New Color
            </button>
          </div>

          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="bg-white rounded-sm border border-gray-100 shadow-sm p-2 relative overflow-hidden group/var ring-1 ring-[#7A578D]/5 animate-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Left: Metadata & Sizes */}
            <div className="lg:col-span-8 space-y-1">
              <div className="flex items-center gap-2 bg-gray-50/80 p-3 rounded-sm border border-gray-100">
                <div className="w-8 h-8 bg-[#7A578D] text-white rounded-sm flex items-center justify-center text-xs font-bold shadow-sm">{variantIndex + 1}</div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input placeholder="Color Name" value={variant.color} onChange={(e) => { const v = [...variants]; v[variantIndex].color = e.target.value; setVariants(v); }} className="w-full bg-white border border-gray-200 rounded-sm py-1 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold uppercase shadow-sm transition-all" />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type="color" value={variant.colorCode} onChange={(e) => { const v = [...variants]; v[variantIndex].colorCode = e.target.value; setVariants(v); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full h-full min-h-[40px] rounded-sm border border-gray-200 flex items-center gap-2 px-3 bg-white shadow-sm hover:border-[#7A578D]/40 transition-colors">
                        <div className="w-5 h-5 rounded-md border border-gray-200 shadow-inner" style={{ backgroundColor: variant.colorCode }} />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{variant.colorCode}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveVariant(variantIndex)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>

              {/* Sizes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {variant.sizes.map((sizeObj, sizeIndex) => (
                  <div key={sizeIndex} className="group/size bg-gray-50/50 rounded-sm border border-gray-100 p-3 space-y-2.5 transition-all hover:bg-white hover:shadow-md hover:border-[#7A578D]/30 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dimension {sizeIndex + 1}</span>
                      <button type="button" onClick={() => { const v = [...variants]; v[variantIndex].sizes = v[variantIndex].sizes.filter((_, i) => i !== sizeIndex); setVariants(v); }} className="text-gray-300 hover:text-red-500 transition-colors bg-white rounded-full p-1"><Trash2 size={12} /></button>
                    </div>
                    <div className="space-y-2">
                      <input placeholder="Size (e.g. XL, 42)" value={sizeObj.size} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].size = e.target.value; setVariants(v); }} className="w-full bg-white border border-gray-200 rounded-sm py-1.5 px-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] transition-all" />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Qty" value={sizeObj.stock} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].stock = e.target.value; setVariants(v); }} className="w-20 bg-white border border-gray-200 rounded-sm py-1.5 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] transition-all" />
                        <input placeholder="SKU" value={sizeObj.sku} onChange={(e) => { const v = [...variants]; v[variantIndex].sizes[sizeIndex].sku = e.target.value; setVariants(v); }} className="flex-1 bg-white border border-gray-200 rounded-sm py-1.5 px-3 text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddSize(variantIndex)} className="h-full min-h-[120px] border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#7A578D] hover:text-[#7A578D] transition-all bg-gray-50/50 group/add">
                  <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover/add:scale-110 group-hover/add:bg-[#7A578D] group-hover/add:text-white transition-all"><Plus size={16} /></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Add SKU</span>
                </button>
              </div>
            </div>

            {/* Right: Images Upload */}
            <div className="lg:col-span-4 space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-[#7A578D] block border-b border-gray-100 pb-2">Media Assets</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-hidden">
                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-[#7A578D] transition-all group/upload relative overflow-hidden">
                  <input type="file" multiple className="hidden" onChange={(e) => handleImageChange(variantIndex, e)} accept="image/*" />
                  <Upload size={20} className="text-gray-400 group-hover/upload:text-[#7A578D] transition-colors relative z-10 mb-1 group-hover/upload:-translate-y-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase relative z-10 tracking-widest group-hover/upload:text-[#7A578D]">Upload</span>
                  <div className="absolute inset-0 bg-[#7A578D]/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                </label>
                {/* Existing Images */}
                {variant.existingImages?.map((img) => (
                  <div key={img.id} className="aspect-square rounded-sm overflow-hidden relative group/img border border-gray-100 shadow-sm">
                    <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                      <button type="button" onClick={() => handleDeleteImage(variantIndex, img.id)} className="bg-red-500 text-white p-2 rounded-sm hover:bg-red-600 transition-colors shadow-lg scale-90 group-hover/img:scale-100 duration-200"><Trash2 size={16} /></button>
                    </div>
                    <div className="absolute top-2 left-2 bg-[#7A578D]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">Live</div>
                  </div>
                ))}
                {/* New Preview Images */}
                {variant.previewUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-sm overflow-hidden relative group/img border-2 border-blue-200 border-dashed shadow-sm">
                    <img src={url} className="w-full h-full object-cover opacity-80" alt="" />
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[1px]">
                      <button type="button" onClick={() => { const v = [...variants]; v[variantIndex].previewUrls = v[variantIndex].previewUrls.filter((_, idx) => idx !== i); v[variantIndex].images = v[variantIndex].images.filter((_, idx) => idx !== i); setVariants(v); }} className="text-red-500 bg-white shadow-lg p-2 rounded-sm hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">New</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          ))}
        </section>

        <div className="pt-6 border-t border-gray-100 mt-8 mb-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-black h-6 rounded-sm text-xs font-bold uppercase tracking-widest text-white hover:bg-[#7A578D] transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Plus className="group-hover:rotate-90 transition-transform" size={18} />}
                {isSubmitting ? 'Syncing Framework...' : (id ? 'Confirm Modification' : 'Execute Bulk Creation')}
            </button>
        </div>
      </form>
    </div>
  );
};

export default BulkProductCreate;
