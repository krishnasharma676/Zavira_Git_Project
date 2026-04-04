
import { Plus, Search, RefreshCw, Layers, Calendar, Filter, Maximize2, AlertTriangle, Edit2, Trash2, Package, Activity, ShieldCheck, Zap, Info, ChevronRight } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useBulkProductManagement } from '../hooks/useBulkProductManagement';

// Components
import ProductGalleryViewer from '../components/bulk-product/ProductGalleryViewer';
import ProductDetailsExpanded from '../components/bulk-product/ProductDetailsExpanded';

const BulkProductManagement = () => {
  const {
    products,
    galleryView,
    setGalleryView,
    totalRows,
    page,
    loading,
    search,
    setSearch,
    fetchProducts,
    sortByLatest,
    sortByName,
    handleEdit,
    openAdd,
    handleDelete,
    openGallery,
  } = useBulkProductManagement();

  const columns = [
    {
      name: 'images',
      label: 'Asset Immersion',
      options: {
        customBodyRender: (value: any[], meta: any) => {
          const product = products[meta.rowIndex];
          const variantImages = product?.variants?.flatMap((v: any) => v.images || []) || [];
          const allImages = [...(value || []), ...variantImages];
          const firstImage = allImages[0]?.imageUrl || 'https://via.placeholder.com/100';

          return (
            <div className="relative group cursor-pointer text-left" onClick={(e) => { e.stopPropagation(); openGallery(allImages); }}>
              <div className="w-14 h-20 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-2xl transition-all group-hover:scale-110 group-hover:shadow-[#7A578D]/20">
                <img src={firstImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Focus product" />
              </div>
              {allImages.length > 1 && (
                <div className="absolute -top-3 -right-3 bg-black text-white text-[9px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-2xl z-10 animate-in zoom-in-50">
                  +{allImages.length - 1}
                </div>
              )}
              <div className="absolute inset-0 bg-[#7A578D]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center z-20 backdrop-blur-[1px]">
                <Maximize2 size={24} className="text-white" />
              </div>
            </div>
          );
        }
      }
    },
    {
      name: 'name',
      label: 'Artifact Identity',
      options: {
        customBodyRender: (v: string) => (
          <div className="flex flex-col text-left group">
             <span className="text-[12px] font-black uppercase text-gray-900 tracking-tighter truncate max-w-[240px] leading-none mb-1 group-hover:text-[#7A578D] transition-colors">{v}</span>
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-40 italic">Structural Node Registered</span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Logistics Nexus',
      options: {
        customBodyRender: (v: string) => (
          <div className="flex items-center gap-3 text-left group" title={v}>
             <Package size={14} className="text-gray-300 group-hover:text-[#7A578D] transition-colors" />
             <span className="text-[9px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest leading-none shadow-inner">
               #{v.toUpperCase().slice(0, 8)}
             </span>
          </div>
        )
      }
    },
    {
      name: 'createdAt',
      label: 'Temporal Archive',
      options: {
        customBodyRender: (v: string) => {
          const d = new Date(v);
          return (
            <div className="flex items-center gap-4 text-left group">
              <div className="p-2 bg-gray-50 border border-gray-100 rounded-sm text-gray-300 group-hover:text-[#7A578D] transition-colors shadow-inner">
                 <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900 leading-none mb-1">
                  {d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">
                  Nexus_AUDIT: {d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: 'category',
      label: 'Index Hub',
      options: {
        customBodyRender: (v: any) => (
          <div className="flex items-center gap-3 bg-gray-50/50 px-4 py-2 rounded-sm border border-gray-100 w-fit shadow-inner text-left group">
            <Layers size={14} className="text-[#7A578D] group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-80">
              {v?.name?.toUpperCase() || 'ROOT_Nexus'}
            </span>
          </div>
        )
      }
    },
    {
      name: 'inventory',
      label: 'Inventory Matrix',
      options: {
        customBodyRender: (val: any) => {
          const stock = val?.stock || 0;
          return (
            <div className={`px-5 py-2.5 rounded-sm border inline-flex flex-col items-center gap-1 shadow-2xl transition-all hover:scale-110 min-w-[120px] text-left ${
              stock < 10 ? 'bg-red-500 border-red-400 text-white shadow-red-500/20' : 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
            }`}>
              <div className="flex items-center gap-2">
                {stock < 10 && <AlertTriangle size={14} className="animate-pulse shadow-lg" />}
                <span className="text-xs font-black tracking-tighter uppercase">{stock} UNITS</span>
              </div>
              <div className="w-full h-[1px] bg-white/20 my-0.5" />
              <span className="text-[7px] font-black uppercase opacity-60 tracking-[0.4em] leading-none">
                SYNC_QUOTA
              </span>
            </div>
          );
        }
      }
    },
    {
      name: 'basePrice',
      label: 'Fiscal Liability',
      options: {
        customBodyRender: (val: number, meta: any) => {
          const disc = products[meta.rowIndex]?.discountedPrice;
          return (
            <div className="flex flex-col text-left group">
               <span className="text-[14px] font-black text-gray-900 tracking-tighter group-hover:text-[#7A578D] transition-colors">₹{(disc || val).toLocaleString()}</span>
               {disc && <span className="text-[10px] text-gray-300 line-through font-black uppercase tracking-widest opacity-60">₹{val.toLocaleString()}</span>}
            </div>
          );
        }
      }
    },
    {
      name: 'hotDeals',
      label: 'Market State',
      options: {
        customBodyRender: (v: boolean) => (
          <div className={`px-4 py-2 rounded-sm text-[9px] font-black border uppercase tracking-[0.3em] text-center w-full shadow-2xl transition-all ${
            v ? 'bg-[#7A578D] border-[#7A578D]/20 text-white shadow-[#7A578D]/20' : 'bg-gray-50/50 border-gray-100 text-gray-300 opacity-40 italic'
          }`}>
            {v ? 'PROMO_ACTIVE' : 'STANDARD_Nexus'}
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Executive Command',
      options: {
        customBodyRender: (id: string, meta: any) => {
          const prod = products[meta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
               <button 
                 onClick={() => handleEdit(prod)} 
                 className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
               >
                 EDIT
               </button>
               <button 
                onClick={() => handleDelete(id)} 
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Purge Product Artifact"
               >
                 <Trash2 size={18} />
               </button>
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
    rowsPerPageOptions: [10, 20, 50],
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    onTableChange: (action: string, tableState: any) => {
      if (action === 'changePage') fetchProducts(tableState.page, tableState.rowsPerPage);
      else if (action === 'changeRowsPerPage') fetchProducts(0, tableState.rowsPerPage);
    },
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const product = products[rowMeta.rowIndex];
      return <ProductDetailsExpanded product={product} columnsLength={columns.length} />;
    },
    textLabels: { body: { noMatch: loading ? 'Synchronizing Bulk Configuration Matrix Stream...' : 'No multi-variant artifacts detected in global archive' } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Bulk Config_Nexus</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Multi-Variant Hierarchy Sync Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{totalRows} REGISTERED_ARCHIVES</span>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#7A578D] transition-colors" />
              <input 
                type="text" 
                placeholder="FILTER_ARCHIVE_Nexus..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && fetchProducts(0)} 
                className="bg-gray-50/50 border border-gray-200 rounded-sm py-2.5 pl-12 pr-6 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-[10px] font-black uppercase tracking-widest md:w-[320px] transition-all shadow-inner placeholder:italic group-hover:border-gray-300" 
              />
           </div>
           <button 
             onClick={() => fetchProducts(0)} 
             className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
             title="Synchronize Configuration Matrix"
           >
             <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
           </button>
           
           <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-sm shadow-inner group">
              <button 
                onClick={sortByLatest} 
                className="px-5 py-2.5 hover:bg-white hover:text-[#7A578D] hover:shadow-2xl rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-2 group-hover:text-gray-600 active:scale-95"
              >
                <Calendar size={14} /> CHRONO_Nexus
              </button>
              <button 
                onClick={sortByName} 
                className="px-5 py-2.5 hover:bg-white hover:text-[#7A578D] hover:shadow-2xl rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-2 group-hover:text-gray-600 active:scale-95"
              >
                <Filter size={14} /> ALPHA_Nexus
              </button>
           </div>
           
           <button 
             onClick={openAdd} 
             className="bg-black text-white h-12 px-8 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/10 active:scale-95 border-b-4 border-black/30 group"
           >
             <Plus size={22} className="group-hover:scale-110 transition-transform" />
             <span>COMMISSION_Nexus</span>
           </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
        {loading && (
           <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
           </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={products} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ProductGalleryViewer galleryView={galleryView} setGalleryView={setGalleryView} />
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Artifact integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live configuration sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Structural audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default BulkProductManagement;
