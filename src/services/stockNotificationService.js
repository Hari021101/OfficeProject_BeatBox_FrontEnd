import api from './authService';

export const stockNotificationService = {
  async subscribe(productId, variantId) {
    const response = await api.post('/StockNotifications/subscribe', {
      productId,
      variantId
    });
    return response.data;
  },

  async unsubscribe(variantId) {
    const response = await api.delete(`/StockNotifications/unsubscribe/${variantId}`);
    return response.data;
  },

  async getStatus(variantId) {
    if (!variantId) return { isSubscribed: false };
    const response = await api.get(`/StockNotifications/status/${variantId}`);
    return response.data;
  }
};

export default stockNotificationService;
