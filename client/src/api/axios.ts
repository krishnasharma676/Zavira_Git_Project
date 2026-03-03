import axios from 'axios';
import { useLoading } from '../store/useLoading';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../store/useAuth';

let requestCount = 0;

const startInternalLoading = () => {
  if (requestCount === 0) {
    useLoading.getState().startLoading();
  }
  requestCount++;
};

const stopInternalLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    useLoading.getState().stopLoading();
  }
};


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Interceptor for adding token to requests
api.interceptors.request.use((config) => {
  startInternalLoading();
  const token = localStorage.getItem('token');
  // Only inject the stored JWT when the caller hasn't already set an Authorization header.
  // (Firebase sync passes its own ID token — we must not overwrite it.)
  if (token && !config.headers['Authorization']) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  stopInternalLoading();
  return Promise.reject(error);
});

// Interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    stopInternalLoading();
    return response;
  },
  async (error) => {
    stopInternalLoading();
    const originalRequest = error.config;
    
    // Handle 401 and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Use a separate axios instance or direct call to avoid interceptor loop if needed, 
        // but here 'api' is fine as long as _retry is set.
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data.data;
        
        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear stored token + auth state
        localStorage.removeItem('token');
        useAuth.getState().logout?.();
        // Open login modal instead of redirecting to /login
        useUIStore.getState().openAuthModal('login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
