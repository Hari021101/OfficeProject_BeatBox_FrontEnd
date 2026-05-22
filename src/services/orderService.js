import api from './authService';

export const orderService = {
  checkout: async (shippingAddress) => {
    const response = await api.post('/checkout', { shippingAddress });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/order/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  }
};
