import apiClient from './index';
export default {
  fetchAll() {
    return apiClient.get('/api/emp');
  },
 
  create(data) {
    return apiClient.post('/api/emp', data);
  },
 
  update(id, data) {
    return apiClient.put(`/api/emp/${id}`, data);
  },
 
  delete(id) {
    return apiClient.delete(`/api/emp/${id}`);
  },
};