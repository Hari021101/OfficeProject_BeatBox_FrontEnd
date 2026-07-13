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
    const response = await api.get('/admin/dashboard/sales');
    return response.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get('/admin/dashboard/products');
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

  // --- Inventory ---
  updateStock: async (productId, quantity, type, reason) => {
    try {
      const response = await api.put('/Inventory/update-stock', {
        productId,
        quantity,
        type,
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
  },

  // --- Audit Logs ---
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/auditlogs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // --- User Modifications ---
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/account/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  lockUser: async (userId, lockUser) => {
    try {
      const response = await api.put(`/account/users/${userId}/lock`, { lockUser });
      return response.data;
    } catch (error) {
      console.error('Error locking user:', error);
      throw error;
    }
  },

  // --- Returns ---
  getAllReturns: async () => {
    try {
      const response = await api.get('/Return');
      return response.data;
    } catch (error) {
      console.error('Error fetching returns:', error);
      throw error;
    }
  },

  updateReturnStatus: async (id, status, adminNotes) => {
    try {
      const response = await api.put(`/Return/${id}/status`, { status, adminNotes });
      return response.data;
    } catch (error) {
      console.error('Error updating return status:', error);
      throw error;
    }
  },

  // --- Coupon Admin CRUD ---
  getAllCoupons: async () => {
    try {
      const response = await api.get('/Coupon/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  getCouponStats: async () => {
    try {
      const response = await api.get('/Coupon/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
      throw error;
    }
  },

  createCoupon: async (dto) => {
    try {
      const response = await api.post('/Coupon', dto);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create coupon';
      throw new Error(message, { cause: error });
    }
  },

  updateCoupon: async (id, dto) => {
    try {
      const response = await api.put(`/Coupon/${id}`, dto);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update coupon';
      throw new Error(message, { cause: error });
    }
  },

  deleteCoupon: async (id) => {
    try {
      await api.delete(`/Coupon/${id}`);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  toggleCoupon: async (id) => {
    try {
      const response = await api.patch(`/Coupon/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling coupon:', error);
      throw error;
    }
  },
};

export default adminService;
