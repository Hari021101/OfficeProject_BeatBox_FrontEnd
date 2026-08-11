import api from './authService';

export const validatePromoCode = async (code, cartTotal = 0) => {
    try {
        const response = await api.post('/promo/validate', { 
            code: code ? code.trim() : '', 
            cartTotal: Number(cartTotal) || 0 
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            const msg = error.response.data.message || error.response.data.Message || 'Invalid promo code';
            throw new Error(msg, { cause: error });
        }
        throw new Error('Failed to validate promo code', { cause: error });
    }
};
