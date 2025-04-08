import apiClient from './index'

export default {
  fetchAll() {
    return apiClient.get('/api/orgs')
  },
  create(data) {
    return apiClient.post('/api/orgs', data)
  },
  update(id, data) {
    return apiClient.put(`/api/orgs/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/api/orgs/${id}`)
  }
}