
import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Search, Calendar, RefreshCw, Layers, Package, Clock } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

import { useAdminStore } from '../../store/useAdminStore';

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { categories, setCategories, refreshMetadata } = useAdminStore();
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      await refreshMetadata();
      // Store categories are already updated within refreshMetadata
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = (categories || []).filter(c => 
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchCategories();
    }
  }, []);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setIsActive(category.isActive ?? true);
    setImageUrl(category.imageUrl || '');
    setPreviewUrl(category.imageUrl || '');
    setImage(null);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setName('');
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
          <div className="w-6 h-6 bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-110">
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
          return (
            <div className="flex items-center gap-1" title={id}>
              <span className="text-xs font-mono font-bold text-[#7A578D] bg-[#7A578D]/5 px-2 py-1 rounded-md border border-[#7A578D]/10 uppercase">{id}</span>
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
              <span className="text-[8px] font-medium text-gray-400 mt-0.5">
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
            <div className="flex flex-col opacity-80">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
                {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
              <span className="text-xs font-medium text-gray-400 mt-0.5">
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
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 max-w-fit">
             <div className={`w-1 h-1 rounded-full ${val ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
             <span className={`text-[8px] font-black uppercase tracking-widest ${val ? 'text-emerald-700' : 'text-red-600'}`}>{val ? 'ACTIVE' : 'HIDDEN'}</span>
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
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleEdit(cat)} 
                className="p-2 hover:bg-[#7A578D]/10 text-gray-500 hover:text-[#7A578D] rounded-sm transition-all"
                title="Edit Category"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(id)} 
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-sm transition-all"
                title="Delete Category"
              >
                <Trash2 size={16} />
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
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 text-xs mt-1">Organize your products into meaningful collections.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-sm py-1 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs md:w-[240px] transition-all" 
              />
           </div>
           <button onClick={fetchCategories} className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] transition-all">
             <RefreshCw size={18} />
           </button>
           
           <button 
             onClick={handleAddNew}
             className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95"
           >
             <Plus size={18} />
             <span>Add Category</span>
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
          <MUIDataTable title="" data={filteredCategories} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" placeholder="e.g. Summer Collection" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Visibility</label>
                <select value={String(isActive)} onChange={(e) => setIsActive(e.target.value === 'true')} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold appearance-none cursor-pointer">
                  <option value="true">ACTIVE / VISIBLE</option>
                  <option value="false">HIDDEN / ARCHIVED</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Image Link (optional)</label>
                    <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreviewUrl(e.target.value); }} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" placeholder="https://example.com/image.jpg" />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Upload Local Image</label>
                    <label className="w-full h-[140px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#7A578D]/40 transition-all group relative overflow-hidden">
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                         <Upload size={24} className="text-gray-400 group-hover:text-[#7A578D]" />
                         <span className="text-[10px] font-bold uppercase text-gray-400">Click to upload image</span>
                      </div>
                    </label>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category Preview</label>
                 <div className="w-full h-[210px] bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center relative group">
                    {previewUrl ? (
                       <>
                          <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-xs font-bold text-white uppercase tracking-widest px-2 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/20">Selected Image</span>
                          </div>
                       </>
                    ) : (
                       <div className="flex flex-col items-center opacity-20">
                          <Layers size={48} className="text-gray-400" />
                          <span className="text-xs font-bold uppercase mt-3">No Preview</span>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold hover:bg-[#7A578D] transition-all shadow-xl shadow-black/5 active:scale-95 disabled:opacity-50">
              {isSubmitting ? 'SAVING CHANGES...' : (editingCategory ? 'UPDATE CATEGORY' : 'SAVE CATEGORY')}
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default CategoryManagement;
