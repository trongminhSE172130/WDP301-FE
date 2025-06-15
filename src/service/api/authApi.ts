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

export const getProfile = async () => {
  return await apiClient.get('/auth/profile');
};

export const updateProfile = async (data: Partial<{
  full_name: string;
  gender: string;
  dob: string;
  phone: string;
}>) => {
  return await apiClient.put('/auth/updatedetails', data);
};

export const getBlogCategories = async () => {
  return await apiClient.get('/blogs/categories');
};

export const getBlogs = async () => {
  return await apiClient.get('/blogs');
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return await apiClient.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
