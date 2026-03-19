import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Upload, Package,
  Search, RefreshCw, Layers, AlertTriangle,
  ChevronRight, X, Maximize2, Calendar, Filter
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const BulkProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [galleryView, setGalleryView] = useState<{ isOpen: boolean; images: any[]; activeIndex: number }>({ isOpen: false, images: [], activeIndex: 0 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Bulk Products = products WITH variants
      const { data } = await api.get('/products', { params: { limit: 1000, search: search || undefined, hasVariants: 'true' } });
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
  const sortByName = () => {
    setProducts(p => [...p].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleEdit = (product: any) => {
    navigate(`/admin/bulk-products/edit/${product.id}`);
  };

  const openAdd = () => {
    navigate('/admin/bulk-create');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product and all its variants?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  // Removed handleSubmit modal logic - using dedicated edit page

  const openGallery = (imgs: any[]) => {
    if (imgs?.length > 0) setGalleryView({ isOpen: true, images: imgs, activeIndex: 0 });
  };

  const columns = [
    {
      name: 'images', label: 'Photo',
      options: {
        customBodyRender: (value: any[], meta: any) => {
          const product = products[meta.rowIndex];
          const variantImages = product?.variants?.flatMap((v: any) => v.images || []) || [];
          const allImages = [...(value || []), ...variantImages];
          const firstImage = allImages[0]?.imageUrl || 'https://via.placeholder.com/100';

          return (
            <div className="relative group cursor-pointer" onClick={() => openGallery(allImages)}>
              <div className="w-8 h-10 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                <img src={firstImage} className="w-full h-full object-cover" alt="" />
              </div>
              {allImages.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-[#7A578D] text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">+{allImages.length - 1}</div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Maximize2 size={12} className="text-white" />
              </div>
            </div>
          );
        }
      }
    },
    { name: 'name', label: 'Name', options: { customBodyRender: (v: string) => <span className="text-[10px] font-black uppercase text-gray-900">{v}</span> } },
    { name: 'id', label: 'ID', options: { customBodyRender: (v: string) => <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded">{v?.slice(0, 8).toUpperCase()}..</span> } },
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
      name: 'inventory', label: 'Total Stock',
      options: {
        customBodyRender: (val: any) => {
          const stock = val?.stock || 0;
          return (
            <div className={`px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 ${stock < 10 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
              {stock < 10 && <AlertTriangle size={10} />}
              <span className="text-[11px] font-black">{stock}</span>
              <span className="text-[7px] font-black opacity-60">via variants</span>
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
              <button onClick={() => handleEdit(prod)} className="p-1.5 hover:bg-[#7A578D]/5 text-gray-400 hover:text-[#7A578D] rounded-lg transition-all" title="Edit Product"><Edit2 size={13} /></button>
              <button
                onClick={() => navigate(`/admin/bulk-products/manage/${id}`)}
                className="p-1 bg-white border border-[#7A578D]/20 text-[#7A578D] hover:bg-[#7A578D] hover:text-white rounded-lg transition-all flex items-center gap-1 text-[7px] font-black uppercase"
                title="Manage Variants"
              >
                <Layers size={10} /> VARS
              </button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all" title="Delete"><Trash2 size={13} /></button>
            </div>
          );
        }
      }
    },
  ];

  const options = { selectableRows: 'none' as const, elevation: 0, responsive: 'standard' as const, rowsPerPage: 10, download: false, print: false, viewColumns: false, search: false, filter: false, textLabels: { body: { noMatch: loading ? 'Loading...' : 'No bulk products found' } } };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-2.5">
        <div>
          <h1 className="text-base font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Variant Products</h1>
          <p className="text-gray-400 text-[7px] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
            <Layers size={9} className="text-[#7A578D]" /> Products with Multiple Colors / Sizes
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative hidden md:block">
            <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()} className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-8 pr-3 outline-none focus:border-[#7A578D] text-[9px] font-black uppercase tracking-widest w-[160px] transition-all focus:w-[220px]" />
          </div>
          <button onClick={fetchProducts} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all shadow-sm"><RefreshCw size={12} /></button>
          <div className="flex items-center bg-gray-50 border border-gray-100 p-0.5 rounded-lg gap-0.5">
            <button onClick={sortByLatest} className="px-2.5 py-1 hover:bg-white hover:text-[#7A578D] rounded-md text-[7px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-1"><Calendar size={9} /> Latest</button>
            <button onClick={sortByName} className="px-2.5 py-1 hover:bg-white hover:text-[#7A578D] rounded-md text-[7px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-1"><Filter size={9} /> A-Z</button>
          </div>
          <button onClick={openAdd} className="bg-black text-white px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#7A578D] transition-all shadow-lg shadow-black/5">
            <Plus size={11} /> New Variant Product
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

      {/* Modal removed - using dedicated pages */}

      {/* Gallery Viewer */}
      {galleryView.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setGalleryView({ ...galleryView, isOpen: false })} />
          <div className="relative bg-white w-full max-w-3xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-4 right-4 z-30">
              <button onClick={() => setGalleryView({ ...galleryView, isOpen: false })} className="w-9 h-9 bg-white/80 backdrop-blur-md hover:bg-[#7A578D] hover:text-white transition-all rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                <X size={18} />
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

export default BulkProductManagement;
