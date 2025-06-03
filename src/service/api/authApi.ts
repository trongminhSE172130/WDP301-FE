import apiClient from '../instance';

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
  if ('user' in res.data && res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
