
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

export const useColors = () => {
  const { colors, fetchColors, refreshColors } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hexCode: '#000000' });

  const handleFetchColors = async () => {
    setLoading(true);
    try {
      await fetchColors();
    } catch (error) {
      toast.error('Failed to fetch colors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchColors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post('/colors', newColor);
      toast.success('Color saved to repository');
      setNewColor({ name: '', hexCode: '#000000' });
      await refreshColors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save color');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This will only succeed if the color is not in use.')) return;
    try {
      await api.delete(`/colors/${id}`);
      toast.success('Color removed');
      await refreshColors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete color');
    }
  };

  return {
    colors,
    loading,
    isSubmitting,
    newColor,
    setNewColor,
    refreshColors,
    handleCreate,
    handleDelete,
  };
};
