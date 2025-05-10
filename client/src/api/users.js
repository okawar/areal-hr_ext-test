import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/users');
  },

  fetchById(id) {
    return apiClient.get(`api/users/${id}`);
  },

  create(data) {
    return apiClient.post('api/users', data);
  },

  update(id, data) {
    return apiClient.put(`api/users/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`api/users/${id}`);
  },

  fetchForHistory() {
    return apiClient.get('api/users/for-history');
  },
};
