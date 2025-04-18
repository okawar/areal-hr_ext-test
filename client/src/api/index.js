import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL + ':' + import.meta.env.VITE_APP_PORT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
