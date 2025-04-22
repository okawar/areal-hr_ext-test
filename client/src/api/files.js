import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/file');
  },

  create(data) {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];

      if (value === null || value === undefined) return;

      if (key === 'file' && value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, String(value));
      }
    });

    return apiClient.post('/api/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update(id, data) {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];

      if (value === null || value === undefined) return;

      if (key === 'file' && value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, String(value));
      }
    });

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
