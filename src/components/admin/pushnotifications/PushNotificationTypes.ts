// Types cho Push Notification
export interface PushNotification {
  _id: string;
  role: string;
  title: string;
  body: string;
  data: string;
  created_by: {
    _id: string;
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  status: 'draft' | 'sent';
}

export interface User {
  _id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface NotificationStats {
  total: number;
  sent: number;
  draft: number;
}

export interface CreateNotificationRequest {
  role: string;
  title: string;
  body: string;
  data: string;
} 