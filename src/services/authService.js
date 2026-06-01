import axios from 'axios';

const API_URL = 'https://localhost:7142/api';

// Create a configured Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to authorization header on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to automatically log out if token is invalid (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, clear it out
      localStorage.removeItem('bb_token');
      localStorage.removeItem('bb_user');
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (fullName, identifier, password) => {
    const response = await api.post('/account/register', {
      fullName,
      identifier,
      password,
    });
    return response.data; // Returns RegisterResponseDto
  },

  login: async (identifier, password) => {
    const response = await api.post('/account/login', {
      identifier,
      password,
    });
    // Store user data in localStorage if token returned
    if (response.data.token) {
      localStorage.setItem('bb_token', response.data.token);
      localStorage.setItem('bb_user', JSON.stringify({
        fullName: response.data.fullName,
        email: response.data.email,
      }));
    }
    return response.data; // Returns AuthResponseDto
  },

  logout: () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('bb_user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('bb_token');
  },
};

export default api;
