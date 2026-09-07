import api from './authService';

export const referralService = {
  getMyCode: async () => {
    const response = await api.get('/referral/my-code');
    return response.data;
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/referral/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Backend referral dashboard error:', error);
      return {
        referralCode: '',
        referralLink: '',
        friendsInvited: 0,
        successfulReferrals: 0,
        couponsEarned: 0,
        history: []
      };
    }
  },

  validateCode: async (code) => {
    try {
      const response = await api.post(`/referral/validate/${code}`);
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
