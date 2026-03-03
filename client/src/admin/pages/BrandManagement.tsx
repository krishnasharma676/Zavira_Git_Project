
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const BrandManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    imageUrl: '',
    isActive: true
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      setBrands(data.data);
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      imageUrl: brand.imageUrl || '',
      isActive: brand.isActive
    });
    setPreviewUrl(brand.imageUrl || '');
    setImage(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      imageUrl: '',
      isActive: true
    });
    setImage(null);
    setPreviewUrl('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete brand?')) return;
    try {
      await api.delete(`/brands/${id}`);
      toast.success('Brand deleted');
      fetchBrands();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
      data.append(key, (formData as any)[key]);
    });
    if (image) data.append('image', image);

    try {
      if (editingBrand) {
        await api.patch(`/brands/${editingBrand.id}`, data);
      } else {
        await api.post('/brands', data);
      }
      toast.success('Success');
      setIsModalOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };




  const columns = [
    {
      name: "imageUrl",
      label: "Logo",
      options: {
        customBodyRender: (val: string) => <img src={val || 'https://via.placeholder.com/100'} className="w-8 h-8 object-contain rounded shadow-sm bg-gray-50" />
      }
    },
    { name: "name", label: "Brand Name" },
    { name: "website", label: "Website", options: { customBodyRender: (val: string) => <span className="text-gray-400 normal-case truncate max-w-[150px] inline-block">{val || 'N/A'}</span> } },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center space-x-1">
             <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className={val ? 'text-green-600' : 'text-red-500'}>{val ? 'ACTIVE' : 'HIDDEN'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const brand = brands[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(brand)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors"><Edit2 size={12} /></button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors"><Trash2 size={12} /></button>
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
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Brands</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage partner brands</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>New Brand</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={brands} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Website</label>
                <input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black italic tracking-tighter" placeholder="https://..." />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Logo URL</label>
                <input value={formData.imageUrl} onChange={(e) => { setFormData({...formData, imageUrl: e.target.value}); setPreviewUrl(e.target.value); }} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black italic tracking-tighter" />
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
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Or Upload Logo</label>
              <label className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-contain p-4" /> : <Upload size={16} className="text-gray-300" />}
              </label>
           </div>

           <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
             {isSubmitting ? 'SAVING...' : 'SAVE BRAND'}
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default BrandManagement;
