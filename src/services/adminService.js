import api from './authService';

const adminService = {
  // --- Analytics ---
  getDashboardAnalytics: async () => {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },

  getRevenueChart: async () => {
    const response = await api.get(
      `/admin/dashboard/revenue?year=${new Date().getFullYear()}`
    );
    return response.data;
  },

  getSalesChart: async () => {
    const response = await api.get(
      '/admin/dashboard/sales'
    );
    return response.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get(
      '/admin/dashboard/products'
    );
    return response.data;
  },

  // --- Users ---
  getAllUsers: async () => {
    try {
      const response = await api.get('/account/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/account/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  toggleUserRole: async (userId) => {
    try {
      const response = await api.put(`/account/${userId}/toggle-role`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user role:', error);
      throw error;
    }
  },

  // --- Inventory ---
  updateStock: async (productId, quantity, type, reason) => {
    try {
      const response = await api.put('/Inventory/update-stock', {
        productId,
        quantity,
        type, // e.g., 'restock', 'correction'
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  getLowStock: async () => {
    try {
      const response = await api.get('/Inventory/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock:', error);
      throw error;
    }
  }
};

export default adminService;
