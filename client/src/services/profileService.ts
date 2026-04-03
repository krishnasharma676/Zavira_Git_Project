import api from '../api/axios';

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my-orders');
  return data.data;
};

export const getMyAddresses = async () => {
  const { data } = await api.get('/addresses');
  return data.data;
};

export const deleteAddress = async (id: string) => {
  await api.delete(`/addresses/${id}`);
};

export const updateDefaultAddress = async (id: string) => {
  await api.patch(`/addresses/${id}/default`);
};

export const addAddress = async (addressData: any) => {
  const { data } = await api.post('/addresses', addressData);
  return data.data;
};

export const requestOrderReturn = async (orderId: string, formData: FormData) => {
  const { data } = await api.post(`/orders/${orderId}/return`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};
