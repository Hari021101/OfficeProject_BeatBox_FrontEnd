import api from './authService';

export const orderService = {
  checkout: async (orderData) => {
    const response = await api.post('/checkout', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/order/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(`/order/cancel/${id}`);
    return response.data;
  },

  // Admin Endpoints
  getAllOrders: async () => {
    const response = await api.get('/order');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/order/status/${id}`, { status });
    return response.data;
  }
};
