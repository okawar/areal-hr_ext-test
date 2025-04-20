import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/file');
  },
  
  create(data) {
    const formData = new FormData();
    formData.append('file', data.file);
    
    return apiClient.post('/api/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update(id, data) {
    const formData = new FormData();
    formData.append('file', data.file);
    
    return apiClient.put(`/api/file/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete(id) {
    return apiClient.delete(`/api/file/${id}`);
  },
  
  download(id) {
    return apiClient.get(`/api/file/${id}/download`, { 
      responseType: 'blob' 
    });
  },
};