import api from './api';

export const pollService = {
  getPolls: async (search = '', status = 'all') => {
    const params = {};
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    const response = await api.get('/polls', { params });
    return response.data;
  },

  getPoll: async (id) => {
    const response = await api.get(`/polls/${id}`);
    return response.data;
  },

  createPoll: async (data) => {
    const response = await api.post('/polls', data);
    return response.data;
  },

  updatePoll: async (id, data) => {
    const response = await api.put(`/polls/${id}`, data);
    return response.data;
  },

  deletePoll: async (id) => {
    const response = await api.delete(`/polls/${id}`);
    return response.data;
  },

  closePoll: async (id) => {
    const response = await api.patch(`/polls/${id}/close`);
    return response.data;
  },

  reopenPoll: async (id) => {
    const response = await api.patch(`/polls/${id}/reopen`);
    return response.data;
  },

  vote: async (id, optionId) => {
    const response = await api.post(`/polls/${id}/vote`, { option_id: optionId });
    return response.data;
  },

  getResults: async (id) => {
    const response = await api.get(`/polls/${id}/results`);
    return response.data;
  }
};
