import apiClient from '../instance';
import { SessionManager } from '../../utils/sessionManager';

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  password: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refresh_token: string;
  user: {
    id: string;
    role: string;
    full_name: string;
    email: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refresh_token: string;
}

export const registerUser = async (data: RegisterPayload) => {
  return await apiClient.post('/auth/register', data);
};

export const loginUser = async (data: LoginPayload) => {
  const res = await apiClient.post<LoginResponse>('/auth/login', data);
  
  // Xử lý response theo structure mới từ backend
  if (res.data.success && res.data.token && res.data.user) {
    // Sử dụng SessionManager để lưu session với refresh_token
    SessionManager.saveSession(res.data.token, res.data.user, res.data.refresh_token);
  }
  
  return res;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = SessionManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const res = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refresh_token: refreshToken
  });
  
  return res.data;
};

export const logoutUser = () => {
  SessionManager.clearSession();
};
