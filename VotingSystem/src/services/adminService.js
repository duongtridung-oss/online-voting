import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getUsers: async (search = '', role = '') => {
    const response = await api.get('/admin/users', { params: { search, role } });
    return response.data;
  },
  
  toggleUserLock: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-lock`);
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  getCandidates: async (search = '') => {
    const response = await api.get('/candidates', { params: { search } });
    return response.data;
  },

  createCandidate: async (data) => {
    const response = await api.post('/candidates', data);
    return response.data;
  },

  updateCandidate: async (id, data) => {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  },

  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
};
