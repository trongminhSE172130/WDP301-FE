// ===== CONSULTATION HISTORY TYPES =====

export interface ConsultationData {
  _id: string;
  consultantName: string;
  consultantEmail: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  meetingStatus: string;
  question: string;
  meetingLink: string | null;
  scheduleType: 'advice' | 'analysis';
  createdAt: string;
  updatedAt: string;
  meetingId?: string;
  calendarEventId?: string;
}

export interface ConsultationFilters {
  dateRange?: [string, string];
  status?: string;
  consultant?: string;
}

export type ConsultationStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled_by_user' | 'cancelled_by_consultant';
export type MeetingStatus = 'not_created' | 'pending_setup' | 'created' | 'started' | 'ended' | 'cancelled';

export const CONSULTATION_STATUS_COLORS = {
  pending: 'orange',
  confirmed: 'blue', 
  in_progress: 'cyan',
  completed: 'green',
  cancelled_by_user: 'red',
  cancelled_by_consultant: 'volcano',
} as const;

export const MEETING_STATUS_COLORS = {
  not_created: 'default',
  pending_setup: 'orange',
  created: 'blue',
  started: 'green', 
  ended: 'gray',
  cancelled: 'red',
} as const;

export const CONSULTATION_STATUS_TEXT = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang diễn ra',
  completed: 'Hoàn thành',
  cancelled_by_user: 'Người dùng hủy',
  cancelled_by_consultant: 'Chuyên gia hủy',
} as const;

export const MEETING_STATUS_TEXT = {
  not_created: 'Chưa tạo',
  pending_setup: 'Đang thiết lập',
  created: 'Đã tạo',
  started: 'Đã bắt đầu',
  ended: 'Đã kết thúc',
  cancelled: 'Đã hủy',
} as const;

export const SCHEDULE_TYPE_TEXT = {
  advice: 'Tư vấn trực tuyến',
  analysis: 'Phân tích kết quả',
} as const;
