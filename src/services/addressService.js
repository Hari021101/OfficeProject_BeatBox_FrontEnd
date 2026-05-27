import api from './authService';

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/address');
    return response.data;
  },

  getAddressById: async (id) => {
    const response = await api.get(`/address/${id}`);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/address', addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await api.put(`/address/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/address/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id) => {
    const response = await api.put(`/address/${id}/default`);
    return response.data;
  }
};
