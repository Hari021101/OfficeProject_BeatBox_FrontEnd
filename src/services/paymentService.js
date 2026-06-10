import api from './authService';

export const paymentService = {

  createRazorpayOrder(orderId, amount) {
    return api.post('/razorpay/create-order', {
      orderId,
      amount
    })
  },

  processPayment(data) {
    return api.post('/payment/process', data)
  }
}