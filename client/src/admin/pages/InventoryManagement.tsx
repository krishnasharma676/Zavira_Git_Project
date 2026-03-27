import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Upload, Package,
  Search, RefreshCw, Layers, AlertTriangle,
  Minus, ChevronRight, X, Maximize2, Calendar, Filter, Truck, Palette, Image as ImageIcon
} from 'lucide-react';

import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';
import { useAdminStore } from '../../store/useAdminStore';

const emptyForm = {
  name: '', description: '', basePrice: '', discountedPrice: '',
  categoryId: '', stock: '', sku: '', hotDeals: false, sizes: '',
  weight: '', length: '', width: '', height: '', hsnCode: '', taxRate: '0',
  weightUnit: 'kg', dimensionUnit: 'cm', widthUnit: 'cm', heightUnit: 'cm'
};

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { categories } = useAdminStore();
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [galleryView, setGalleryView] = useState<{ isOpen: boolean; images: any[]; activeIndex: number }>({ isOpen: false, images: [], activeIndex: 0 });
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

  const fetchProducts = async (pageNum = 0, pageSize = 10) => {
    setLoading(true);
    try {
      // Inventory = products with NO variants (simple/single products)
      const { data } = await api.get('/products', { 
        params: { 
          page: pageNum + 1, 
          limit: pageSize, 
          search: search || undefined, 
          hasVariants: 'false' 
        } 
      });
      setProducts(data.data.products);
      setTotalRows(data.data.pagination.total);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => { 
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchProducts(0, 10); 
    }
  }, []);

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
      taxRate: product.taxRate?.toString() || '0',
      weightUnit: product.weightUnit || 'kg',
      dimensionUnit: product.dimensionUnit || 'cm',
      widthUnit: product.widthUnit || 'cm',
      heightUnit: product.heightUnit || 'cm'
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

  const generateSKU = (name: string = "") => {
    const prefix = "ZV";
    const namePart = (name || "PROD").substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${namePart}-${randomPart}`;
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ ...emptyForm, sku: generateSKU("") });
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
    fd.append('weightUnit', formData.weightUnit);
    fd.append('dimensionUnit', formData.dimensionUnit);
    fd.append('widthUnit', formData.widthUnit);
    fd.append('heightUnit', formData.heightUnit);

    const attrObj: any = {};
    attributes.forEach(a => { if (a.key && a.value) attrObj[a.key] = a.value; });
    fd.append('attributes', JSON.stringify(attrObj));
    images.forEach(img => fd.append('images', img));

    try {
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
          <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); openGallery(value); }}>
            <div className="w-8 h-6 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
              <img src={value?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
            </div>
            {(value?.length || 0) > 1 && (
              <div className="absolute -top-1 -right-1 bg-[#7A578D] text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">+{value.length - 1}</div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center">
              <Maximize2 size={12} className="text-white" />
            </div>
          </div>
        )
      }
    },
    { name: 'name', label: 'Name', options: { customBodyRender: (v: string) => <span className="text-[10px] font-black uppercase text-gray-900">{v}</span> } },
    { name: 'id', label: 'ID', options: { customBodyRender: (v: string) => <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-1 rounded-md border border-[#7A578D]/10 uppercase tracking-tighter">{v}</span> } },
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
    { name: 'category', label: 'Category', options: { customBodyRender: (v: any) => <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm w-fit"><Layers size={10} className="text-[#7A578D]" /><span className="text-[8px] font-black uppercase text-gray-600">{v?.name || 'ROOT'}</span></div> } },
    {
      name: 'inventory', label: 'Stock',
      options: {
        customBodyRender: (val: any, meta: any) => {
          const product = products[meta.rowIndex];
          const stock = val?.stock || 0;
          return (
            <div className="flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-sm border flex items-center gap-1 ${stock < 10 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                {stock < 10 && <AlertTriangle size={10} />}
                <span className="text-[11px] font-black">{stock}</span>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => openEdit(prod)} className="flex items-center gap-1 px-2 py-1 bg-[#7A578D]/5 text-[#7A578D] hover:bg-[#7A578D] hover:text-white rounded-sm transition-all text-[8px] font-black uppercase border border-[#7A578D]/10"><Edit2 size={10} /> Edit</button>
              <button onClick={() => handleDelete(id)} className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all text-[8px] font-black uppercase border border-red-100"><Trash2 size={10} /> Delete</button>
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
    serverSide: true,
    count: totalRows,
    page: page,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    onTableChange: (action: string, tableState: any) => {
      switch (action) {
        case 'changePage':
          fetchProducts(tableState.page, tableState.rowsPerPage);
          break;
        case 'changeRowsPerPage':
          fetchProducts(0, tableState.rowsPerPage);
          break;
        default: break;
      }
    },
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const product = products[rowMeta.rowIndex];
      if (!product) return null;
      return (
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Product ID:</strong>
                <span>{product.id}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Base Price:</strong>
                <span>₹{product.basePrice}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Weight:</strong>
                <span>{product.weight || 0} {product.weightUnit || 'kg'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>HSN Code:</strong>
                <span>{product.hsnCode || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Tax Rate:</strong>
                <span>{product.taxRate || 0}%</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Dimensions:</strong>
                <span>{product.length || 0}x{product.width || 0}x{product.height || 0} {product.dimensionUnit || 'cm'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Last Sync:</strong>
                <span>{new Date(product.updatedAt).toLocaleTimeString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Created On:</strong>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ gridColumn: 'span 4' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Description:</strong>
                <span>{product.description || 'N/A'}</span>
              </div>
            </div>
          </td>
        </tr>
      );
    },
    textLabels: { body: { noMatch: loading ? 'Loading...' : 'No products found' } }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 text-xs mt-1">Manage all your individual products here.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && fetchProducts(0)} 
              className="bg-gray-50 border border-gray-200 rounded-sm py-1 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs md:w-[240px] transition-all" 
            />
          </div>
          <button onClick={() => fetchProducts(0)} className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] transition-all"><RefreshCw size={18} /></button>
          <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-sm">
            <button onClick={sortByLatest} className="px-3 py-1.5 hover:bg-white hover:text-[#7A578D] hover:shadow-sm rounded-sm text-xs font-bold text-gray-500 transition-all flex items-center gap-1"><Calendar size={14} /> Newest</button>
            <button onClick={sortByLowStock} className="px-3 py-1.5 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-sm text-xs font-bold text-gray-500 transition-all flex items-center gap-1"><Filter size={14} /> Low Stock</button>
          </div>
          <button onClick={openAdd} className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={products} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSubmit} className="space-y-2">
          {editingProduct && (
            <div className="bg-[#7A578D]/5 p-3 rounded-sm border border-[#7A578D]/10 text-xs font-bold text-[#7A578D]">
              Product ID: {editingProduct.id}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Product Name</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
              <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50 appearance-none">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Stock Amount</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Price (₹)</label>
              <input type="number" required value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sale Price (₹)</label>
              <input type="number" value={formData.discountedPrice} onChange={e => setFormData({ ...formData, discountedPrice: e.target.value })} disabled={isSubmitting} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50" />
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">SKU Code</label>
              <div className="relative">
                <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} disabled={isSubmitting} placeholder="ZV-123-ABC" className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-mono font-bold uppercase disabled:opacity-50 pr-10" />
                <button type="button" onClick={() => setFormData({ ...formData, sku: generateSKU(formData.name) })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#7A578D] transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Available Sizes</label>
              <input value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} disabled={isSubmitting} placeholder="S, M, L, XL" className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs disabled:opacity-50" />
            </div>

            <div className="md:col-span-2 p-2 bg-gray-50 border border-gray-200 rounded-sm space-y-1">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-2">
                <Truck size={16} className="text-[#7A578D]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A578D]">Delivery Details</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Weight Field */}
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Weight</label>
                  <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm group-focus-within:border-[#7A578D] transition-all">
                    <input type="number" step="0.01" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="0.5" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                    <select value={formData.weightUnit} onChange={e => setFormData({...formData, weightUnit: e.target.value})} className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors uppercase">
                      <option value="kg">KG</option>
                      <option value="gm">GM</option>
                    </select>
                  </div>
                </div>

                {/* Length Field */}
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Length</label>
                  <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm group-focus-within:border-[#7A578D] transition-all">
                    <input type="number" value={formData.length} onChange={e => setFormData({ ...formData, length: e.target.value })} placeholder="10" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                    <select value={formData.dimensionUnit} onChange={e => setFormData({...formData, dimensionUnit: e.target.value})} className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors uppercase">
                      <option value="cm">CM</option>
                      <option value="mm">MM</option>
                      <option value="inch">IN</option>
                    </select>
                  </div>
                </div>

                {/* Width Field */}
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Width</label>
                  <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm group-focus-within:border-[#7A578D] transition-all">
                    <input type="number" value={formData.width} onChange={e => setFormData({ ...formData, width: e.target.value })} placeholder="10" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                    <select value={formData.widthUnit} onChange={e => setFormData({...formData, widthUnit: e.target.value})} className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors uppercase">
                      <option value="cm">CM</option>
                      <option value="mm">MM</option>
                      <option value="inch">IN</option>
                    </select>
                  </div>
                </div>

                {/* Height Field */}
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Height</label>
                  <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm group-focus-within:border-[#7A578D] transition-all">
                    <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="10" className="w-full bg-transparent py-1 px-3 outline-none text-xs font-black text-gray-900 border-r border-gray-100" />
                    <select value={formData.heightUnit} onChange={e => setFormData({...formData, heightUnit: e.target.value})} className="bg-gray-50 text-[10px] font-black text-[#7A578D] px-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors uppercase">
                      <option value="cm">CM</option>
                      <option value="mm">MM</option>
                      <option value="inch">IN</option>
                    </select>
                  </div>
                </div>

                {/* HSN & Tax */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 block mb-0.5 pl-1 uppercase tracking-widest">HSN Code</label>
                  <input value={formData.hsnCode} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} placeholder="e.g. 6109" className="w-full bg-white border border-gray-200 rounded-sm py-1 px-2 outline-none focus:border-[#7A578D] text-xs font-black uppercase shadow-sm" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 block mb-0.5 pl-1 uppercase tracking-widest">Tax Rate (%)</label>
                  <input type="number" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: e.target.value })} placeholder="e.g. 18" className="w-full bg-white border border-gray-200 rounded-sm py-1 px-2 outline-none focus:border-[#7A578D] text-xs font-black shadow-sm" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer bg-amber-50 border border-amber-200 p-2 rounded-sm hover:bg-amber-100 transition-colors group">
                <input type="checkbox" checked={formData.hotDeals} onChange={e => setFormData({ ...formData, hotDeals: e.target.checked })} className="accent-amber-600 w-5 h-5 cursor-pointer" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-amber-900">Hot Deal Product</span>
                  <span className="text-[10px] text-amber-700">Display this item in the "Hot Deals" section.</span>
                </div>
              </label>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs resize-none disabled:opacity-50" placeholder="Enter product details..." />
            </div>

            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <ImageIcon size={16} className="text-[#7A578D]" />
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Images</label>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#7A578D]/40 transition-all group">
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                  <Upload size={20} className="text-gray-400 group-hover:text-[#7A578D] transition-colors" />
                  <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Add</span>
                </label>
                {existingImages.map(img => (
                  <div key={img.id} className="aspect-square rounded-sm overflow-hidden relative group border border-gray-200">
                    <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={async () => {
                        if (!window.confirm('Remove this image?')) return;
                        try {
                          await api.delete(`/products/${editingProduct.id}/images/${img.id}`);
                          setExistingImages(prev => prev.filter(i => i.id !== img.id));
                          toast.success('Image removed');
                        } catch { toast.error('Failed'); }
                      }} className="text-white hover:text-red-400 p-2"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {previewUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-sm overflow-hidden relative group border-2 border-[#7A578D]/30 border-dashed">
                    <img src={url} className="w-full h-full object-cover opacity-60" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button type="button" onClick={() => { setPreviewUrls(p => p.filter((_, idx) => idx !== i)); setImages(p => p.filter((_, idx) => idx !== i)); }} className="text-white bg-[#7A578D]/80 p-1.5 rounded-full hover:bg-red-500 transition-colors"><X size={14} /></button>
                    </div>
                    <div className="absolute top-1 right-1 bg-[#7A578D] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">New</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                   <Layers size={16} className="text-[#7A578D]" />
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specifications</label>
                </div>
                <button type="button" onClick={() => setAttributes(a => [...a, { key: '', value: '' }])} className="text-[10px] font-bold text-[#7A578D] bg-[#7A578D]/10 px-3 py-1 rounded-sm hover:bg-[#7A578D] hover:text-white transition-all">
                  + Add Property
                </button>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto no-scrollbar pr-1">
                {attributes.map((attr, i) => (
                  <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                    <input placeholder="Attribute Name (e.g. Material)" value={attr.key} onChange={e => { const u = [...attributes]; u[i].key = e.target.value; setAttributes(u); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-sm py-1 px-3 outline-none focus:border-[#7A578D] text-xs font-bold uppercase" />
                    <input placeholder="Value (e.g. Cotton)" value={attr.value} onChange={e => { const u = [...attributes]; u[i].value = e.target.value; setAttributes(u); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-sm py-1 px-3 outline-none focus:border-[#7A578D] text-xs font-bold" />
                    <button type="button" onClick={() => setAttributes(a => a.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
                {attributes.length === 0 && (
                  <p className="text-[10px] text-gray-400 text-center py-1 bg-gray-50/50 rounded-sm border border-dashed italic">No specifications added yet.</p>
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold hover:bg-[#7A578D] transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-95">
            {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : <Package size={18} />}
            {isSubmitting ? (editingProduct ? 'Saving Changes...' : 'Adding Product...') : (editingProduct ? 'Update Product Details' : 'Save New Product')}
          </button>
        </form>
      </ManagementModal>

      {/* Gallery Viewer */}
      {galleryView.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-2 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setGalleryView({ ...galleryView, isOpen: false })} />
          <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-2 right-6 z-30">
              <button onClick={() => setGalleryView({ ...galleryView, isOpen: false })} className="w-6 h-6 bg-black/5 hover:bg-black hover:text-white transition-all rounded-full flex items-center justify-center text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden group">
              <button 
                disabled={galleryView.activeIndex === 0} 
                onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex - 1 })} 
                className={`absolute left-6 z-20 w-6 h-6 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 border border-gray-100 transition-all ${galleryView.activeIndex === 0 ? 'opacity-0 scale-75' : 'hover:bg-[#7A578D] hover:text-white hover:scale-110 active:scale-95'}`}
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              
              <img 
                key={galleryView.activeIndex} 
                src={galleryView.images[galleryView.activeIndex]?.imageUrl} 
                className="max-w-[85%] max-h-[85%] object-contain p-2 animate-in zoom-in-95 fade-in duration-500" 
                alt="" 
              />
              
              <button 
                disabled={galleryView.activeIndex === galleryView.images.length - 1} 
                onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex + 1 })} 
                className={`absolute right-6 z-20 w-6 h-6 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 border border-gray-100 transition-all ${galleryView.activeIndex === galleryView.images.length - 1 ? 'opacity-0 scale-75' : 'hover:bg-[#7A578D] hover:text-white hover:scale-110 active:scale-95'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="px-2 py-1 bg-white border-t border-gray-100 flex justify-center items-center gap-2 overflow-x-auto no-scrollbar">
              {galleryView.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setGalleryView({ ...galleryView, activeIndex: i })} 
                  className={`w-6 h-16 rounded-sm overflow-hidden border-2 shrink-0 transition-all duration-300 ${i === galleryView.activeIndex ? 'border-[#7A578D] scale-110 ring-4 ring-[#7A578D]/10' : 'border-transparent grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105'}`}
                >
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
