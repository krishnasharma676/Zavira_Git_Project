
import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, MousePointerClick, Search, RefreshCw, Layers, Layout } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

import { useAdminStore } from '../../store/useAdminStore';

const BannerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<any[]>([]);
  const { categories } = useAdminStore();
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    type: 'HERO',
    link: '',
    imageUrl: '',
    isActive: true
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/banners/all');
      const heroBanners = data.data.filter((b: any) => b.type === 'HERO');
      setBanners(heroBanners);
      setFilteredBanners(heroBanners);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = banners.filter(b => 
      b.id?.toLowerCase().includes(term) ||
      b.link?.toLowerCase().includes(term)
    );
    setFilteredBanners(filtered);
  }, [search, banners]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, []);

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type || 'HERO',
      link: banner.link || '',
      isActive: banner.isActive,
      imageUrl: banner.imageUrl || ''
    });
    setPreviewUrl(banner.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      fetchData();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {   
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'imageUrl') return;                              // preview only
      if (key === 'link' && !(formData as any)[key]) return;     // skip empty link
      data.append(key, (formData as any)[key]);
    });
    if (image) data.append('image', image);

    try {
      if (editingBanner) {
        await api.patch(`/banners/${editingBanner.id}`, data);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', data);
        toast.success('Banner created');
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
    setEditingBanner(null);
    setFormData({
      type: 'HERO',
      link: '',
      imageUrl: '',
      isActive: true
    });
    setImage(null);
    setPreviewUrl('');
  };



  const columns = [
    {
      name: "imageUrl",
      label: "Visuals",
      options: {
        customBodyRender: (val: string) => (
          <div className="w-16 h-8 bg-gray-50 rounded border border-gray-100 overflow-hidden shadow-sm transition-transform hover:scale-105">
            <img src={val || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Identity",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-1" title={id}>
            <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded border border-[#7A578D]/10">
              {id?.toUpperCase() || "NEW_ENTRY"}
            </span>
          </div>
        )
      }
    },
    {
      name: "clickCount",
      label: "Metrics",
      options: {
        customBodyRender: (value: number) => (
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-fit">
            <MousePointerClick size={10} className="text-[#7A578D]" />
            <span className="text-[7px] font-black text-[#7A578D]">{value || 0}</span>
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Clicks</span>
          </div>
        )
      }
    },
    {
      name: "link",
      label: "Destination",
      options: {
        customBodyRender: (val: string) => (
          <div className="max-w-[150px] flex items-center gap-1">
             <span className="text-[8px] font-bold text-gray-500 truncate lowercase bg-gray-50/50 px-2 py-0.5 rounded border border-gray-100/50">
               {val || 'NO LINK'}
             </span>
          </div>
        )
      }
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-fit">
             <div className={`w-1 h-1 rounded-full ${val ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
             <span className={`text-[12px] font-black uppercase tracking-widest ${val ? 'text-emerald-700' : 'text-red-500'}`}>{val ? 'ACTIVE' : 'HIDDEN'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Control",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const banner = filteredBanners[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleEdit(banner)} 
                className="p-1.5 hover:bg-[#7A578D]/5 text-gray-400 hover:text-[#7A578D] rounded-sm transition-all"
              >
                <Edit2 size={13} />
              </button>
              <button 
                onClick={() => handleDelete(id)} 
                className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-sm transition-all"
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
    expandableRows: false,
    textLabels: {
      body: {
        noMatch: loading ? "Synchronizing..." : "No items found in ledger",
      }
    }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Marketing Banners</h1>
          <p className="text-gray-500 text-xs mt-1">Manage high-visibility promotional content across the site.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" />
              <input 
                type="text" 
                placeholder="Search banners..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-sm py-1 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs md:w-[240px] transition-all" 
              />
           </div>
           <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] transition-all">
             <RefreshCw size={18} />
           </button>
           
           <button 
             onClick={() => { resetForm(); setIsModalOpen(true); }}
             className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95"
           >
             <Plus size={18} />
             <span>Add New Banner</span>
           </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        {loading && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
              </div>
           </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={filteredBanners} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBanner ? "Update Banner" : "New Marketing Banner"}
      >
          <form onSubmit={handleSubmit} className="space-y-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Destination URL</label>
                 <div className="space-y-1">
                    <select value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold appearance-none cursor-pointer">
                      <option value="">Manual Entry / Custom Link</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={`/shop?category=${cat.slug}`}>{cat.name} Collection</option>
                      ))}
                    </select>
                    <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" placeholder="e.g. /shop?category=rings" />
                 </div>
               </div>
               <div className="space-y-1">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Banner Status</label>
                    <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold appearance-none cursor-pointer">
                      <option value="true">PUBLISHED / ACTIVE</option>
                      <option value="false">DRAFT / HIDDEN</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Placement Type</label>
                    <div className="p-3 bg-[#7A578D]/5 border border-[#7A578D]/10 rounded-sm flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#7A578D] animate-pulse" />
                       <span className="text-xs font-bold text-[#7A578D] uppercase tracking-wider">{formData.type} SCREEN BANNER</span>
                    </div>
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Image Asset</label>
                   <label className="w-full h-[180px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#7A578D]/40 transition-all group relative overflow-hidden">
                     <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                     {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Banner preview" />
                     ) : (
                        <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                           <Layout size={32} className="text-gray-400 group-hover:text-[#7A578D]" />
                           <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-[#7A578D]">Click to select banner image</span>
                        </div>
                     )}
                     {previewUrl && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                           <span className="text-xs font-bold text-white uppercase tracking-widest px-2 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/20">Change Image</span>
                        </div>
                     )}
                   </label>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Live Preview</label>
                   <div className="w-full h-[180px] bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center relative group">
                      {previewUrl ? (
                         <img src={previewUrl} className="w-full h-full object-cover" alt="Live preview" />
                      ) : (
                         <div className="flex flex-col items-center opacity-20">
                            <Layers size={48} className="text-gray-400" />
                            <span className="text-xs font-bold uppercase mt-3">No Active Preview</span>
                         </div>
                      )}
                      <div className="absolute top-2 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                         Live
                      </div>
                   </div>
                </div>
             </div>

             <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold hover:bg-[#7A578D] transition-all shadow-xl shadow-black/5 active:scale-95 disabled:opacity-50">
                {isSubmitting ? 'WORKING...' : (editingBanner ? 'UPDATE BANNER ASSET' : 'PUBLISH BANNER')}
             </button>
          </form>
      </ManagementModal>
    </div>
  );
};

export default BannerManagement;
