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
  },
  
  bulkUpdateOrderStatus: async (orderIds, status) => {
    const response = await api.post('/order/bulk-status', { orderIds, status });
    return response.data;
  },

  bulkDeleteOrders: async (orderIds) => {
    const response = await api.post('/order/bulk-delete', orderIds);
    return response.data;
  },
  
  downloadInvoice: async (orderId) => {
    const response = await api.get(
      `/order/${orderId}/invoice`,
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // ── Return Requests ────────────────────────────────────────────────────────

  /** Customer: check if a return request already exists for an order */
  getReturnByOrderId: async (orderId) => {
    const response = await api.get(`/Return/order/${orderId}`);
    return response.data; // null if none exists
  },

  /** Customer: submit a new return request */
  requestReturn: async (dto) => {
    const response = await api.post('/Return', dto);
    return response.data;
  },
};
