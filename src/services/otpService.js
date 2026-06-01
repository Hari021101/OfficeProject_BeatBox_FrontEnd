import api from './authService';

export const otpService = {
  // Resend email OTP (if user didn't receive it)
  sendEmailOtp: async (userId) => {
    const response = await api.post('/otp/send-email', { userId, phoneNumber: '' });
    return response.data;
  },

  // Verify the 6-digit email OTP
  verifyEmailOtp: async (userId, code) => {
    const response = await api.post('/otp/verify-email', { userId, code });
    return response.data;
  },

  // Send phone OTP (pass userId + phoneNumber)
  sendPhoneOtp: async (userId, phoneNumber) => {
    const response = await api.post('/otp/send-phone', { userId, phoneNumber });
    return response.data;
  },

  // Verify the 6-digit phone OTP — returns JWT on success
  verifyPhoneOtp: async (userId, code) => {
    const response = await api.post('/otp/verify-phone', { userId, code });
    return response.data; // AuthResponseDto { fullName, email, token }
  },
};
