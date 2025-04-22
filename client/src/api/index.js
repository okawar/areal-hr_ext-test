import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}:${import.meta.env.VITE_APP_PORT}`, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  responseEncoding: 'utf8'
});

export default apiClient;