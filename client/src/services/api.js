import axios from 'axios';
import { auth } from '../firebase';

// Waits for Firebase to restore auth state before resolving
const waitForAuth = () => {
  return new Promise((resolve) => {
    if (auth.currentUser !== null) {
      return resolve(auth.currentUser);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use(async (config) => {
  const user = await waitForAuth();
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized:', error.response.data?.message);
    }
    if (error.response?.status === 500) {
      console.error('500 Server error:', error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

export default api;