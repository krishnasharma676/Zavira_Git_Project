import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/orderService';

export const useOrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const timeline = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentIndex = order ? timeline.indexOf(order.status) : -1;

  return { order, loading, timeline, currentIndex };
};
