import apiClient from './index'

export default {
  fetchAll() {
    return apiClient.get('/api/file')
  },
  create(data) {
    return apiClient.post('/api/file', data)
  },
  update(id, data) {
    return apiClient.put(`/api/file/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/api/file/${id}`)
  }
}