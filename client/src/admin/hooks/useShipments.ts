
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useShipments = () => {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<any[]>([]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      // In this system, shipments are orders with shipmentId
      const { data: res } = await api.get('/orders/admin/all', { params: { limit: 100 } });
      const allOrders = res.data.orders;

      // Filter for orders that have a shipment ID or AWB
      const shippedOrders = allOrders.filter(
        (order: any) => order.shipmentId || order.awbNumber
      );
      setShipments(shippedOrders);
    } catch (error) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchShipments();
    }
  }, []);

  return {
    loading,
    shipments,
    fetchShipments,
  };
};
