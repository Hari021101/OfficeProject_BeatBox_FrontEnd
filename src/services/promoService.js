import api from './authService';

export const validatePromoCode = async (code) => {
    try {
        const response = await api.post('/promo/validate', { code });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Invalid promo code');
        }
        throw new Error('Failed to validate promo code');
    }
};
