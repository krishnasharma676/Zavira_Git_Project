import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Upload, Package,
  Search, RefreshCw, Layers, AlertTriangle,
  Minus, ChevronRight, X, Maximize2, Calendar, Filter, Truck, Palette
} from 'lucide-react';

import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';
import { useLoading } from '../../store/useLoading';

const emptyForm = {
  name: '', description: '', basePrice: '', discountedPrice: '',
  categoryId: '', stock: '', sku: '', hotDeals: false, sizes: '',
  weight: '', length: '', width: '', height: '', hsnCode: '', taxRate: '0'
};

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [galleryView, setGalleryView] = useState<{ isOpen: boolean; images: any[]; activeIndex: number }>({ isOpen: false, images: [], activeIndex: 0 });
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const { startLoading, stopLoading } = useLoading();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Inventory = products with NO variants (simple/single products)
      const { data } = await api.get('/products', { params: { limit: 1000, search: search || undefined, hasVariants: 'false' } });
      setProducts(data.data.products);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const sortByLatest = () => {
    setProducts(p => [...p].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };
  const sortByLowStock = () => {
    setProducts(p => [...p].sort((a, b) => (a.inventory?.stock || 0) - (b.inventory?.stock || 0)));
  };

  const handleUpdateStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await api.patch(`/inventory/${productId}/stock`, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, inventory: { ...p.inventory, stock: newStock } } : p));
    } catch { toast.error('Stock update failed'); }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      basePrice: product.basePrice?.toString() || '',
      discountedPrice: product.discountedPrice?.toString() || '',
      categoryId: product.categoryId || '',
      stock: product.inventory?.stock?.toString() || '0',
      sku: product.inventory?.sku || '',
      hotDeals: product.hotDeals || false,
      sizes: product.sizes || '',
      weight: product.weight?.toString() || '',
      length: product.length?.toString() || '',
      width: product.width?.toString() || '',
      height: product.height?.toString() || '',
      hsnCode: product.hsnCode || '',
      taxRate: product.taxRate?.toString() || '0'
    });
    const attrs = product.attributes
      ? Object.keys(product.attributes).map(k => ({ key: k, value: String(product.attributes[k]) }))
      : [];
    setAttributes(attrs);
    setExistingImages(product.images?.map((i: any) => ({ id: i.id, imageUrl: i.imageUrl })) || []);
    setImages([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ ...emptyForm });
    setAttributes([]);
    setExistingImages([]);
    setImages([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('basePrice', formData.basePrice);
    if (formData.discountedPrice) fd.append('discountedPrice', formData.discountedPrice);
    fd.append('categoryId', formData.categoryId);
    fd.append('stock', formData.stock || '0');
    if (formData.sku) fd.append('sku', formData.sku);
    fd.append('hotDeals', formData.hotDeals ? 'true' : 'false');
    if (formData.sizes) fd.append('sizes', formData.sizes);
    if (formData.weight) fd.append('weight', formData.weight);
    if (formData.length) fd.append('length', formData.length);
    if (formData.width) fd.append('width', formData.width);
    if (formData.height) fd.append('height', formData.height);
    if (formData.hsnCode) fd.append('hsnCode', formData.hsnCode);
    if (formData.taxRate) fd.append('taxRate', formData.taxRate);

    const attrObj: any = {};
    attributes.forEach(a => { if (a.key && a.value) attrObj[a.key] = a.value; });
    fd.append('attributes', JSON.stringify(attrObj));
    images.forEach(img => fd.append('images', img));

    try {
      startLoading(editingProduct ? 'Saving modifications...' : 'Committing to Vault...');
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, fd);
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd);
        toast.success('Product added!');
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const openGallery = (imgs: any[]) => {
    if (imgs?.length > 0) setGalleryView({ isOpen: true, images: imgs, activeIndex: 0 });
  };

  const columns = [
    {
      name: 'images', label: 'Photo',
      options: {
        customBodyRender: (value: any[]) => (
          <div className="relative group cursor-pointer" onClick={() => openGallery(value)}>
            <div className="w-8 h-10 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
              <img src={value?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
            </div>
            {(value?.length || 0) > 1 && (
              <div className="absolute -top-1 -right-1 bg-[#7A578D] text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">+{value.length - 1}</div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Maximize2 size={12} className="text-white" />
            </div>
          </div>
        )
      }
    },
    { name: 'name', label: 'Name', options: { customBodyRender: (v: string) => <span className="text-[10px] font-black uppercase text-gray-900">{v}</span> } },
    { name: 'id', label: 'ID', options: { customBodyRender: (v: string) => <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded uppercase">{v}</span> } },
    { name: 'inventory', label: 'SKU', options: { customBodyRender: (v: any) => <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{v?.sku || 'UNASSIGNED'}</span> } },
    {
      name: 'createdAt', label: 'Date',
      options: {
        customBodyRender: (v: string) => {
          const d = new Date(v);
          return (
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-900">{d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-[8px] text-gray-400">{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
          );
        }
      }
    },
    { name: 'category', label: 'Category', options: { customBodyRender: (v: any) => <div className="flex items-center gap-1"><Layers size={10} className="text-gray-300" /><span className="text-[9px] font-black uppercase text-gray-500">{v?.name || 'N/A'}</span></div> } },
    {
      name: 'inventory', label: 'Stock',
      options: {
        customBodyRender: (val: any, meta: any) => {
          const product = products[meta.rowIndex];
          const stock = val?.stock || 0;
          return (
            <div className="flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${stock < 10 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                {stock < 10 && <AlertTriangle size={10} />}
                <span className="text-[11px] font-black">{stock}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleUpdateStock(product.id, stock, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"><Minus size={12} /></button>
                <button onClick={() => handleUpdateStock(product.id, stock, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-300 hover:text-[#7A578D] transition-colors"><Plus size={12} /></button>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: 'basePrice', label: 'Price',
      options: {
        customBodyRender: (val: number, meta: any) => {
          const disc = products[meta.rowIndex]?.discountedPrice;
          return (
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-gray-900">₹{disc || val}</span>
              {disc && <span className="text-[8px] text-gray-300 line-through">₹{val}</span>}
            </div>
          );
        }
      }
    },
    { name: 'hotDeals', label: 'Status', options: { customBodyRender: (v: boolean) => <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase text-center ${v ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-300'}`}>{v ? 'HOT DEAL' : 'NORMAL'}</div> } },
    {
      name: 'id', label: 'Actions',
      options: {
        customBodyRender: (id: string, meta: any) => {
          const prod = products[meta.rowIndex];
          return (
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(prod)} className="p-1.5 hover:bg-[#7A578D]/5 text-gray-400 hover:text-[#7A578D] rounded-lg transition-all"><Edit2 size={13} /></button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"><Trash2 size={13} /></button>
            </div>
          );
        }
      }
    },
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const product = products[rowMeta.rowIndex];
      if (!product) return null;
      return (
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
              {/* Product Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-[#7A578D] rounded-full" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                     <Package size={14} className="text-[#7A578D]" /> Full Identity
                   </h3>
                </div>
                <div className="space-y-2.5 pl-4 px-2">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Description Detail</span>
                      <p className="text-[10px] font-bold text-gray-600 uppercase leading-relaxed max-w-[300px]">{product.description || 'No description provided'}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ID (Full)</span>
                         <span className="text-[9px] font-mono font-black text-[#7A578D]">{product.id}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Added Ledger</span>
                         <span className="text-[9px] font-black text-gray-700">{new Date(product.createdAt).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Advanced Specs */}
              <div className="space-y-4 border-l border-gray-100 pl-6">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                    <Layers size={14} className="text-[#7A578D]" /> Technical Specifications
                 </h3>
                 <div className="space-y-2">
                    {Object.keys(product.attributes || {}).length > 0 ? (
                      Object.keys(product.attributes).map(k => (
                        <div key={k} className="flex justify-between items-center border-b border-gray-50 pb-1 align-baseline">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{k}</span>
                           <span className="text-[10px] font-black text-gray-800 uppercase leading-none">{String(product.attributes[k])}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[9px] font-black text-gray-300 uppercase italic">No custom attributes</p>
                    )}
                 </div>
                 <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                       <Truck size={12} className="text-[#7A578D]" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D]">Logistics Vault</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2">
                       <span className="text-[8px] font-black text-gray-400 uppercase">Weight:</span>
                       <span className="text-[9px] font-black text-gray-700">{product.weight || 0} KG</span>
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Dimensions:</span>
                       <span className="text-[9px] font-black text-gray-700">{product.length || 0}x{product.width || 0}x{product.height || 0} CM</span>
                    </div>
                 </div>
              </div>

              {/* Taxation & Compliance */}
              <div className="space-y-4 border-l border-gray-100 pl-6">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-orange-500" /> Compliance & Tax
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm group">
                       <span className="text-[8px] font-black text-gray-400 uppercase mt-1">HSN CODE</span>
                       <span className="text-[14px] font-black text-gray-900 group-hover:text-[#7A578D] transition-colors">{product.hsnCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm group">
                       <span className="text-[8px] font-black text-gray-400 uppercase mt-1">GST RATE</span>
                       <span className="text-[14px] font-black text-gray-900 group-hover:text-[#7A578D] transition-colors">{product.taxRate || 0}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm group">
                       <span className="text-[8px] font-black text-gray-400 uppercase mt-1">LAST SYNC</span>
                       <span className="text-[10px] font-black text-[#7A578D] uppercase mt-0.5">{new Date(product.updatedAt).toLocaleTimeString()}</span>
                    </div>
                 </div>
              </div>
            </div>
          </td>
        </tr>
      );
    },
    textLabels: { body: { noMatch: loading ? 'Loading...' : 'No products found' } }
  };


  return (
    <div className="space-y-3 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-lg font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Inventory Vault</h1>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
            <Package size={10} className="text-[#7A578D]" /> Simple / Single Products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()} className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-8 pr-3 outline-none focus:border-[#7A578D] text-[9px] font-black uppercase tracking-widest w-[180px] transition-all focus:w-[240px]" />
          </div>
          <button onClick={fetchProducts} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all shadow-sm"><RefreshCw size={14} /></button>
          <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-lg gap-1">
            <button onClick={sortByLatest} className="px-2 py-1 hover:bg-white hover:text-[#7A578D] rounded-md text-[8px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-1"><Calendar size={10} /> Latest</button>
            <button onClick={sortByLowStock} className="px-2 py-1 hover:bg-white hover:text-red-500 rounded-md text-[8px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-1"><Filter size={10} /> Low Stock</button>
          </div>
          <button onClick={openAdd} className="bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-lg shadow-black/5">
            <Plus size={12} /> Enroll Product
          </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={products} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      {/* Edit/Add Modal */}
      <ManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {editingProduct && (
            <div className="bg-[#7A578D]/5 p-2 rounded-lg border border-[#7A578D]/10 text-[9px] font-black text-[#7A578D] uppercase">
              Editing ID: {editingProduct.id}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Product Name *</label>
               <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase disabled:opacity-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Category *</label>
              <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase disabled:opacity-50">
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Base Price (₹) *</label>
               <input type="number" required value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black disabled:opacity-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sale Price (₹)</label>
              <input type="number" value={formData.discountedPrice} onChange={e => setFormData({ ...formData, discountedPrice: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black disabled:opacity-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Stock</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black disabled:opacity-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">SKU</label>
               <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} disabled={isSubmitting} placeholder="ZV-XXX-000" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-mono font-black uppercase disabled:opacity-50" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sizes (comma separated)</label>
              <input value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} disabled={isSubmitting} placeholder="S, M, L, XL or 40, 42" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase disabled:opacity-50" />
            </div>

            <div className="col-span-2 grid grid-cols-4 gap-2 border-y border-gray-50 py-2 my-1">
               <div className="col-span-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#7A578D]">Shipping Details</label>
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Weight (kg)</label>
                  <input type="number" step="0.01" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="0.5" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black" />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">L (cm)</label>
                  <input type="number" value={formData.length} onChange={e => setFormData({ ...formData, length: e.target.value })} placeholder="10" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black" />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">W (cm)</label>
                  <input type="number" value={formData.width} onChange={e => setFormData({ ...formData, width: e.target.value })} placeholder="10" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black" />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">H (cm)</label>
                  <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="10" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black" />
               </div>
               <div className="col-span-4 space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">HSN Code</label>
                  <input value={formData.hsnCode} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} placeholder="e.g. 6109" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
               </div>
               <div className="col-span-4 space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Tax Rate (GST %)</label>
                  <select value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase">
                     <option value="0">0% (GST Exempt)</option>
                     <option value="3">3% (Jewellery)</option>
                     <option value="5">5% (Apparel/Footwear)</option>
                     <option value="12">12% (Electronics/Services)</option>
                     <option value="18">18% (General Goods)</option>
                     <option value="28">28% (Luxury Items)</option>
                  </select>
               </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-orange-50 border border-orange-100 p-2.5 rounded-lg hover:bg-orange-100 transition-colors">
            <input type="checkbox" checked={formData.hotDeals} onChange={e => setFormData({ ...formData, hotDeals: e.target.checked })} className="accent-orange-500 w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase text-orange-600">Mark as Hot Deal</span>
          </label>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Images</label>
            <div className="grid grid-cols-5 gap-2">
              <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#7A578D]/40 transition-all group">
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                <Upload size={16} className="text-gray-300 group-hover:text-[#7A578D] transition-colors" />
                <span className="text-[7px] font-black text-gray-400 mt-0.5 uppercase">Upload</span>
              </label>
              {existingImages.map(img => (
                <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group border border-gray-100">
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={async () => {
                      if (!window.confirm('Delete image?')) return;
                      try {
                        await api.delete(`/products/${editingProduct.id}/images/${img.id}`);
                        setExistingImages(prev => prev.filter(i => i.id !== img.id));
                        toast.success('Image deleted');
                      } catch { toast.error('Failed'); }
                    }} className="text-white p-1"><Trash2 size={14} /></button>
                  </div>
                  <div className="absolute top-0.5 left-0.5 bg-[#7A578D] text-white text-[5px] font-black px-1 rounded">LIVE</div>
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border-2 border-blue-200 border-dotted">
                  <img src={url} className="w-full h-full object-cover opacity-70" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button type="button" onClick={() => { setPreviewUrls(p => p.filter((_, idx) => idx !== i)); setImages(p => p.filter((_, idx) => idx !== i)); }} className="text-gray-600 bg-white/90 p-1 rounded-full"><Trash2 size={12} /></button>
                  </div>
                  <div className="absolute top-0.5 left-0.5 bg-blue-500 text-white text-[5px] font-black px-1 rounded">NEW</div>
                </div>
              ))}
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#7A578D]">Specifications</label>
              <button type="button" onClick={() => setAttributes(a => [...a, { key: '', value: '' }])} className="text-[8px] font-black uppercase text-[#7A578D] bg-[#7A578D]/5 px-2 py-1 rounded-lg hover:bg-[#7A578D] hover:text-white transition-all flex items-center gap-1">
                <Plus size={10} /> Add
              </button>
            </div>
            {attributes.map((attr, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Property" value={attr.key} onChange={e => { const u = [...attributes]; u[i].key = e.target.value; setAttributes(u); }} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
                <input placeholder="Value" value={attr.value} onChange={e => { const u = [...attributes]; u[i].value = e.target.value; setAttributes(u); }} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-bold" />
                <button type="button" onClick={() => setAttributes(a => a.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 p-1.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-100 transition-colors"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
            {isSubmitting ? <RefreshCw size={12} className="animate-spin" /> : <Package size={12} />}
            {isSubmitting ? (editingProduct ? 'Syncing...' : 'Recording...') : editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </ManagementModal>

      {/* Gallery Viewer */}
      {galleryView.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setGalleryView({ ...galleryView, isOpen: false })} />
          <div className="relative bg-white w-full max-w-3xl h-[80vh] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-4 right-4 z-30">
              <button onClick={() => setGalleryView({ ...galleryView, isOpen: false })} className="w-8 h-8 bg-white/80 backdrop-blur-md hover:bg-[#7A578D] hover:text-white transition-all rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden">
              <button disabled={galleryView.activeIndex === 0} onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex - 1 })} className={`absolute left-3 z-20 p-3 rounded-xl bg-white shadow border border-gray-100 text-gray-700 transition-all ${galleryView.activeIndex === 0 ? 'opacity-0' : 'hover:bg-[#7A578D] hover:text-white'}`}><ChevronRight size={18} className="rotate-180" /></button>
              <img key={galleryView.activeIndex} src={galleryView.images[galleryView.activeIndex]?.imageUrl} className="max-w-full max-h-full object-contain p-8 animate-in zoom-in-95 duration-300" alt="" />
              <button disabled={galleryView.activeIndex === galleryView.images.length - 1} onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex + 1 })} className={`absolute right-3 z-20 p-3 rounded-xl bg-white shadow border border-gray-100 text-gray-700 transition-all ${galleryView.activeIndex === galleryView.images.length - 1 ? 'opacity-0' : 'hover:bg-[#7A578D] hover:text-white'}`}><ChevronRight size={18} /></button>
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex justify-center gap-2 overflow-x-auto">
              {galleryView.images.map((img, i) => (
                <button key={i} onClick={() => setGalleryView({ ...galleryView, activeIndex: i })} className={`w-10 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === galleryView.activeIndex ? 'border-[#7A578D] scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
