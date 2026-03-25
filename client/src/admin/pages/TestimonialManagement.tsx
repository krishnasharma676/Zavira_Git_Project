
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Camera, X, MessageSquare, BadgeCheck, Clock } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const TestimonialManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Verified Buyer',
    content: '',
    rating: 5,
    isActive: true
  });

  const fetchData = async () => {
    try {
      const { data } = await api.get('/testimonials/admin/all');
      setTestimonials(data.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || 'Verified Buyer',
      content: item.content || '',
      rating: item.rating || 5,
      isActive: item.isActive
    });
    setImagePreview(item.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('content', formData.content);
    data.append('rating', formData.rating.toString());
    data.append('isActive', formData.isActive.toString());
    if (imageFile) {
        data.append('image', imageFile);
    }

    try {
      if (editingItem) {
        await api.patch(`/testimonials/${editingItem.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Updated successfully');
      } else {
        await api.post('/testimonials', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Created successfully');
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
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      role: 'Verified Buyer',
      content: '',
      rating: 5,
      isActive: true
    });
  };

  const columns = [
    {
      name: "imageUrl",
      label: "Photo",
      options: {
        customBodyRender: (val: string) => (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            {val ? (
              <img src={val} alt="User" className="w-full h-full object-cover" />
            ) : (
                <div className="text-[10px] font-black text-gray-300">N/A</div>
            )}
          </div>
        )
      }
    },
    {
      name: "name",
      label: "Customer",
      options: {
        customBodyRender: (val: string, meta: any) => (
          <div className="flex flex-col">
            <span className="font-black text-[10px] uppercase tracking-wider">{val}</span>
            <span className="text-[8px] text-gray-400 uppercase">{testimonials[meta.rowIndex].role}</span>
          </div>
        )
      }
    },
    {
      name: "rating",
      label: "Rating",
      options: {
        customBodyRender: (val: number) => (
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} fill={i < val ? "#7A578D" : "transparent"} className={i < val ? "text-[#7A578D]" : "text-gray-200"} />
            ))}
          </div>
        )
      }
    },
    {
      name: "content",
      label: "Testimonial Content",
      options: {
        customBodyRender: (val: string) => (
          <p className="truncate max-w-[200px] text-gray-500 text-[10px] italic">"{val}"</p>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const item = testimonials[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors">
                <Edit2 size={12} />
              </button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors">
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
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false,
    expandableRows: true, // USER REQ
    expandableRowsOnClick: true, // USER REQ
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const item = testimonials[rowMeta.rowIndex];
      if (!item) return null;
      return (
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
                     <MessageSquare size={12} /> Full Narrative
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm italic text-[11px] font-black uppercase text-gray-600 leading-relaxed">
                     "{item.content}"
                  </div>
                  <div className="flex gap-4">
                     <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm flex-1">
                        <span className="text-[7px] font-black text-gray-400 uppercase block mb-1">Visual Profile</span>
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100">
                              <img src={item.imageUrl || 'https://via.placeholder.com/50'} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-[9px] font-black uppercase text-gray-900">{item.name}</span>
                        </div>
                     </div>
                     <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm flex-1">
                        <span className="text-[7px] font-black text-gray-400 uppercase block mb-1">Verified Status</span>
                        <div className="flex items-center gap-1.5">
                           <BadgeCheck size={12} className={item.isActive ? "text-green-500" : "text-gray-300"} />
                           <span className={`text-[9px] font-black uppercase ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                              {item.isActive ? 'VISIBLE ON SITE' : 'HIDDEN FROM VIEW'}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <Clock size={12} /> Admin Ledger
                  </h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Customer Role</span>
                        <span className="text-[9px] font-black text-[#7A578D] uppercase">{item.role || 'VERIFIED BUYER'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-[8px] font-black text-gray-400 uppercase">System Score</span>
                        <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < item.rating ? "#7A578D" : "transparent"} className={i < item.rating ? "text-[#7A578D]" : "text-gray-200"} />
                           ))}
                        </div>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Logged At</span>
                        <span className="text-[9px] font-black text-gray-900 uppercase">{new Date(item.createdAt).toLocaleString()}</span>
                     </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                     <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Record Unique ID</span>
                     <span className="text-[8px] font-mono text-gray-400 mt-1 uppercase select-all">#{item.id}</span>
                  </div>
               </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Testimonials</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1">Manage Customer Feedback & Photos</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#7A578D] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all shadow-lg"
        >
          <Plus size={12} />
          <span>Add Testimonial</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={testimonials} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Testimonial" : "Create New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* Profile Photo Upload */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#7A578D]/30 shadow-inner">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={20} className="text-gray-300" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-md shadow-lg border border-gray-50 pointer-events-none group-hover:scale-110 transition-transform">
                <Plus size={9} className="text-[#7A578D]" strokeWidth={3} />
              </div>
              {imagePreview && (
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={8} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Customer Name</label>
              <input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Role / Tagline</label>
              <input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" 
                placeholder="e.g., Verified Buyer, Loyal Customer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Rating (1-5)</label>
              <select 
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
              <select 
                value={formData.isActive ? 'true' : 'false'} 
                onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase"
              >
                <option value="true">VISIBLE ON SITE</option>
                <option value="false">HIDDEN</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Review Content</label>
            <textarea 
              required
              rows={2} 
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase resize-none leading-relaxed" 
            />
          </div>

          <div className="pt-1">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              {isSubmitting ? 'SAVING...' : editingItem ? 'UPDATE TESTIMONIAL' : 'SAVE TESTIMONIAL'}
            </button>
          </div>
        </form>
      </ManagementModal>
    </div>
  );
};

export default TestimonialManagement;
