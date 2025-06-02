import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://genhealth.wizlab.io.vn/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request
apiClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor cho response
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Xử lý khi token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login'; // Hoặc dùng navigate nếu ở React Router
    }
    return Promise.reject(error);
  }
);

export default apiClient;
