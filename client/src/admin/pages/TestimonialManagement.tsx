
import { useState, useEffect, useRef } from 'react';
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
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
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
            {val ? (
              <img src={val} alt="User" className="w-full h-full object-cover" />
            ) : (
                <div className="text-[7px] font-black text-gray-400 uppercase tracking-widest">N/A</div>
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
            <span className="font-black text-[10px] uppercase text-gray-900 tracking-tight truncate max-w-[150px]">{val}</span>
            <span className="text-[8px] font-black text-[#7A578D] uppercase tracking-widest">{testimonials[meta.rowIndex].role}</span>
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
              <Star key={i} size={10} fill={i < val ? "#7A578D" : "transparent"} className={i < val ? "text-[#7A578D]" : "text-gray-200"} />
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
          <p className="truncate max-w-[200px] text-gray-500 text-[9px] italic font-black uppercase tracking-tight" title={val}>"{val}"</p>
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
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-[#7A578D]/10 text-[#7A578D] rounded-sm transition-colors border border-transparent hover:border-[#7A578D]/20 shadow-sm" title="Edit Testimonial">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(id)} className="p-2 hover:bg-red-50 text-red-500 rounded-sm transition-colors border border-transparent hover:border-red-200 shadow-sm" title="Delete Testimonial">
                <Trash2 size={16} />
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
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              <div style={{ gridColumn: 'span 4' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Full Testimonial:</strong>
                <span>{item.content}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Customer Role:</strong>
                <span>{item.role || 'Verified Buyer'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Status:</strong>
                <span>{item.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Rating:</strong>
                <span>{item.rating} / 5</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Added On:</strong>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Internal ID:</strong>
                <span>{item.id}</span>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Reviews</h1>
          <p className="text-gray-500 text-xs mt-1">Manage customer feedback and testimonials published on the site.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          <span>Add Testimonial</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={testimonials} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Testimonial" : "New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Profile Photo Upload */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-sm bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#7A578D]/40 shadow-inner p-1">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-sm" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera size={24} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-sm shadow-lg border border-gray-100 pointer-events-none group-hover:scale-110 transition-transform">
                <Plus size={12} className="text-[#7A578D]" />
              </div>
              {imagePreview && (
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-sm shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Customer Name</label>
              <input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" 
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Customer Role</label>
              <input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" 
                placeholder="e.g. Verified Buyer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Star Rating</label>
              <select 
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold appearance-none cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Visibility</label>
              <select 
                value={formData.isActive ? 'true' : 'false'} 
                onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold appearance-none cursor-pointer"
              >
                <option value="true">VISIBLE ON SITE</option>
                <option value="false">HIDDEN / DRAFT</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Review Content</label>
            <textarea 
              required
              rows={4} 
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium transition-all resize-none leading-relaxed italic" 
              placeholder="Enter customer feedback here..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold hover:bg-[#7A578D] transition-all shadow-xl shadow-black/5 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'WORKING...' : (editingItem ? 'UPDATE TESTIMONIAL' : 'SAVE TESTIMONIAL')}
          </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default TestimonialManagement;
