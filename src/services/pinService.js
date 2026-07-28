import api from './api';

export const pinService = {
  getPins: async (params = {}) => {
    const response = await api.get('/pins', { params });
    return response.data;
  },

  getPinById: async (id) => {
    const response = await api.get(`/pins/${id}`);
    return response.data;
  },

  createPin: async (pinData) => {
    const response = await api.post('/pins', pinData);
    return response.data;
  },

  updatePin: async (id, pinData) => {
    const response = await api.put(`/pins/${id}`, pinData);
    return response.data;
  },

  deletePin: async (id) => {
    const response = await api.delete(`/pins/${id}`);
    return response.data;
  }
};
