import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/dept');
  },
  create(data) {
    return apiClient.post('/api/dept', data);
  },
  update(id, data) {
    return apiClient.put(`/api/dept/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/api/dept/${id}`);
  },
};
