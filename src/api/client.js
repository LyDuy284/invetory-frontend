import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  // baseURL: 'https://invetory-backend-2qkn.onrender.com/',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
};

export default api;
