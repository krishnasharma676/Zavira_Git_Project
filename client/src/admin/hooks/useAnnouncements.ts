
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'ANNOUNCEMENT',
    link: '',
    isActive: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/all');
      const filtered = res.data.data.filter((b: any) => b.type === 'ANNOUNCEMENT' || b.type === 'BADGE');
      setAnnouncements(filtered);
      setFilteredAnnouncements(filtered);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = announcements.filter(
      (a) =>
        a.title?.toLowerCase().includes(term) ||
        a.id?.toLowerCase().includes(term) ||
        a.subtitle?.toLowerCase().includes(term)
    );
    setFilteredAnnouncements(filtered);
  }, [search, announcements]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      type: item.type || 'ANNOUNCEMENT',
      link: item.link || '',
      isActive: item.isActive,
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

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      type: 'ANNOUNCEMENT',
      link: '',
      isActive: true,
    });
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

  return {
    announcements,
    filteredAnnouncements,
    loading,
    isSubmitting,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    formData,
    setFormData,
    fetchData,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
  };
};
