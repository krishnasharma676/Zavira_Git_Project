
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsActive(category.isActive ?? true);
    setImageUrl(category.imageUrl || '');
    setPreviewUrl(category.imageUrl || '');
    setImage(null);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsActive(true);
    setImageUrl('');
    setPreviewUrl('');
    setImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
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
    data.append('name', name);
    data.append('description', description);
    data.append('isActive', String(isActive));
    if (imageUrl) data.append('imageUrl', imageUrl);
    if (image) data.append('image', image);

    try {
      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, data);
      } else {
        await api.post('/categories', data);
      }
      toast.success('Success');
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };




  const columns = [
    {
      name: "imageUrl",
      label: "Image",
      options: {
        customBodyRender: (val: string) => <img src={val || 'https://via.placeholder.com/100'} className="w-8 h-8 object-cover rounded shadow-sm" />
      }
    },
    { name: "name", label: "Category Name" },
    { name: "slug", label: "Slug", options: { customBodyRender: (val: string) => <span className="text-gray-400 lowercase">{val}</span> } },
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
          const cat = categories[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(cat)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded"><Edit2 size={12} /></button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded"><Trash2 size={12} /></button>
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
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Categories</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage global collections</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>New Category</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={categories} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                <select value={String(isActive)} onChange={(e) => setIsActive(e.target.value === 'true')} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase">
                  <option value="true">ACTIVE</option>
                  <option value="false">HIDDEN</option>
                </select>
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL</label>
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreviewUrl(e.target.value); }} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black tracking-widest" placeholder="https://..." />
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" />
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Or Upload Image</label>
              <label className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Upload size={16} className="text-gray-300" />}
              </label>
           </div>

           <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
             {isSubmitting ? 'SAVING...' : 'SAVE CATEGORY'}
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default CategoryManagement;
