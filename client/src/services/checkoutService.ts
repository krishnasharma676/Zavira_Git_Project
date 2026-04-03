import api from '../api/axios';

export const getCheckoutSuggestions = async () => {
  const { data } = await api.get('/products', { params: { limit: 4 } });
  return data.data.products;
};

export const createAddress = async (addressData: any) => {
  const { data } = await api.post('/addresses', addressData);
  return data.data;
};

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders/checkout', orderData);
  return data.data;
};
