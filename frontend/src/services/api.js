import axios from 'axios';

const API_URL = 'https://task-management-system-backend-crp6.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;

});


export default api;