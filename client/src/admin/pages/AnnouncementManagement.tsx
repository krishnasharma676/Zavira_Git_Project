
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Zap, CheckCircle, MousePointerClick } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const AnnouncementManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'ANNOUNCEMENT',
    link: '',
    isActive: true
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/banners/all');
      const filtered = res.data.data.filter((b: any) => b.type === 'ANNOUNCEMENT' || b.type === 'BADGE');
      setAnnouncements(filtered);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

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
      label: "Title",
      options: {
        customBodyRender: (value: string) => (
          <span className="tracking-wider">{value}</span>
        )
      }
    },
    {
      name: "type",
      label: "Type",
      options: {
        customBodyRender: (value: string) => (
          <span className="bg-gray-100 px-2 py-0.5 rounded text-[8px]">{value}</span>
        )
      }
    },
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
          const item = announcements[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleEdit(item)}
                className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors"
              >
                <Edit2 size={12} />
              </button>
              <button 
                onClick={() => handleDelete(value)}
                className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'multiselect' as const,
    responsive: 'standard' as const,
    selectableRows: 'none' as const,
    elevation: 0,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false,
    textLabels: {
      body: {
        noMatch: loading ? "Loading..." : "No items found",
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Announcements</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage mini banners and app alerts</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>New Entry</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title=""
            data={announcements}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Entry" : "Create Entry"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
              <input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="compact-input w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" 
                placeholder="PROMO TEXT..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase"
              >
                <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                <option value="BADGE">BADGE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Link / URL</label>
            <input 
              value={formData.link} 
              onChange={(e) => setFormData({...formData, link: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black tracking-widest" 
              placeholder="/shop..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="accent-[#7A578D]"
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Visible on site</span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default AnnouncementManagement;
