import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/pos');
  },
  create(data) {
    return apiClient.post('/api/pos', data);
  },
  update(id, data) {
    return apiClient.put(`/api/pos/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/api/pos/${id}`);
  },
};
