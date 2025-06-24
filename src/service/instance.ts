import axios from 'axios';
import { SessionManager } from '../utils/sessionManager';

const apiClient = axios.create({
  baseURL: 'https://genhealth.wizlab.io.vn/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Interceptor cho response - xử lý auto-logout
apiClient.interceptors.response.use(
  response => {
    // Gia hạn session khi có response thành công
    SessionManager.extendSession();
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized - Token hết hạn hoặc không hợp lệ');
      
      // Xóa session và redirect
      SessionManager.clearSession();
      
      // Kiểm tra current path để redirect đúng
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/consultant')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
