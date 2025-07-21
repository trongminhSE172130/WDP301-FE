import apiClient from '../instance';

// Interfaces cho User API
export interface UserStatistics {
  total_bookings: number;
  active_subscriptions: number;
}

export interface PushNotificationSettings {
  booking_reminders: boolean;
  subscription_alerts: boolean;
  reproductive_tracking: boolean;
  blog_updates: boolean;
  consultation_updates: boolean;
}

export interface ApiUser {
  _id: string;
  role: 'user' | 'consultant' | 'admin';
  full_name: string;
  email: string;
  gender?: 'male' | 'female';
  dob?: string;
  phone?: string;
  fcm_tokens?: string[];
  push_notification_settings?: PushNotificationSettings;
  created_at: string;
  updated_at: string;
  __v: number;
  statistics: UserStatistics;
  // Consultant specific fields
  degree?: string;
  specialty?: string;
  experience_years?: number;
  is_available_for_advice?: boolean;
  is_available_for_analysis?: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetUsersResponse {
  success: boolean;
  data: ApiUser[];
  pagination: Pagination;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  status?: string;
}

// Lấy danh sách tất cả users với pagination
export const getAllUsers = async (params?: GetUsersParams): Promise<GetUsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiClient.get(`/admin/users?${queryParams.toString()}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Xóa user theo ID
export const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Lấy chi tiết user theo ID
export const getUserById = async (userId: string): Promise<{ success: boolean; data: ApiUser }> => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// // Cập nhật user
// export const updateUser = async (userId: string, userData: Partial<ApiUser>): Promise<{ success: boolean; data: ApiUser }> => {
//   try {
//     const response = await apiClient.put(`/admin/users/${userId}`, userData);
//     return response.data;
//   } catch (error: unknown) {
//     console.error('Error updating user:', error);
//     throw error;
//   }
// };
