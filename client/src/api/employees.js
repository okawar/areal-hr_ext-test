import apiClient from './index';

export default {
  fetchAll() {
    return apiClient.get('/api/emp');
  },
  
  create(data) {
    const formData = new FormData();
    
    // Обрабатываем все поля, включая файлы
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined) return;
      
      // Особый случай для файлов
      if (key === 'file' && data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      } 
      // Числовые поля преобразуем в строку
      else if (['department_id', 'position_id', 'salary'].includes(key)) {
        formData.append(key, String(data[key]));
      }
      // Для остальных полей
      else {
        formData.append(key, data[key]);
      }
    });
    
    return apiClient.post('/api/emp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update(id, data) {
    const formData = new FormData();
    
    // Аналогичная обработка как в create
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined) return;
      
      if (key === 'file' && data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      }
      else if (['department_id', 'position_id', 'salary'].includes(key)) {
        formData.append(key, String(data[key]));
      }
      else {
        formData.append(key, data[key]);
      }
    });
    
    return apiClient.put(`/api/emp/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete(id) {
    return apiClient.delete(`/api/emp/${id}`);
  },
};