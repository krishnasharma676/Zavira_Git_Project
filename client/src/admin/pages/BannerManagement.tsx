
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MousePointerClick, Search, RefreshCw, Layers } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const BannerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
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
      const [bannerRes, catRes] = await Promise.all([
        api.get('/banners/all'),
        api.get('/categories'),
      ]);
      const heroBanners = bannerRes.data.data.filter((b: any) => b.type === 'HERO');
      setBanners(heroBanners);
      setFilteredBanners(heroBanners);
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = banners.filter(b => 
      b.title?.toLowerCase().includes(term) || 
      b.id?.toLowerCase().includes(term) ||
      b.subtitle?.toLowerCase().includes(term)
    );
    setFilteredBanners(filtered);
  }, [search, banners]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
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
      title: '',
      subtitle: '',
      description: '',
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
      name: "title", 
      label: "Details",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const banner = filteredBanners[tableMeta.rowIndex];
          return (
            <div className="flex flex-col max-w-[180px]">
              <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight truncate">{value}</span>
              <span className="text-[8px] font-bold text-gray-400 truncate tracking-wide">{banner.subtitle || 'NO SUBTITLE'}</span>
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
              {id?.slice(0, 8).toUpperCase()}..
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
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-fit">
            <MousePointerClick size={10} className="text-[#7A578D]" />
            <span className="text-[9px] font-black text-[#7A578D]">{value || 0}</span>
            <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest">Clicks</span>
          </div>
        )
      }
    },
    {
      name: "link",
      label: "Destination",
      options: {
        customBodyRender: (val: string) => (
          <div className="max-w-[150px] flex items-center gap-1.5">
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
          const banner = filteredBanners[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleEdit(banner)} 
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
          <h1 className="text-base font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Banner Ledger</h1>
          <p className="text-gray-400 text-[7px] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
             <Layers size={9} className="text-[#7A578D]" /> High-Visibility Content Management
          </p>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="relative hidden md:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="Lookup Banner / ID..." 
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
             <span>Enroll Banner</span>
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
          <MUIDataTable title="" data={filteredBanners} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBanner ? "Edit Banner" : "New Hero Banner"}
      >
          <form onSubmit={handleSubmit} className="space-y-3">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                 <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
               </div>
               <div className="space-y-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle</label>
                 <input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
               </div>
             </div>

             <div className="space-y-1">
               <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
               <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase resize-none" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Link (Direct URL or Category)</label>
                 <select onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase">
                   <option value="">Manual Entry...</option>
                   {categories.map(cat => (
                     <option key={cat.id} value={`/shop?category=${cat.slug}`}>{cat.name}</option>
                   ))}
                 </select>
                 <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="mt-1.5 w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[9px] font-black tracking-widest" placeholder="/shop?..." />
               </div>
               <div className="space-y-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                 <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase">
                   <option value="true">ACTIVE</option>
                   <option value="false">HIDDEN</option>
                 </select>
               </div>
             </div>

             <div className="space-y-1">
               <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Image</label>
               <label className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                 <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                 {previewUrl ? (
                   <img src={previewUrl} className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center">
                     <Plus size={20} className="text-gray-300" />
                     <span className="text-[7px] font-black uppercase text-gray-300 mt-1.5">Upload Image</span>
                   </div>
                 )}
               </label>
             </div>

             <div className="pt-1">
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                {isSubmitting ? 'PROCESSING...' : 'SAVE BANNER'}
              </button>
             </div>
          </form>
      </ManagementModal>
    </div>
  );
};

export default BannerManagement;
