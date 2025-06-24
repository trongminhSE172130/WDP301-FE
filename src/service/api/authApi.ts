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

export const registerUser = async (data: RegisterPayload) => {
  return await apiClient.post('/auth/register', data);
};

export const loginUser = async (data: LoginPayload) => {
  const res = await apiClient.post('/auth/login', data);
  if ('user' in res.data && res.data.user && res.data.token) {
    // Sử dụng SessionManager để lưu session với timeout
    SessionManager.saveSession(res.data.token, res.data.user);
  }
  return res;
};

export const logoutUser = () => {
  SessionManager.clearSession();
};
