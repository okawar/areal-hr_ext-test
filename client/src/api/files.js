import apiClient from './index'

export default {
  fetchAll() {
    return apiClient.get('/api/file')
  },
  create(data) {
    return apiClient.post('/api/file', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  ,
  update(id, data) {
    return apiClient.put(`/api/file/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/api/file/${id}`)
  },
  download(id) {
    return apiClient.get(`/api/file/${id}/download`, { responseType: 'blob' })
  }
}