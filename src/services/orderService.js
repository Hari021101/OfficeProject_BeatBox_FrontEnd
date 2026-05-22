import api from './authService'

export const orderService = {
  createOrder: async (orderPayload) => {
    const response = await api.post('/order', orderPayload)
    return response.data
  },

  getMyOrders: async () => {
    const response = await api.get('/order/my-orders')
    return response.data
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/order/${orderId}`)
    return response.data
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(`/order/cancel/${orderId}`)
    return response.data
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/order/status/${orderId}`, { status })
    return response.data
  },
}
