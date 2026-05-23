import axios from 'axios';

// Base URL for all API calls
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Before every request, automatically attach the JWT token if it exists
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('myshop_user');
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;