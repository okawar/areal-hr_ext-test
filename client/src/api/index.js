import axios from 'axios';

const getBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV === true;
  
  if (isDevelopment && import.meta.env.VITE_API_BASE_URL_LOCAL) {
    return import.meta.env.VITE_API_BASE_URL_LOCAL;
  }
  
  return import.meta.env.VITE_API_BASE_URL || '/';
};

const apiClient = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_URL}:${import.meta.env.VITE_APP_PORT_SERVER}`,
  baseURL: getBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  responseType: 'json',
  responseEncoding: 'utf8',
});



export default apiClient;
