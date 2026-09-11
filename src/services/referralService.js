import api from './authService';

export const referralService = {
  getMyCode: async () => {
    const response = await api.get('/referral/my-code');
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/referral/dashboard');
    return response.data;
  },

  validateCode: async (code) => {
    try {
      const response = await api.get(`/referral/validate/${encodeURIComponent(code)}`);
      return response.data;
    } catch (error) {
      return {
        isValid: false,
        message: error.response?.data?.message || 'Could not validate referral code.'
      };
    }
  },

  applyReferral: async (code) => {
    try {
      const response = await api.post('/referral/apply', { code });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Could not apply referral' };
    }
  },

  getEligibility: async () => {
    try {
      const response = await api.get('/referral/eligibility');
      return response.data;
    } catch (error) {
      return { isEligible: false, discountAmount: 0, message: 'Not eligible' };
    }
  }
};

export default referralService;
