
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MousePointerClick } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const BannerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      const [bannerRes, catRes] = await Promise.all([
        api.get('/banners/all'),
        api.get('/categories'),
      ]);
      setBanners(bannerRes.data.data.filter((b: any) => b.type === 'HERO'));
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error('Failed to load banners');
    }
  };

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
      label: "Preview",
      options: {
        customBodyRender: (value: string) => (
          <img src={value || 'https://via.placeholder.com/100'} className="w-12 h-6 object-cover rounded-md" />
        )
      }
    },
    { name: "title", label: "Title" },
    {
      name: "clickCount",
      label: "Clicks",
      options: {
        customBodyRender: (value: number) => (
          <div className="flex items-center space-x-1">
            <MousePointerClick size={10} className="text-[#7A578D]" />
            <span>{value || 0}</span>
          </div>
        )
      }
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (value: boolean) => (
          <div className="flex items-center space-x-1">
             <div className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className={value ? 'text-green-600' : 'text-red-500'}>{value ? 'ACTIVE' : 'HIDDEN'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const banner = banners[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
              <button onClick={() => handleEdit(banner)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors">
                <Edit2 size={12} />
              </button>
              <button onClick={() => handleDelete(value)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors">
                <Trash2 size={12} />
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
    rowsPerPage: 5,
    download: false,
    print: false,
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Hero Banners</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Large landing page banners</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all shadow-lg shadow-red-500/10 group"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform" />
          <span>New Banner</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={banners} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBanner ? "Edit Banner" : "New Hero Banner"}
      >
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle</label>
                <input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Link (Direct URL or Category)</label>
                <select onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase">
                  <option value="">Manual Entry...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={`/shop?category=${cat.slug}`}>{cat.name}</option>
                  ))}
                </select>
                <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="mt-2 w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black tracking-widest" placeholder="/shop?..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase">
                  <option value="true">ACTIVE</option>
                  <option value="false">HIDDEN</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Image</label>
              <label className="w-full h-32 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Plus size={24} className="text-gray-300" />
                    <span className="text-[8px] font-black uppercase text-gray-300 mt-2">Upload Image</span>
                  </div>
                )}
              </label>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              {isSubmitting ? 'PROCESSING...' : 'SAVE BANNER'}
            </button>
         </form>
      </ManagementModal>
    </div>
  );
};

export default BannerManagement;
