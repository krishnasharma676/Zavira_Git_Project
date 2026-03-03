import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

import OrderHeader from '../components/order/OrderHeader';
import OrderStats from '../components/order/OrderStats';
import OrderLogisticSummary from '../components/order/OrderLogisticSummary';
import OrderActions from '../components/order/OrderActions';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
      <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#0A0A0A] pt-[170px] pb-20 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <OrderHeader orderNumber={order?.orderNumber} />
          <OrderStats />
          <OrderLogisticSummary order={order} />
          <OrderActions />
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

