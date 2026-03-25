import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MousePointerClick, Search, RefreshCw, Megaphone, Activity, Clock } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const AnnouncementManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'ANNOUNCEMENT',
    link: '',
    isActive: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/all');
      const filtered = res.data.data.filter((b: any) => b.type === 'ANNOUNCEMENT' || b.type === 'BADGE');
      setAnnouncements(filtered);
      setFilteredAnnouncements(filtered);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = announcements.filter(a => 
      a.title?.toLowerCase().includes(term) || 
      a.id?.toLowerCase().includes(term) ||
      a.subtitle?.toLowerCase().includes(term)
    );
    setFilteredAnnouncements(filtered);
  }, [search, announcements]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      type: item.type || 'ANNOUNCEMENT',
      link: item.link || '',
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Announcement removed');
      fetchData();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.patch(`/banners/${editingItem.id}`, formData);
        toast.success('Announcement updated');
      } else {
        await api.post('/banners', formData);
        toast.success('Announcement created');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      type: 'ANNOUNCEMENT',
      link: '',
      isActive: true
    });
  };




  const columns = [
    { 
      name: "title", 
      label: "Details",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const item = filteredAnnouncements[tableMeta.rowIndex];
          return (
            <div className="flex flex-col max-w-[200px]">
              <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight truncate">{value}</span>
              <span className="text-[8px] font-bold text-gray-400 truncate tracking-wide">{item.subtitle || 'NO SUBTITLE'}</span>
            </div>
          )
        }
      }
    },
    {
      name: "id",
      label: "Identity",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-1.5" title={id}>
            <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded border border-[#7A578D]/10">
              {id?.toUpperCase()}
            </span>
          </div>
        )
      }
    },
    {
      name: "type",
      label: "Category",
      options: {
        customBodyRender: (value: string) => (
          <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-[7px] font-black text-gray-500 tracking-[0.1em] uppercase shadow-sm">
            {value}
          </span>
        )
      }
    },
    {
      name: "clickCount",
      label: "Metrics",
      options: {
        customBodyRender: (value: number) => (
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-fit">
            <MousePointerClick size={10} className="text-[#7A578D]" />
            <span className="text-[9px] font-black text-[#7A578D]">{value || 0}</span>
            <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest">Interactions</span>
          </div>
        )
      }
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-fit">
             <div className={`w-1 h-1 rounded-full ${val ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
             <span className={`text-[7px] font-black uppercase tracking-widest ${val ? 'text-emerald-700' : 'text-red-500'}`}>{val ? 'ACTIVE' : 'HIDDEN'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Control",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const item = filteredAnnouncements[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleEdit(item)} 
                className="p-1.5 hover:bg-[#7A578D]/5 text-gray-400 hover:text-[#7A578D] rounded-lg transition-all"
              >
                <Edit2 size={13} />
              </button>
              <button 
                onClick={() => handleDelete(id)} 
                className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 size={13} />
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
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    expandableRows: true, // USER REQ
    expandableRowsOnClick: true, // USER REQ
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const item = announcements[rowMeta.rowIndex];
      if (!item) return null;
      return (
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
               {/* Alert Information */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
                     <Megaphone size={12} /> Broadcast Pulse
                  </h3>
                  <div className="space-y-3 pl-4">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Primary Directive</span>
                        <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{item.title}</h4>
                        <p className="text-[9px] font-bold text-[#7A578D] uppercase mt-1 italic">{item.subtitle || 'NO_SECONDARY_DATA'}</p>
                     </div>
                     <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm flex items-center justify-between group">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Alert Strategy</span>
                        <span className="text-[9px] font-black text-gray-900 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{item.type}</span>
                     </div>
                  </div>
               </div>

               {/* Performance Metrics */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <Activity size={12} /> Live Metrics
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                     <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <MousePointerClick size={12} className="text-[#7A578D]" />
                           <span className="text-[8px] font-black text-gray-400 uppercase">Interactive Reach</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{item.clickCount || 0} CLICKS</span>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 italic">Destination Protocol</span>
                        <div className="bg-white px-2 py-1 rounded border border-gray-100 text-[9px] font-bold text-gray-500 lowercase truncate leading-none">
                           {item.link || 'DIRECT_ACTION_DISABLED'}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Registry Audit */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <Clock size={12} /> Registry Audit
                  </h3>
                  <div className="space-y-3">
                     <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Creation Stamp</span>
                        <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-[9px] font-black text-gray-700 uppercase">
                           {new Date(item.createdAt).toLocaleString()}
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Terminal Audit</span>
                        <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-[9px] font-black text-gray-700 uppercase">
                           {new Date(item.updatedAt).toLocaleString()}
                        </div>
                     </div>
                     <div className="pt-2">
                        <div className={`p-2 rounded-lg border flex items-center justify-center gap-2 ${
                           item.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                           <div className={`w-1 h-1 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                           <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.isActive ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </td>
        </tr>
      );
    },
    textLabels: {
      body: {
        noMatch: loading ? "Synchronizing..." : "No items found in ledger",
      }
    }
  };


  return (
    <div className="space-y-3 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-1.5">
        <div>
          <h1 className="text-base font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Announcement Ledger</h1>
          <p className="text-gray-400 text-[7px] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
             <Megaphone size={9} className="text-[#7A578D]" /> Broadcast & Alert Synchronization
          </p>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="relative hidden md:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="Lookup Alert / ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-8 pr-3 outline-none focus:border-[#7A578D] text-[8px] font-black uppercase tracking-widest w-[160px] transition-all focus:w-[200px]" 
              />
           </div>
           <button onClick={fetchData} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all shadow-sm">
             <RefreshCw size={13} />
           </button>
           
           <button 
             onClick={() => { resetForm(); setIsModalOpen(true); }}
             className="bg-black text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#7A578D] transition-all shadow-lg shadow-black/5"
           >
             <Plus size={11} />
             <span>Enroll Alert</span>
           </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative min-h-[500px]">
        {loading && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
                 <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Accessing Ledger...</span>
              </div>
           </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={filteredAnnouncements} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Entry" : "Create Entry"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
              <input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="compact-input w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" 
                placeholder="PROMO TEXT..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase"
              >
                <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                <option value="BADGE">BADGE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Link / URL</label>
            <input 
              value={formData.link} 
              onChange={(e) => setFormData({...formData, link: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black tracking-widest" 
              placeholder="/shop..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="accent-[#7A578D]"
            />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Visible on site</span>
          </div>

          <div className="pt-1">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </ManagementModal>
    </div>
  );
};

export default AnnouncementManagement;
