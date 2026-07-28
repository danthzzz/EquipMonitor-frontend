import api from './api';

export const deviceService = {
  getDevices: async ({ customerId } = {}) => {
    const response = await api.get('/devices', { params: { customerId } });
    return response.data;
  },

  getDeviceById: async (id) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  createDevice: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },

  updateDevice: async (id, deviceData) => {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  },

  deleteDevice: async (id) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  }
};
