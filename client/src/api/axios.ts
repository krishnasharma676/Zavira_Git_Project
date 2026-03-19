import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../store/useAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Always inject the up-to-date Bearer token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Detection to avoid infinite refresh loops
    const isRefreshRequest = originalRequest.url?.includes('auth/refresh-token');
    const hasToken = !!localStorage.getItem('token');

    // 1. Handle 401 Unauthorized (Expired Tokens)
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && hasToken) {
      
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        const { accessToken } = response.data.data;
        
        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh token failed -> Force Logout and back to Login
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        useAuth.getState().logout?.();
        useUIStore.getState().openAuthModal?.('login');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 2. Clear token on fatal 401 (Refresh failed or double retry)
    if (error.response?.status === 401 && (originalRequest._retry || isRefreshRequest)) {
       localStorage.removeItem('token');
       useAuth.getState().logout?.();
    }

    return Promise.reject(error);
  }
);

export default api;
