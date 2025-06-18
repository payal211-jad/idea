import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const publicRoutes = ['/login', '/register'];

api.interceptors.request.use(config => {
  if (publicRoutes.some(route => config.url.includes(route))) {
    return config;
  }

  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token being used:', token);
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Request headers:', config.headers);
  } else {
    console.warn('No token found - user might need to login');
    if (!window.location.pathname.includes('login')) {
      window.location.href = '/login';
      return Promise.reject('No authentication token');
    }
  }
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Don't redirect if already on login page
    if (window.location.pathname.includes('login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error(' Authentication error:', error.response?.status);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;