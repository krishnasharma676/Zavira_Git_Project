
import { Plus, Edit2, Trash2, Search, RefreshCw, Layers, Calendar, Layout, Info, Activity, ShieldCheck, Zap, ChevronRight, Image as ImageIcon } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Components
import ManagementModal from '../components/ManagementModal';
import CategoryForm from '../components/category/CategoryForm';

// Hooks
import { useCategories } from '../hooks/useCategories';

const CategoryManagement = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    filteredCategories,
    isSubmitting,
    loading,
    search,
    setSearch,
    name,
    setName,
    isActive,
    setIsActive,
    imageUrl,
    setImageUrl,
    previewUrl,
    setPreviewUrl,
    fetchCategories,
    handleEdit,
    handleAddNew,
    handleDelete,
    handleImageChange,
    handleSubmit,
  } = useCategories();

  const columns = [
    {
      name: 'imageUrl',
      label: 'Asset Immersion',
      options: {
        customBodyRender: (val: string) => (
          <div className="w-14 h-14 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-2xl transition-all hover:scale-110 hover:shadow-[#7A578D]/20 text-left group">
            {val ? (
              <img src={val} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Collection Asset" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1 opacity-[0.05] group-hover:opacity-20 transition-opacity">
                <ImageIcon size={18} className="text-gray-900" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">NO_IMG</span>
              </div>
            )}
            <div className="absolute inset-0 bg-[#7A578D]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )
      }
    },
    {
      name: 'name',
      label: 'Taxonomy Nexus',
      options: {
        customBodyRender: (value: string) => (
          <div className="flex flex-col text-left group cursor-pointer">
             <span className="text-[12px] font-black uppercase text-gray-900 tracking-tighter leading-none mb-1 group-hover:text-[#7A578D] transition-colors">{value}</span>
             <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest opacity-40 italic">Structural Node Active</span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Archive ID',
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-3 text-left group" title={id}>
             <Layers size={14} className="text-gray-300 group-hover:text-[#7A578D] transition-colors" />
             <span className="text-[9px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest leading-none shadow-inner">
               #{id.toUpperCase().slice(0, 8)}
             </span>
          </div>
        )
      }
    },
    {
      name: 'createdAt',
      label: 'Temporal Register',
      options: {
        customBodyRender: (val: string) => {
          const date = new Date(val);
          return (
            <div className="flex items-center gap-4 text-left group">
              <div className="p-2 bg-gray-50 border border-gray-100 rounded-sm text-gray-300 group-hover:text-[#7A578D] transition-colors shadow-inner">
                 <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900 leading-none mb-1">
                  {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">
                  Nexus_AUDIT: {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: 'isActive',
      label: 'Protocol state',
      options: {
        customBodyRender: (val: boolean) => (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-sm border shadow-2xl transition-all hover:scale-105 w-fit text-left ${val ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-red-500 border-red-400 text-white shadow-red-500/20 opacity-40'}`}>
             <div className={`w-2 h-2 rounded-full bg-white ${val ? 'animate-pulse shadow-lg shadow-white/50' : 'opacity-50'}`} />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] font-black leading-none">{val ? 'ACTIVE_Nexus' : 'HELD_DRAFT'}</span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Executive Command',
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const cat = filteredCategories[tableMeta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleEdit(cat)}
                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
              >
                EDIT
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Purge Categorical Artifact"
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
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    textLabels: { body: { noMatch: loading ? 'Synchronizing Taxonomy Matrix Stream...' : 'No categorical artifacts detected in global archive' } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Taxonomy_Nexus_Matrix</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Categorical Stream Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredCategories.length} REGISTERED_COLLECTIONS</span>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#7A578D] transition-colors" />
              <input 
                type="text" 
                placeholder="FILTER_Nexus_SUBJECT..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="bg-gray-50/50 border border-gray-200 rounded-sm py-2.5 pl-12 pr-6 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-[10px] font-black uppercase tracking-widest md:w-[320px] transition-all shadow-inner placeholder:italic group-hover:border-gray-300" 
              />
           </div>
           <button 
             onClick={fetchCategories} 
             className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
             title="Synchronize Taxonomy matrix"
           >
             <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
           </button>
           
           <button 
             onClick={handleAddNew} 
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
          <MUIDataTable title="" data={filteredCategories} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? "ARTIFACT_UPDATE_Nexus" : "COMMISSION_Nexus_COLLECTION"}
      >
        <div className="p-2">
           <CategoryForm 
             name={name}
             setName={setName}
             isActive={isActive}
             setIsActive={setIsActive}
             imageUrl={imageUrl}
             setImageUrl={setImageUrl}
             previewUrl={previewUrl}
             setPreviewUrl={setPreviewUrl}
             handleImageChange={handleImageChange}
             handleSubmit={handleSubmit}
             isSubmitting={isSubmitting}
             editingCategory={editingCategory}
           />
        </div>
      </ManagementModal>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Taxonomy integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live categorical sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Structural audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default CategoryManagement;
