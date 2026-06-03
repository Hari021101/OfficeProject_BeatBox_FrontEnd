import api from './authService';

const adminService = {
  // --- Analytics ---
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/Dashboard/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  // --- Users ---
  getAllUsers: async () => {
    try {
      const response = await api.get('/Account/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
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
