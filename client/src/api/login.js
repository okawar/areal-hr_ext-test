import apiClient from './index';

export default {
  login(data) {
    return apiClient.post('/api/auth/login', data);
  },
};
