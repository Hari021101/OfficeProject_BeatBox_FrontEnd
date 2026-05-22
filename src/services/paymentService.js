import api from './authService'

export const paymentService = {
  processPayment: async ({ orderId, amount, method, transactionId }) => {
    const response = await api.post('/payment/process', {
      orderId,
      amount,
      method,
      transactionId,
    })
    return response.data
  },

  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/payment/${orderId}`)
    return response.data
  },
}
