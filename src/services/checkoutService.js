import api from './authService'

export const checkoutService = {
  checkout: async ({ shippingAddress, paymentMethod, paymentDetails }) => {
    const response = await api.post('/checkout', {
      shippingAddress,
      paymentMethod,
      paymentDetails,
    })
    return response.data
  },
}
