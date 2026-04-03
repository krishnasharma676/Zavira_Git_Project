import api from '../api/axios';

export const getProductBySlug = async (slug: string) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};

export const getSimilarProducts = async (categoryId: string, currentProductId: string, limit: number = 20) => {
  const { data } = await api.get('/products', { 
    params: { category: categoryId, limit } 
  });
  return data.data.products.filter((p: any) => p.id !== currentProductId);
};

export const submitProductReview = async (productId: string, formData: FormData) => {
  const { data } = await api.post(`/reviews/product/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};
