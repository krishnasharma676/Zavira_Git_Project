
import { Search, RefreshCw, Plus, MousePointerClick, Edit2, Trash2, Megaphone, Activity, ShieldCheck, Zap, Info, ChevronRight, Layers } from 'lucide-react';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';
import ManagementModal from '../components/ManagementModal';

// Hooks
import { useAnnouncements } from '../hooks/useAnnouncements';

// Sub-components
import AnnouncementForm from '../components/announcement/AnnouncementForm';
import AnnouncementDetails from '../components/announcement/AnnouncementDetails';

const AnnouncementManagement = () => {
  const {
    filteredAnnouncements,
    loading,
    isSubmitting,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    formData,
    setFormData,
    fetchData,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
  } = useAnnouncements();

  const columns = [
    { 
      name: "title", 
      label: "Broadcast Identity",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const item = filteredAnnouncements[tableMeta.rowIndex];
          return (
            <div className="flex flex-col max-w-[280px] text-left group">
              <span className="text-[11px] font-black uppercase text-gray-900 tracking-tighter truncate leading-none mb-1.5 group-hover:text-[#7A578D] transition-colors">{value}</span>
              <div className="flex items-center gap-2">
                 <div className="w-1 h-3 bg-[#7A578D]/20 rounded-full" />
                 <span className="text-[9px] font-black text-[#7A578D] truncate tracking-widest opacity-60 italic">{item?.subtitle || 'NULL_DESCRIPTOR'}</span>
              </div>
            </div>
          )
        }
      }
    },
    {
      name: "id",
      label: "Nexus ID",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-3 text-left group" title={id}>
             <Layers size={14} className="text-gray-300 group-hover:text-[#7A578D] transition-colors" />
             <span className="text-[9px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest leading-none shadow-inner">
               #{id?.toUpperCase().slice(0, 8)}
             </span>
          </div>
        )
      }
    },
    {
      name: "type",
      label: "Stream Origin",
      options: {
        customBodyRender: (value: string) => (
          <div className="text-left">
            <span className="bg-gray-900 text-white px-4 py-1.5 rounded-sm text-[9px] font-black tracking-[0.3em] uppercase shadow-2xl border-b-2 border-white/20 inline-block">
              {value}
            </span>
          </div>
        )
      }
    },
    {
      name: "clickCount",
      label: "Interaction Registry",
      options: {
        customBodyRender: (value: number) => (
          <div className="flex items-center gap-3 bg-gray-50/50 px-4 py-2 rounded-sm border border-gray-100 max-w-fit text-left shadow-inner group">
            <MousePointerClick size={16} className="text-[#7A578D] animate-pulse group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-gray-900 leading-none">{value || 0}</span>
               <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Nexus_Clicks</span>
            </div>
          </div>
        )
      }
    },
    {
      name: "isActive",
      label: "Temporal State",
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
      name: "id",
      label: "Executive Command",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const item = filteredAnnouncements[tableMeta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleEdit(item)} 
                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
              >
                EDIT
              </button>
              <button 
                onClick={() => handleDelete(id)} 
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Purge Broadcast Artifact"
              >
                <Trash2 size={18} />
              </button>
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
    rowsPerPageOptions: [10, 20, 50],
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const item = filteredAnnouncements[rowMeta.rowIndex];
      return <AnnouncementDetails item={item} columnsLength={columns.length} />;
    },
    textLabels: {
      body: {
        noMatch: loading ? "Synchronizing Broadcast Matrix LEDGER..." : "No communication artifacts detected in global archive",
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Broadcast_Nexus_System</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Communication Stream Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredAnnouncements.length} REGISTERED_BROADCASTS</span>
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
             onClick={fetchData} 
             className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
             title="Synchronize Broadcast Matrix"
           >
             <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
           </button>
           
           <button 
             onClick={() => { resetForm(); setIsModalOpen(true); }}
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
          <MUIDataTable title="" data={filteredAnnouncements} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "ARTIFACT_UPDATE_Nexus" : "COMMISSION_Nexus_BROADCAST"}
      >
        <div className="p-2">
           <AnnouncementForm 
             formData={formData}
             setFormData={setFormData}
             onSubmit={handleSubmit}
             isSubmitting={isSubmitting}
             editingItem={editingItem}
           />
        </div>
      </ManagementModal>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Broadcast integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live communication sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Temporal audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default AnnouncementManagement;
