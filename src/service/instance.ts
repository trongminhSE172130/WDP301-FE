import axios from 'axios';
import { SessionManager } from '../utils/sessionManager';

const apiClient = axios.create({
  baseURL: 'https://genhealth.wizlab.io.vn/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag để tránh infinite loop khi refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor cho request - sử dụng SessionManager
apiClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      // Kiểm tra nếu đây là request đăng nhập/đăng ký thì bỏ qua check session
      const isAuthRequest = config.url?.includes('/auth/login') || 
                           config.url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        // Chỉ kiểm tra session với các API khác (không phải auth)
        if (SessionManager.isSessionValid()) {
          const token = SessionManager.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          // Session không hợp lệ, clear và reject
          SessionManager.clearSession();
          return Promise.reject(new Error('Session expired'));
        }
      }
      // Với auth requests, vẫn thêm token nếu có (cho trường hợp refresh token)
      else {
        const token = SessionManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor cho response - xử lý auto-logout và refresh token
apiClient.interceptors.response.use(
  response => {
    // Gia hạn session khi có response thành công
    SessionManager.extendSession();
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshTokenValue = SessionManager.getRefreshToken();
      
      if (refreshTokenValue) {
        try {
          // Gọi API refresh token
          const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshTokenValue
          });

          if (response.data.success && response.data.token) {
            const { token, refresh_token: newRefreshToken } = response.data;
            const userInfo = SessionManager.getUserInfo();
            
            if (userInfo) {
              // Cập nhật session với token mới
              SessionManager.saveSession(token, userInfo, newRefreshToken);
              
              // Cập nhật header và retry request
              originalRequest.headers.Authorization = `Bearer ${token}`;
              
              processQueue(null, token);
              
              return apiClient(originalRequest);
            }
          }
                 } catch (refreshError) {
           console.error('Refresh token failed:', refreshError);
           processQueue(refreshError instanceof Error ? refreshError : new Error('Refresh failed'), null);
         }
      }

      // Nếu refresh thất bại hoặc không có refresh token
      isRefreshing = false;
      SessionManager.clearSession();
      
      // Kiểm tra current path để redirect đúng
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/consultant')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }

    isRefreshing = false;
    return Promise.reject(error);
  }
);

export default apiClient;
