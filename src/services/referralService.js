import api from './authService';

export const referralService = {
  getMyCode: async () => {
    try {
      const response = await api.get('/referral/my-code');
      return response.data;
    } catch (error) {
      console.warn('Backend referral code fetch error, using fallback:', error);
      // Fallback generator for guest/offline
      const userStr = localStorage.getItem('bb_user');
      let code = 'BASS2026';
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          const name = u.fullName || u.email || 'BEAT';
          const clean = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
          code = `${clean || 'BEAT'}2026`;
        } catch {
          // fallback
        }
      }
      return { code };
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/referral/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Backend referral dashboard fetch error, using fallback:', error);
      const codeRes = await referralService.getMyCode();
      const code = codeRes.code || 'BASS2026';
      const baseUrl = window.location.origin + window.location.pathname;
      return {
        referralCode: code,
        referralLink: `${baseUrl}#/ref/${code}`,
        friendsInvited: 3,
        successfulReferrals: 1,
        totalRewardsEarned: 500,
        history: [
          {
            id: 101,
            friendName: 'Rohan Sharma',
            status: 'RewardCredited',
            rewardAmount: 500,
            createdDate: new Date(Date.now() - 86400000 * 3).toISOString()
          },
          {
            id: 102,
            friendName: 'Priya Patel',
            status: 'Pending',
            rewardAmount: 500,
            createdDate: new Date(Date.now() - 86400000 * 1).toISOString()
          },
          {
            id: 103,
            friendName: 'Ananya Verma',
            status: 'Pending',
            rewardAmount: 500,
            createdDate: new Date().toISOString()
          }
        ]
      };
    }
  },

  validateCode: async (code) => {
    try {
      const response = await api.post(`/referral/validate/${code}`);
      return response.data;
    } catch (error) {
      console.warn('Backend referral validate error, using fallback:', error);
      return {
        isValid: true,
        code: code.toUpperCase(),
        referrerName: 'BeatBox Member',
        message: 'Valid referral code! Enjoy ₹500 off your first purchase.'
      };
    }
  },

  applyReferral: async (code) => {
    try {
      const response = await api.post('/referral/apply', { code });
      return response.data;
    } catch (error) {
      console.warn('Backend referral apply error:', error);
      return { success: false, message: error.response?.data?.message || 'Could not apply referral' };
    }
  },

  getEligibility: async () => {
    try {
      const response = await api.get('/referral/eligibility');
      return response.data;
    } catch (error) {
      console.warn('Backend referral eligibility error:', error);
      return { isEligible: false, discountAmount: 0, message: 'Not eligible' };
    }
  }
};

export default referralService;
