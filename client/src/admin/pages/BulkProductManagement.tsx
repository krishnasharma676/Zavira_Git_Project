import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Upload, Package,
  Search, RefreshCw, Layers, AlertTriangle,
  ChevronRight, X, Maximize2, Calendar, Filter, Truck, Palette
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const BulkProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [galleryView, setGalleryView] = useState<{ isOpen: boolean; images: any[]; activeIndex: number }>({ isOpen: false, images: [], activeIndex: 0 });
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async (pageNum = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { 
        params: { 
          page: pageNum + 1, 
          limit: pageSize, 
          search: search || undefined, 
          hasVariants: 'true' 
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
              <div className="w-6 h-16 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                <img src={firstImage} className="w-full h-full object-cover" alt="" />
              </div>
              {allImages.length > 1 && (
                <div className="absolute -top-2 -right-2 bg-[#7A578D] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">+{allImages.length - 1}</div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center z-20 backdrop-blur-[1px]">
                <Maximize2 size={20} className="text-white" />
              </div>
            </div>
          );
        }
      }
    },
    { name: 'name', label: 'Name', options: { customBodyRender: (v: string) => <span className="text-xs font-bold uppercase text-gray-900 tracking-wider truncate max-w-[200px] block">{v}</span> } },
    { name: 'id', label: 'ID', options: { customBodyRender: (v: string) => <span className="text-xs font-mono font-bold text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest shadow-sm">#{v}</span> } },
    {
      name: 'createdAt', label: 'Date',
      options: {
        customBodyRender: (v: string) => {
          const d = new Date(v);
          return (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
          );
        }
      }
    },
    { name: 'category', label: 'Category', options: { customBodyRender: (v: any) => <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100 w-fit shadow-xs"><Layers size={14} className="text-[#7A578D]" /><span className="text-xs font-bold uppercase tracking-widest text-gray-600">{v?.name || 'GENERIC'}</span></div> } },
    {
      name: 'inventory', label: 'Total Stock',
      options: {
        customBodyRender: (val: any) => {
          const stock = val?.stock || 0;
          return (
            <div className={`px-2 py-1 rounded-sm border inline-flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-105 min-w-[100px] ${stock < 10 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              <div className="flex items-center gap-2">
                {stock < 10 && <AlertTriangle size={14} className="animate-pulse" />}
                <span className="text-base font-black">{stock}</span>
              </div>
              <span className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em] leading-none">Total units</span>
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
              <span className="text-xs font-bold text-gray-900 tracking-tight">₹{disc || val}</span>
              {disc && <span className="text-xs text-gray-400 line-through">₹{val}</span>}
            </div>
          );
        }
      }
    },
    { name: 'hotDeals', label: 'Status', options: { customBodyRender: (v: boolean) => <div className={`px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-widest text-center w-fit ${v ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>{v ? 'HOT DEAL' : 'NORMAL'}</div> } },
    {
      name: 'id', label: 'Actions',
      options: {
        customBodyRender: (id: string, meta: any) => {
          const prod = products[meta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2">
              <button onClick={() => handleEdit(prod)} className="p-2 hover:bg-[#7A578D]/10 text-gray-500 hover:text-[#7A578D] rounded-sm transition-all" title="Edit Product"><Edit2 size={16} /></button>
              <button
                onClick={() => navigate(`/admin/bulk-products/manage/${id}`)}
                className="px-2.5 py-1.5 bg-white border border-[#7A578D]/30 text-[#7A578D] hover:bg-[#7A578D] hover:text-white rounded-sm transition-all flex items-center gap-1 text-xs font-bold uppercase shadow-sm"
                title="Manage Variants"
              >
                <Layers size={14} /> VARS
              </button>
              <button onClick={() => handleDelete(id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-sm transition-all" title="Delete"><Trash2 size={16} /></button>
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
        <tr className="bg-gray-50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-300">
              {/* Product Profile */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-8 bg-[#7A578D] rounded-full shadow-sm" />
                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                     <Package size={18} className="text-[#7A578D]" /> Bulk Identity
                   </h3>
                </div>
                <div className="space-y-2 pl-5 border-l-2 border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-2">Description Ledger</span>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-[350px]">{product.description || 'No description provided'}</p>
                   </div>
                   <div className="p-2 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-4 h-full align-middle border-b border-gray-100 pb-3">
                         <Truck size={18} className="text-[#7A578D]" />
                         <span className="text-xs font-bold uppercase tracking-widest text-[#7A578D]">Shipping Hub</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weight:</span>
                         <span className="text-xs font-bold text-gray-900">{product.weight || 0} KG</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dims (LxWxH):</span>
                         <span className="text-xs font-bold text-gray-900">{product.length || 0}x{product.width || 0}x{product.height || 0} CM</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tax Rate:</span>
                         <span className="text-xs font-bold text-gray-900">{product.taxRate || 0}% GST</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">HSN Code:</span>
                         <span className="text-xs font-bold text-gray-900">{product.hsnCode || 'N/A'}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Variants Breakdown */}
              <div className="space-y-2 lg:border-l-2 lg:border-gray-100 lg:pl-8 lg:col-span-2">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                       <Palette size={18} className="text-[#7A578D]" /> Color Variant Matrix
                    </h3>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block bg-gray-100 px-3 py-1 rounded-md">{product.variants?.length || 0} Colors Managed</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.variants?.length > 0 ? (
                      product.variants.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-sm hover:shadow-md hover:border-[#7A578D]/30 transition-all group cursor-default shadow-sm">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-sm overflow-hidden border border-gray-100 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                                 <img src={v.images?.[0]?.imageUrl || 'https://via.placeholder.com/50'} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="flex flex-col gap-1">
                                 <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{v.color}</span>
                                 <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">#{v.id}</span>
                              </div>
                           </div>
                           <div className="text-right flex flex-col items-end gap-2">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${v.inventory?.stock > 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                 {v.inventory?.stock || 0} UNIT
                              </span>
                              <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg ring-1 ring-black/5" style={{ backgroundColor: v.colorCode }} />
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-12 flex flex-col items-center justify-center bg-white rounded-sm border-2 border-dashed border-gray-200">
                         <AlertTriangle className="text-gray-400 mb-4" size={40} />
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active variants detected</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </td>
        </tr>
      );
    },
    textLabels: { body: { noMatch: loading ? 'Loading...' : 'No bulk products found' } }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Variant Products</h1>
          <p className="text-gray-500 text-xs font-medium mt-2 flex items-center gap-2">
            <Layers size={16} className="text-[#7A578D]" /> Products with Multiple Colors or Sizes
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group hidden lg:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts(0)} className="bg-white border border-gray-200 rounded-sm py-1 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium w-[200px] transition-all focus:w-[260px] shadow-sm" />
          </div>
          <button onClick={() => fetchProducts(0)} className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:rotate-180 hover:text-[#7A578D] hover:border-[#7A578D] transition-all duration-500 shadow-sm flex items-center justify-center"><RefreshCw size={18} /></button>
          <div className="flex items-center bg-gray-100 border border-gray-200 p-1 rounded-sm gap-1 shadow-inner">
            <button onClick={sortByLatest} className="px-3 py-1.5 hover:bg-white hover:text-[#7A578D] rounded-sm text-xs font-bold uppercase tracking-wider text-gray-600 transition-all flex items-center gap-2 hover:shadow-sm"><Calendar size={14} /> Latest</button>
            <button onClick={sortByName} className="px-3 py-1.5 hover:bg-white hover:text-[#7A578D] rounded-sm text-xs font-bold uppercase tracking-wider text-gray-600 transition-all flex items-center gap-2 hover:shadow-sm"><Filter size={14} /> Index</button>
          </div>
          <button onClick={openAdd} className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95">
            <Plus size={16} /> New Product
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

      {/* Modal removed - using dedicated pages */}

      {/* Gallery Viewer */}
      {galleryView.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setGalleryView({ ...galleryView, isOpen: false })} />
          <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-sm overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-2 right-4 z-30">
              <button onClick={() => setGalleryView({ ...galleryView, isOpen: false })} className="w-6 h-6 bg-black/50 hover:bg-black text-white backdrop-blur-md transition-all rounded-full flex items-center justify-center border border-white/20">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-100 relative overflow-hidden group">
              <button disabled={galleryView.activeIndex === 0} onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex - 1 })} className={`absolute left-4 z-20 p-3 rounded-full bg-white/80 hover:bg-white shadow-xl border border-gray-200 text-gray-900 transition-all transform hover:scale-110 active:scale-95 ${galleryView.activeIndex === 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}><ChevronRight size={24} className="rotate-180" /></button>
              <img key={galleryView.activeIndex} src={galleryView.images[galleryView.activeIndex]?.imageUrl} className="max-w-full max-h-full object-contain animate-in fade-in duration-300" alt="" />
              <button disabled={galleryView.activeIndex === galleryView.images.length - 1} onClick={() => setGalleryView({ ...galleryView, activeIndex: galleryView.activeIndex + 1 })} className={`absolute right-4 z-20 p-3 rounded-full bg-white/80 hover:bg-white shadow-xl border border-gray-200 text-gray-900 transition-all transform hover:scale-110 active:scale-95 ${galleryView.activeIndex === galleryView.images.length - 1 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}><ChevronRight size={24} /></button>
            </div>
            <div className="p-2 bg-white border-t border-gray-100 flex justify-center gap-2 overflow-x-auto shadow-inner">
              {galleryView.images.map((img, i) => (
                <button key={i} onClick={() => setGalleryView({ ...galleryView, activeIndex: i })} className={`w-6 h-16 rounded-sm overflow-hidden border-2 shrink-0 transition-all ${i === galleryView.activeIndex ? 'border-[#7A578D] scale-110 shadow-md z-10' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}>
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
