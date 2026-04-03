import api from '../api/axios';

export const getOrderById = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

export const trackPublicOrder = async (trackingId: string) => {
  const { data } = await api.get(`/orders/public/track/${trackingId}`);
  return data.data;
};
