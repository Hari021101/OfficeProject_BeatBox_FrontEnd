import api from './authService';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/product');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }
};
