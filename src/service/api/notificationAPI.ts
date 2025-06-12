import apiClient from '../instance';

export interface BroadcastNotificationRequest {
  role: string;
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
    const response = await apiClient.post('/notifications/broadcast', notificationData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi thông báo';
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
