
import { Plus, Edit2, Trash2, Star, Quote, RefreshCw, Activity, ShieldCheck, Zap, Info, ChevronRight, User, Image as ImageIcon } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useTestimonials } from '../hooks/useTestimonials';

// Components
import ManagementModal from '../components/ManagementModal';
import TestimonialDetailsExpanded from '../components/testimonial/TestimonialDetailsExpanded';
import TestimonialForm from '../components/testimonial/TestimonialForm';

const TestimonialManagement = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    testimonials,
    editingItem,
    isSubmitting,
    loading,
    imagePreview,
    formData,
    setFormData,
    handleEdit,
    handleDelete,
    handleImageChange,
    handleSubmit,
    resetForm,
    setImageFile,
    setImagePreview,
    fetchData,
  } = useTestimonials();

  const columns = [
    {
      name: 'imageUrl',
      label: 'Photo immersion',
      options: {
        customBodyRender: (val: string) => (
          <div className="w-12 h-12 rounded-sm overflow-hidden bg-white border border-gray-100 flex items-center justify-center shadow-2xl group transition-all duration-700 hover:scale-110 hover:shadow-[#7A578D]/20 text-left">
            {val ? (
              <img src={val} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-20">
                 <ImageIcon size={14} className="text-gray-400" />
                 <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">NO_IMG</span>
              </div>
            )}
          </div>
        )
      }
    },
    {
      name: 'name',
      label: 'Registrant identity',
      options: {
        customBodyRender: (val: string, meta: any) => (
          <div className="flex flex-col text-left group">
            <span className="font-black text-[11px] uppercase text-gray-900 tracking-tighter truncate max-w-[150px] leading-none mb-1 group-hover:text-[#7A578D] transition-colors">
              {val}
            </span>
            <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-[#7A578D]/20 rounded-full" />
               <span className="text-[9px] font-black text-[#7A578D] uppercase tracking-[0.2em] opacity-80">
                 {testimonials[meta.rowIndex].role || 'VOICE_ARTIFACT'}
               </span>
            </div>
          </div>
        )
      }
    },
    {
      name: 'rating',
      label: 'Validation archetypal',
      options: {
        customBodyRender: (val: number) => (
          <div className="flex items-center gap-1.5 text-left bg-gray-50/50 p-2 rounded-sm border border-gray-100 shadow-inner w-fit">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < val ? '#7A578D' : 'transparent'}
                className={i < val ? 'text-[#7A578D] hover:scale-110 transition-transform' : 'text-gray-200'}
              />
            ))}
            <span className="ml-2 text-[10px] font-black text-gray-400">{val}.0</span>
          </div>
        )
      }
    },
    {
      name: 'content',
      label: 'Narrative Archive',
      options: {
        customBodyRender: (val: string) => (
          <div className="max-w-[300px] text-left group cursor-help">
            <p className="truncate text-gray-500 text-[10px] italic font-black uppercase tracking-widest opacity-70 group-hover:text-gray-900 transition-colors" title={val}>
              "{val}"
            </p>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Executive Command',
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const item = testimonials[tableMeta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
                title="Edit Narrative Artifact"
              >
                EDIT
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Purge Narrative Artifact"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
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
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const item = testimonials[rowMeta.rowIndex];
      return <TestimonialDetailsExpanded item={item} columnsLength={columns.length} />;
    },
    textLabels: { body: { noMatch: loading ? 'Synchronizing Social Proof Matrix LEDGER...' : 'No narrative fragments detected in global archive' } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Testimonial_Nexus_Matrix</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Success Stream Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{testimonials.length} REGISTERED_VOICES</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
            title="Synchronize Archive Matrix"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-black text-white h-12 px-8 rounded-sm text-[10px] font-black flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/10 active:scale-95 uppercase tracking-[0.4em] border-b-4 border-black/30 group"
          >
            <Plus size={22} className="group-hover:scale-110 transition-transform" />
            <span>RECORD_NARRATIVE</span>
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
          <MUIDataTable title="" data={testimonials} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'ARTIFACT_UPDATE_Nexus' : 'COMMISSION_Nexus_NARRATIVE'}
      >
        <div className="p-2">
           <TestimonialForm
             formData={formData}
             setFormData={setFormData}
             handleSubmit={handleSubmit}
             isSubmitting={isSubmitting}
             imagePreview={imagePreview}
             handleImageChange={handleImageChange}
             setImageFile={setImageFile}
             setImagePreview={setImagePreview}
           />
        </div>
      </ManagementModal>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Social proof integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live feedback sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Success narrative mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default TestimonialManagement;
