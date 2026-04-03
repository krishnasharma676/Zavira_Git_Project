import { useState } from 'react';
import { trackPublicOrder } from '../services/orderService';

export const useTrackOrder = () => {
  const [searchBy, setSearchBy] = useState('orderId');
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await trackPublicOrder(trackingId.replace('#', ''));
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found. Please check the ID.');
    } finally {
      setLoading(false);
    }
  };

  return {
    searchBy,
    setSearchBy,
    trackingId,
    setTrackingId,
    loading,
    result,
    setResult,
    error,
    handleTrack
  };
};
