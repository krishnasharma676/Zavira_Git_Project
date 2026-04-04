
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useTestimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const { data } = await api.get('/testimonials/admin/all');
      setTestimonials(data.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
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

  return {
    isModalOpen,
    setIsModalOpen,
    testimonials,
    editingItem,
    isSubmitting,
    loading,
    imagePreview,
    formData,
    setFormData,
    handleEdit,
    handleDelete,
    handleImageChange,
    handleSubmit,
    resetForm,
    setImageFile,
    setImagePreview,
    fetchData,
  };
};
