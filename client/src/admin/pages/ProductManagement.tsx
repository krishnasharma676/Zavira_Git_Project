
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // existingImages = DB images already saved (have an id)
  // images = new File[] the user just picked
  // previewUrls = blob URLs for new picks only
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    discountedPrice: '',
    categoryId: '',
    stock: '',
    sku: '',
    featured: false,
    trending: false
  });
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products', { params: { limit: 100 } });
      setProducts(data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      basePrice: product.basePrice.toString(),
      discountedPrice: (product.discountedPrice || '').toString(),
      categoryId: product.categoryId || '',
      stock: (product.inventory?.stock || 0).toString(),
      sku: (product.inventory?.sku || '').toString(),
      featured: product.featured || false,
      trending: product.trending || false
    });
    // Load existing DB images separately; reset new file picks
    setExistingImages(product.images?.map((img: any) => ({ id: img.id, imageUrl: img.imageUrl })) || []);
    setImages([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      discountedPrice: '',
      categoryId: '',
      stock: '',
      sku: '',
      featured: false,
      trending: false
    });
    setExistingImages([]);
    setImages([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, (formData as any)[key]);
    });
    images.forEach(image => {
      data.append('images', image);
    });

    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      toast.success('Success');
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };




  const columns = [
    {
      name: "images",
      label: "Preview",
      options: {
        customBodyRender: (value: any[]) => (
          <img src={value?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-8 h-10 object-cover rounded shadow-sm" />
        )
      }
    },
    { 
      name: "name", 
      label: "Product Name",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const sku = products[tableMeta.rowIndex]?.inventory?.sku;
          return (
            <div className="flex flex-col">
               <span className="tracking-tight">{value}</span>
               <span className="text-[8px] text-gray-400">{sku || 'NO SKU'}</span>
            </div>
          )
        }
      }
    },
    { 
      name: "category", 
      label: "Category", 
      options: {
        customBodyRender: (val: any) => <span className="bg-gray-100 px-2 py-0.5 rounded text-[8px]">{val?.name || 'GENERIC'}</span>
      }
    },
    { 
      name: "basePrice", 
      label: "Price",
      options: {
        customBodyRender: (val: number, meta: any) => {
           const discounted = products[meta.rowIndex]?.discountedPrice;
           return (
             <div className="flex flex-col">
               <span>₹{discounted || val}</span>
               {discounted && <span className="text-[8px] text-gray-300 line-through">₹{val}</span>}
             </div>
           )
        }
      }
    },
    { 
      name: "inventory", 
      label: "Stock",
      options: {
        customBodyRender: (val: any) => (
          <span className={(val?.stock || 0) < 10 ? 'text-[#7A578D]' : 'text-gray-500'}>{val?.stock || 0} U</span>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const prod = products[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(prod)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded"><Edit2 size={12} /></button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded"><Trash2 size={12} /></button>
            </div>
          )
        }
      }
    }
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Products</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage store inventory</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={products} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (₹)</label>
                <input type="number" required value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black italic" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock</label>
                <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
           </div>

           <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex-1">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="accent-[#7A578D]" />
                <span className="text-[9px] font-black uppercase text-gray-500">Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex-1">
                <input type="checkbox" checked={formData.trending} onChange={(e) => setFormData({...formData, trending: e.target.checked})} className="accent-[#7A578D]" />
                <span className="text-[9px] font-black uppercase text-gray-500">Trending</span>
              </label>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" />
           </div>

           <div className="space-y-2">
               <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Images</label>
              <div className="grid grid-cols-6 gap-2">
                <label className="aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all">
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                  <Upload size={16} className="text-gray-300" />
                </label>

                {/* Existing DB images */}
                {existingImages.map((img) => (
                   <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group border border-gray-100">
                      <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Trash2 className="text-white cursor-pointer" size={14} onClick={async () => {
                          try {
                            await api.delete(`/products/${editingProduct.id}/images/${img.id}`);
                            setExistingImages(prev => prev.filter(i => i.id !== img.id));
                          } catch {
                            toast.error('Failed to delete image');
                          }
                        }} />
                      </div>
                   </div>
                ))}

                {/* New local previews (not yet uploaded) */}
                {previewUrls.map((url, idx) => (
                   <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group border border-blue-100 italic">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Trash2 className="text-white cursor-pointer" size={14} onClick={() => {
                          setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
                          setImages(prev => prev.filter((_, i) => i !== idx));
                        }} />
                      </div>
                   </div>
                ))}
              </div>
           </div>

           <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-500/10">
              {isSubmitting ? 'PROCESSING...' : editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default ProductManagement;
