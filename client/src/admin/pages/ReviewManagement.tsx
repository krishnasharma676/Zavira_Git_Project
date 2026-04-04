
import { Check, Trash2, Star, MessageSquare, RefreshCw, User, Activity, ShieldCheck, Zap, Info, ChevronRight, Package } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useReviews } from '../hooks/useReviews';

// Components
import ReviewDetailsExpanded from '../components/review/ReviewDetailsExpanded';

const ReviewManagement = () => {
  const {
    reviews,
    loading,
    fetchReviews,
    handleApprove,
    handleDelete,
  } = useReviews();

  const columns = [
    {
      name: 'user',
      label: 'Registrant Archetype',
      options: {
        customBodyRender: (val: any) => (
          <div className="flex items-center gap-4 text-left group">
            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-inner">
               <User size={18} />
            </div>
            <div className="flex flex-col truncate max-w-[150px]">
              <span className="text-[11px] font-black text-gray-900 tracking-tighter uppercase mb-1 leading-none">
                {val?.name || 'Nexus_ANONYMOUS'}
              </span>
              <span className="text-[9px] text-gray-400 font-black lowercase tracking-[0.05em] opacity-60 leading-none">
                {val?.email || 'ARCHIVE_EMPTY'}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      name: 'product',
      label: 'Asset Nexus',
      options: {
        customBodyRender: (val: any) => (
          <div className="flex items-center gap-3 text-left group">
             <div className="p-2 bg-[#7A578D]/5 text-[#7A578D] rounded-sm transition-all shadow-sm border border-[#7A578D]/10">
                <Package size={14} />
             </div>
             <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest leading-tight max-w-[180px] truncate block" title={val?.name}>
               {val?.name || 'UNRESOLVED_ARTIFACT'}
             </span>
          </div>
        )
      }
    },
    {
      name: 'rating',
      label: 'Archetype Validation',
      options: {
        customBodyRender: (val: number) => (
          <div className="flex items-center gap-1.5 text-left bg-gray-50/50 p-2 rounded-sm border border-gray-100 shadow-inner w-fit">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < val ? '#7A578D' : 'transparent'}
                className={i < val ? 'text-[#7A578D] animate-in zoom-in-50 duration-500' : 'text-gray-200'}
              />
            ))}
            <span className="ml-2 text-[10px] font-black text-gray-400">{val}.0</span>
          </div>
        )
      }
    },
    {
      name: 'comment',
      label: 'Narrative Archive',
      options: {
        customBodyRender: (val: string) => (
          <div className="max-w-[300px] text-left group cursor-help">
            <p className="truncate text-[10px] font-black text-gray-500 uppercase tracking-widest italic group-hover:text-gray-900 transition-colors" title={val}>
              "{val}"
            </p>
          </div>
        )
      }
    },
    {
      name: 'isApproved',
      label: 'Protocol State',
      options: {
        customBodyRender: (val: boolean) => (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-sm border shadow-2xl transition-all hover:scale-105 w-fit text-left ${
            val ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-orange-50 border-orange-100 text-orange-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${val ? 'bg-white shadow-lg animate-pulse' : 'bg-orange-500 shadow-lg shadow-orange-500/50'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${val ? 'text-white' : 'text-orange-700'}`}>
              {val ? 'VALIDATED_Nexus' : 'WAITING_SYNC'}
            </span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Executive Command',
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const rev = reviews[tableMeta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
              {!rev.isApproved && (
                <button
                  onClick={() => handleApprove(id)}
                  className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-90 border-b-2 border-emerald-700/20 flex items-center gap-2 group"
                  title="Approve Narrative"
                >
                  <Check size={14} className="group-hover:scale-125 transition-transform" />
                  <span>VALIDATE</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(id)}
                className="w-10 h-10 bg-white text-gray-200 hover:text-white hover:bg-red-500 rounded-sm transition-all border border-gray-100 hover:border-red-500 shadow-sm active:scale-95 flex items-center justify-center group/delete"
                title="Purge Artifact"
              >
                <Trash2 size={18} className="group-hover/delete:rotate-12 transition-transform" />
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
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const rev = reviews[rowMeta.rowIndex];
      return <ReviewDetailsExpanded review={rev} columnsLength={columns.length} />;
    },
    textLabels: {
      body: {
        noMatch: loading ? 'Synchronizing Social Proof Narrative Registry...' : 'No feedback artifacts detected in global archive'
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Feedback_Nexus_Auditor</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Social Proof Stream Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{reviews.length} REGISTERED_NARRATIVES</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchReviews}
            className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
            title="Synchronize Nexus link"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <div className="bg-black text-white p-6 rounded-sm shadow-2xl border-b-4 border-[#7A578D] hidden lg:flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-1 leading-none">PENDING_AUDITS</span>
                <span className="text-2xl font-black tracking-tighter leading-none">{reviews.filter(r => !r.isApproved).length}</span>
             </div>
             <ShieldCheck size={32} className="text-[#7A578D] opacity-40" />
          </div>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
        {loading && (
            <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
            </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={reviews} columns={columns} options={options} />
        </ThemeProvider>
      </div>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Social integrity linkage confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live sentiment sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Narrative validation 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default ReviewManagement;
