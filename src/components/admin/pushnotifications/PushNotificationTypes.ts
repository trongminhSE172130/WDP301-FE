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
  scheduled:number;
  cancelled: number;
}

export interface CreateNotificationRequest {
  role: string;
  title: string;
  body: string;
  data: string;
}

// Types cho việc gửi notification cho user cụ thể
export interface CreateUserNotificationRequest {
  user_id: string;
  title: string;
  body: string;
  data: string;
}

export interface NotificationFormData {
  title: string;
  body: string;
  data: string;
  user_id?: string; // Optional cho trường hợp gửi cho user cụ thể
}

export type NotificationType = 'broadcast' | 'specific_user'; 