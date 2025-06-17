import apiClient from '../instance';

export interface BroadcastNotificationRequest {
  role: string;
  title: string;
  body: string;
  data: string;
}

// Interface cho việc gửi notification cho user cụ thể
export interface SendToUserNotificationRequest {
  user_id: string;
  title: string;
  body: string;
  data: string;
}

export interface BroadcastNotificationResponse {
  success: boolean;
  message: string;
  data?: {
    sentCount: number;
    failedCount: number;
    totalUsers: number;
  };
}

// Interface cho response gửi notification cho user cụ thể
export interface SendToUserNotificationResponse {
  success: boolean;
  message: string;
  data?: {
    sent: boolean;
    user_info: {
      _id: string;
      full_name: string;
      email: string;
    };
  };
}

// Interface cho user item trong danh sách - cập nhật theo data thực tế
export interface UserItem {
  _id: string;
  full_name: string;
  email: string;
  role: string;
  gender?: string;
  dob?: string;
  phone?: string;
  fcm_tokens?: string[];
  push_notification_settings?: {
    booking_reminders: boolean;
    subscription_alerts: boolean;
    reproductive_tracking: boolean;
    blog_updates: boolean;
    consultation_updates: boolean;
  };
  created_at: string;
  updated_at: string;
  __v: number;
  // Fields cho consultant
  degree?: string;
  specialty?: string;
  experience_years?: number;
  is_available_for_advice?: boolean;
  is_available_for_analysis?: boolean;
  statistics?: {
    total_bookings: number;
    active_subscriptions: number;
  };
}

// Interface cho response lấy danh sách users - cập nhật theo structure thực tế
export interface GetUsersResponse {
  success: boolean;
  data: UserItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Interface cho notification item
export interface NotificationItem {
  _id: string;
  target_info: {
    role?: string;
    user_id?: {
      _id: string;
      full_name: string;
      email: string;
    };
  };
  notification: {
    title: string;
    body: string;
  };
  result: {
    success_count: number;
    failure_count: number;
    total_tokens: number;
    invalid_tokens_removed: number;
  };
  metadata: {
    device_count: number;
    platform: string;
  };
  sent_by: {
    _id: string;
    full_name: string;
    email: string;
  };
  send_type: 'role' | 'user';
  data: {
    sent_by_admin: string;
  };
  status: string;
  sent_at: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

// Interface cho response lấy danh sách notifications
export interface GetNotificationsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: NotificationItem[];
}

// Parameters cho việc lấy danh sách notifications
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  send_type?: 'role' | 'user';
  status?: string;
  from_date?: string;
  to_date?: string;
}

// Gửi broadcast notification theo role
export const broadcastNotification = async (
  notificationData: BroadcastNotificationRequest
): Promise<BroadcastNotificationResponse> => {
  try {
    const response = await apiClient.post('/notifications/sendToAllUser', notificationData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi thông báo';
    throw new Error(errorMessage);
  }
};

// Gửi notification cho user cụ thể
export const sendToUserNotification = async (
  notificationData: SendToUserNotificationRequest
): Promise<SendToUserNotificationResponse> => {
  try {
    const response = await apiClient.post('/notifications/sendtoUser', notificationData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi thông báo';
    throw new Error(errorMessage);
  }
};

// Lấy danh sách users để chọn gửi notification
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<GetUsersResponse> => {
  try {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy danh sách người dùng';
    throw new Error(errorMessage);
  }
};

// Lấy danh sách notifications với phân trang
export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  try {
    const response = await apiClient.get('/notifications/push-logs', { params });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy danh sách thông báo';
    throw new Error(errorMessage);
  }
};

// Lấy thống kê notification (nếu cần)
export const getNotificationStats = async () => {
  try {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy thống kê';
    throw new Error(errorMessage);
  }
};
