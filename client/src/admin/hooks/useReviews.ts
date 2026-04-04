
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reviews/admin/all');
      setReviews(data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchReviews();
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/reviews/admin/${id}/approve`);
      toast.success('Approved');
      fetchReviews();
    } catch (error) {
      toast.error('Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success('Deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed');
    }
  };

  return {
    reviews,
    loading,
    fetchReviews,
    handleApprove,
    handleDelete,
  };
};
