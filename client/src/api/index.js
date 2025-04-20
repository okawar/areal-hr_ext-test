import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  responseEncoding: 'utf8'
});

export default apiClient;