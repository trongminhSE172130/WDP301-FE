// ===== BOOKING HISTORY TYPES =====

export interface BookingData {
  _id: string;
  service: string;
  serviceType: string;
  consultantName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  bookingDate: string;
  resultStatus: string;
  hasApprovedResult: boolean;
  canViewResult: boolean;
  hasFeedback: boolean;
  canGiveFeedback: boolean;
  serviceImageUrl?: string;
  serviceDescription: string;
}

// ===== RAW API RESPONSE TYPES =====

export interface BookingUser {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
}

export interface BookingService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  sample_type: string;
  test_details?: {
    parameters: string[];
    preparation: string;
    result_time: string;
  };
}

export interface BookingConsultant {
  _id: string;
  full_name: string;
  email: string;
}

export interface BookingSchedule {
  _id: string;
  consultant_user_id: BookingConsultant;
  date: string;
  time_slot: string;
}

export interface BookingSubscription {
  _id: string;
  status: string;
}

export interface BookingDetailRaw {
  _id: string;
  user_id: BookingUser;
  service_id: BookingService;
  consultant_schedule_id: BookingSchedule | null;
  user_subscription_id: BookingSubscription;
  scheduled_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'processing';
  created_at: string;
  updated_at: string;
  __v: number;
}

// ===== NORMALIZED DATA TYPES =====

export interface NormalizedBookingData {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  gender: string;
  serviceTitle: string;
  serviceDescription: string;
  duration: string;
  sampleType: string;
  testDetails?: {
    parameters: string[];
    preparation: string;
    result_time: string;
  };
  scheduledDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ===== MODAL PROPS TYPES =====

export interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetail: any; // Flexible để chấp nhận cả raw và transformed data
  resultData: any;
}

// ===== PAGINATION TYPES =====

export interface BookingPagination {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ===== STATUS TYPES =====

export type BookingStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
export type ResultStatus = 'pending' | 'approved' | 'rejected';

export interface StatusColors {
  [key: string]: string;
}

// ===== HELPER TYPES =====

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  service_id?: string;
  from_date?: string;
  to_date?: string;
  consultant?: string;
  sort_by: 'created_at' | 'scheduled_date' | 'updated_at' | 'none';
  sort_order?: 'asc' | 'desc' | 'none';
}

// ===== CONSTANTS =====

export const STATUS_COLORS: StatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const RESULT_STATUS_COLORS: StatusColors = {
  pending: "bg-gray-100 text-gray-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const STATUS_TEXT: { [key: string]: string } = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const RESULT_STATUS_TEXT: { [key: string]: string } = {
  pending: "Chờ kết quả",
  approved: "Có kết quả",
  rejected: "Kết quả bị từ chối",
};

// ===== UTILITY FUNCTIONS TYPES =====

export interface BookingUtilityFunctions {
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}
