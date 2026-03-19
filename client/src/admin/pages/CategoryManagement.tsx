
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Search, Calendar, RefreshCw } from 'lucide-react';
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
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
      setFilteredCategories(data.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.id.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

  const sortByLatest = () => {
    const sorted = [...filteredCategories].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setFilteredCategories(sorted);
    toast.success('Sorted by Enrollment');
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
      label: "Visuals",
      options: {
        customBodyRender: (val: string) => (
          <div className="w-8 h-10 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-110">
            <img src={val || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
          </div>
        )
      }
    },
    { 
      name: "name", 
      label: "Collection",
      options: {
        customBodyRender: (value: string) => (
          <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{value}</span>
        )
      }
    },
    {
      name: "id",
      label: "Identity",
      options: {
        customBodyRender: (id: string) => {
          const shortId = id?.slice(0, 8).toUpperCase();
          return (
            <div className="flex items-center gap-1.5" title={id}>
              <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded border border-[#7A578D]/10">{shortId}..</span>
            </div>
          )
        }
      }
    },
    {
      name: "createdAt",
      label: "Enrollment",
      options: {
        customBodyRender: (val: string) => {
          const date = new Date(val);
          return (
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-tight">
                {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[7px] font-bold text-gray-400">
                {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          )
        }
      }
    },
    {
      name: "updatedAt",
      label: "Last Audit",
      options: {
        customBodyRender: (val: string) => {
          const date = new Date(val);
          return (
            <div className="flex flex-col opacity-60">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-tight">
                {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
              <span className="text-[7px] font-bold text-gray-400">
                {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          )
        }
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
          const cat = categories[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleEdit(cat)} 
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
          <h1 className="text-base font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Category Ledger</h1>
          <p className="text-gray-400 text-[7px] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
             Manage global collection and grouping
          </p>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="relative hidden md:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="Lookup Collection / ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-8 pr-3 outline-none focus:border-[#7A578D] text-[8px] font-black uppercase tracking-widest w-[160px] transition-all focus:w-[200px]" 
              />
           </div>
           <button onClick={fetchCategories} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all shadow-sm">
             <RefreshCw size={13} />
           </button>
           
           <div className="flex items-center bg-gray-50 border border-gray-100 p-0.5 rounded-lg gap-0.5">
              <button 
                 onClick={sortByLatest}
                 className="px-2 py-1.5 hover:bg-white hover:text-[#7A578D] rounded-md text-[7px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center gap-1"
              >
                 <Calendar size={9} /> Latest
              </button>
           </div>

           <button 
             onClick={handleAddNew}
             className="bg-black text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#7A578D] transition-all shadow-lg shadow-black/5"
           >
             <Plus size={11} />
             <span>Enroll Collection</span>
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
          <MUIDataTable title="" data={filteredCategories} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                <select value={String(isActive)} onChange={(e) => setIsActive(e.target.value === 'true')} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase">
                  <option value="true">ACTIVE</option>
                  <option value="false">HIDDEN</option>
                </select>
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL</label>
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreviewUrl(e.target.value); }} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[9px] font-black tracking-widest" placeholder="https://..." />
           </div>

           <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase resize-none" />
           </div>

           <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Or Upload Image</label>
              <label className="w-full h-20 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Upload size={14} className="text-gray-300" />}
              </label>
           </div>

           <div className="pt-1">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
              {isSubmitting ? 'SAVING...' : 'SAVE CATEGORY'}
            </button>
           </div>
        </form>
      </ManagementModal>
    </div>
  );
};

export default CategoryManagement;
