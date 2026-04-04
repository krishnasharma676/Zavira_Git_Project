
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

export const useCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { categories, refreshMetadata } = useAdminStore();
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
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = (categories || []).filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

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

  const sortByLatest = () => {
    const sorted = [...filteredCategories].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setFilteredCategories(sorted);
    toast.success('Sorted by Enrollment');
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

  return {
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    filteredCategories,
    setFilteredCategories,
    isSubmitting,
    loading,
    search,
    setSearch,
    name,
    setName,
    isActive,
    setIsActive,
    imageUrl,
    setImageUrl,
    previewUrl,
    setPreviewUrl,
    fetchCategories,
    handleEdit,
    handleAddNew,
    handleDelete,
    sortByLatest,
    handleImageChange,
    handleSubmit,
  };
};
