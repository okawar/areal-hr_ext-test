import apiClient from './index';

function toFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === 'file' && value instanceof File) {
      formData.append('file', value, value.name);
      if (!data.file_name) {
        formData.append('file_name', value.name);
      }
      if (!data.file_path) {
        formData.append('file_path', value.name);
      }
    } else {
      formData.append(key, value !== null ? String(value) : '');
    }
  });

  return formData;
}

export default {
  fetchAll() {
    return apiClient.get('/api/file');
  },

  create(data) {
    return apiClient.post('/api/file', toFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update(id, data) {
    return apiClient.put(`/api/file/${id}`, toFormData(data), {
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
      responseType: 'blob',
    });
  },
};
