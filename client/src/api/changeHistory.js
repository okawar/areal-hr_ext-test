import apiClient from './index'

export default {
  getAll() {
    return apiClient.get('/api/changeHistory')
  }
}