import apiClient from './index'

export default {
  fetchAll() {
    return apiClient.get('/api/hrOp')
  },
  create(data) {
    return apiClient.post('/api/hrOp', data)
  },
  update(id, data) {
    return apiClient.put(`/api/hrOp/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/api/hrOp/${id}`)
  }
}