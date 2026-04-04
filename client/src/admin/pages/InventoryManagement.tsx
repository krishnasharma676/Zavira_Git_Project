
import { Search, RefreshCw, Layers, AlertTriangle, Minus, Plus, Calendar, Filter, Maximize2, Package, Activity, ShieldCheck, Zap, Info, Box } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useInventory } from '../hooks/useInventory';

// Components
import ManagementModal from '../components/ManagementModal';
import ProductDetailsExpanded from '../components/inventory/ProductDetailsExpanded';
import InventoryForm from '../components/inventory/InventoryForm';
import GalleryViewer from '../components/inventory/GalleryViewer';

const InventoryManagement = () => {
    const {
        categories,
        isModalOpen, setIsModalOpen,
        editingProduct,
        products,
        totalRows,
        page, setPage,
        loading,
        isSubmitting,
        search, setSearch,
        galleryView, setGalleryView,
        existingImages,
        previewUrls,
        formData, setFormData,
        attributes, setAttributes,
        fetchProducts,
        sortByLatest,
        sortByLowStock,
        handleUpdateStock,
        generateSKU,
        openEdit,
        openAdd,
        handleDelete,
        handleImageChange,
        removeImage,
        removeExistingImage,
        handleSubmit,
        openGallery
    } = useInventory();

    const columns = [
        {
            name: 'images',
            label: 'Asset Immersion',
            options: {
                customBodyRender: (value: any[]) => (
                    <div className="relative group cursor-pointer text-left" onClick={(e) => { e.stopPropagation(); openGallery(value); }}>
                        <div className="w-12 h-18 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-[#7A578D]/20">
                            <img src={value?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Artifact" />
                        </div>
                        {(value?.length || 0) > 1 && (
                            <div className="absolute -top-3 -right-3 bg-black text-white text-[9px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-2xl z-10 animate-in zoom-in-50">
                                +{value.length - 1}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-[#7A578D]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center z-20 backdrop-blur-[1px]">
                            <Maximize2 size={18} className="text-white" />
                        </div>
                    </div>
                )
            }
        },
        { 
          name: 'name', 
          label: 'Artifact Identity', 
          options: { 
            customBodyRender: (v: string) => (
               <span className="text-[11px] font-black uppercase text-gray-900 tracking-tighter truncate max-w-[200px] block text-left group-hover:text-[#7A578D] transition-colors">{v}</span> 
            )
          } 
        },
        { 
          name: 'inventory', 
          label: 'Nexus Master SKU', 
          options: { 
            customBodyRender: (v: any) => (
                <span className="text-[8px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest shadow-inner text-left">
                   #{v?.sku || 'UNASSIGNED_Nexus'}
                </span> 
            )
          } 
        },
        {
            name: 'category',
            label: 'Index Hub',
            options: {
                customBodyRender: (v: any) => (
                    <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-1.5 rounded-sm border border-gray-100 w-fit shadow-xs text-left group">
                        <Layers size={14} className="text-[#7A578D] group-hover:rotate-12 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{v?.name || 'ROOT_Archive'}</span>
                    </div>
                )
            }
        },
        {
            name: 'inventory',
            label: 'Operational Quota',
            options: {
                customBodyRender: (val: any, meta: any) => {
                    const product = products[meta.rowIndex];
                    const stock = val?.stock || 0;
                    return (
                        <div className="flex items-center gap-4 text-left">
                            <div className={`px-4 py-2 rounded-sm border flex items-center gap-2 shadow-sm transition-all hover:scale-105 ${stock < 10 ? 'bg-red-50 border-red-100 text-red-600 shadow-red-500/5' : 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/5'}`}>
                                {stock < 10 && <AlertTriangle size={14} className="animate-pulse" />}
                                <span className="text-sm font-black tracking-tighter">{stock} UNITS</span>
                            </div>
                            <div className="flex bg-gray-900 rounded-sm overflow-hidden shadow-2xl border-b-2 border-black/20" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleUpdateStock(product.id, stock, -1)} className="p-2 hover:bg-[#7A578D] text-white/40 hover:text-white transition-all border-r border-white/10 group"><Minus size={16} /></button>
                                <button onClick={() => handleUpdateStock(product.id, stock, 1)} className="p-2 hover:bg-[#7A578D] text-white/40 hover:text-white transition-all group"><Plus size={16} /></button>
                            </div>
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
                        <div className="flex flex-col text-left">
                            <span className="text-[12px] font-black text-gray-900 tracking-tighter">₹{(disc || val).toLocaleString()}</span>
                            {disc && <span className="text-[9px] text-gray-300 line-through font-black uppercase opacity-60">₹{val.toLocaleString()}</span>}
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
              <div className={`px-4 py-2 rounded-sm text-[9px] font-black border uppercase tracking-widest text-center w-full shadow-sm transition-all ${v ? 'bg-orange-500 border-orange-400 text-white shadow-orange-500/20' : 'bg-gray-50/50 border-gray-100 text-gray-300 opacity-40 italic'}`}>
                {v ? 'HOT_DEAL_ACTIVE' : 'STANDARD_Nexus'}
              </div>
            ) 
          } 
        },
        {
            name: 'id',
            label: 'Executive command',
            options: {
                customBodyRender: (id: string, meta: any) => {
                    const prod = products[meta.rowIndex];
                    return (
                        <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
                           <button 
                             onClick={() => openEdit(prod)} 
                             className="px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-xl shadow-black/10 active:scale-90 border-b-2 border-black/20"
                           >
                             EDIT
                           </button>
                           <button 
                            onClick={() => handleDelete(id)} 
                            className="px-3 py-1.5 bg-white text-red-500 hover:text-white hover:bg-red-600 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all border border-red-100 shadow-sm active:scale-95 group"
                           >
                             DELETE
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
        renderExpandableRow: (rowData: any, rowMeta: any) => {
            const product = products[rowMeta.rowIndex];
            return <ProductDetailsExpanded product={product} columnsLength={columns.length} />;
        },
        onTableChange: (action: string, tableState: any) => {
            switch (action) {
                case 'changePage':
                    fetchProducts(tableState.page, tableState.rowsPerPage);
                    break;
                case 'changeRowsPerPage':
                    fetchProducts(0, tableState.rowsPerPage);
                    break;
            }
        },
        textLabels: { body: { noMatch: loading ? 'Synchronizing Artifact Registry Hub...' : 'No artifacts found in global registry' } }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
                <div>
                   <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Inventory_Nexus_Hub</h1>
                   <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100 shadow-xl shadow-emerald-500/5">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Synchronous Artifact Ledger Active</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{totalRows} REGISTERED_ARCHIVES</span>
                   </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#7A578D] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="FILTER_MATRIX_Nexus..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && fetchProducts(0)} 
                            className="bg-gray-50/50 border border-gray-200 rounded-sm py-2.5 pl-12 pr-6 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-[10px] font-black uppercase tracking-widest md:w-[320px] transition-all shadow-inner placeholder:italic group-hover:border-gray-300" 
                        />
                    </div>
                    <button 
                        onClick={() => fetchProducts(0)} 
                        className="p-3 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm"
                    >
                        <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                    </button>
                    
                    <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-sm shadow-inner group">
                        <button onClick={sortByLatest} className="px-5 py-2.5 hover:bg-white hover:text-[#7A578D] hover:shadow-2xl rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-2 group-hover:text-gray-500">
                           <Calendar size={14} /> CHRONO_Nexus
                        </button>
                        <button onClick={sortByLowStock} className="px-5 py-2.5 hover:bg-white hover:text-red-500 hover:shadow-2xl rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-2 group-hover:text-gray-500">
                           <Filter size={14} /> DEPLETED_LMT
                        </button>
                    </div>

                    <button 
                        onClick={openAdd} 
                        className="bg-black text-white h-12 px-6 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
                    >
                        <Plus size={22} />
                        <span>COMMISSION_Nexus</span>
                    </button>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
                    </div>
                )}
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable title="" data={products} columns={columns} options={options} />
                </ThemeProvider>
            </div>

            <ManagementModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingProduct ? 'ARTIFACT_UPDATE_Nexus' : 'COMMISSION_Nexus_ARTIFACT'}
            >
                <InventoryForm 
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  existingImages={existingImages}
                  previewUrls={previewUrls}
                  handleImageChange={handleImageChange}
                  removeImage={removeImage}
                  removeExistingImage={removeExistingImage}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  editingProduct={editingProduct}
                  generateSKU={generateSKU}
                />
            </ManagementModal>

            <GalleryViewer galleryView={galleryView} setGalleryView={setGalleryView} />
            
            <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gray-400"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory integrity confirmed</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap size={18} className="text-gray-400 animate-pulse"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live stock sync active</span>
               </div>
               <div className="flex items-center gap-3">
                  <Info size={18} className="text-gray-400"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Authoritative audit mapping 100%</span>
               </div>
            </footer>
        </div>
    );
};

export default InventoryManagement;
