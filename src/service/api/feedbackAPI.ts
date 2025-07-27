import instance from '../instance';

export interface FeedbackUser {
  _id: string;
  full_name: string;
  email: string;
}

export interface FeedbackService {
  _id: string;
  user_id: {
    _id: string;
    full_name: string;
  };
  service_id: {
    _id: string;
    title: string;
    description: string;
    image_url: string;
  };
  booking_id: {
    _id: string;
    user_id: string;
    service_id: string;
    consultant_schedule_id:{
      _id:string;
      consultant_user_id:{
        _id: string;
        full_name: string;
        email: string;
      }
    }
    date: string;
    schedule_type: string;
    time_slot: string;
    is_booked:boolean;
    created_at: string;
    updated_at: string;
  };
  rating: number;
  comment: string;
  service_quality_rating?: number;
  consultant_rating?: number;
  result_accuracy_rating?: number;
  is_anonymous: boolean;
  status: string;
  is_featured: boolean;
  reported_count: number;
  created_at: string;
  updated_at: string;
  __v: number;
  admin_reply?: string;
  admin_reply_at?: string;
  admin_reply_by?: {
    _id: string;
    full_name: string;
  };
  moderation_notes?: string;
}
export interface FeedbackServiceResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: FeedbackService[];
}
export interface FeedbackServiceRequest {
  page?: number;
  limit?: number;
  min_rating?: number;
  sort_by?: 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
}

export interface FeedbackBooking {
  _id: string;
  scheduled_date: string;
  time_slot: string;
}

export interface AdminUser {
  _id: string;
  full_name: string;
  email: string;
}

export interface Feedback {
  _id: string;
  user_id: FeedbackUser | string;
  service_id: FeedbackService | string;
  booking_id: FeedbackBooking | string | null;
  rating: number;
  comment: string;
  service_quality_rating: number;
  consultant_rating: number;
  result_accuracy_rating: number;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
  admin_reply?: string;
  admin_reply_at?: string;
  admin_reply_by?: string | AdminUser;
  is_featured?: boolean;
  moderation_notes?: string;
  status?: string;
  reported_count?: number;
}

export interface FeedbackListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Feedback[];
  error?: string;
}

export interface FeedbackDetailResponse {
  success: boolean;
  data?: Feedback;
  error?: string;
}

export interface ServiceWithStats {
  _id: string;
  title: string;
  description: string;
  duration: string;
  sample_type: string;
  test_details: {
    parameters: string[];
    preparation: string;
    result_time: string;
  };
  target_audience: string;
  overview_section: string;
  is_active: boolean;
  image_url: string;
  rating: number;
  service_type: string;
  __v: number;
  created_at: string;
  updated_at: string;
  rating_breakdown: {
    service_quality: number;
    consultant: number;
    result_accuracy: number;
  };
  total_reviews: number;
}

export interface TopService {
  _id: string;
  count: number;
  avg_rating: number;
  service: ServiceWithStats;
}

export interface TrendData {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
  avg_rating: number;
}

export interface RatingStat {
  rating: number;
  count: number;
  percentage: number;
}

export interface FeedbackStatistics {
  total: number;
  status_stats: {
    [key: string]: number;
  };
  rating_stats: RatingStat[];
  avg_ratings: {
    avg_rating: number;
    avg_service_quality: number;
    avg_consultant: number;
    avg_result_accuracy: number;
  };
  trend_data: TrendData[];
  top_services: TopService[];
}

export interface FeedbackStatisticsResponse {
  success: boolean;
  data: FeedbackStatistics;
  error?: string;
}

export interface FeedbackFilter {
  page?: number;
  limit?: number;
  rating?: number;
  service_id?: string;
  user_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Lấy danh sách tất cả feedback với filter
export const getAllFeedbacks = async (filters?: FeedbackFilter): Promise<FeedbackListResponse> => {
  try {
    // Thêm tham số strictPopulate=false vào request
    const params = { ...filters, strictPopulate: false };
    const response = await instance.get('/admin/feedbacks', { params });
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching feedbacks:', error);
    const err = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      count: 0,
      total: 0,
      page: 1,
      pages: 0,
      data: [],
      error: err?.response?.data?.error || 'Không thể lấy danh sách feedback'
    };
  }
};

// Lấy thống kê feedback
export const getFeedbackStatistics = async (): Promise<FeedbackStatisticsResponse> => {
  try {
    // Thêm tham số strictPopulate=false vào request
    const response = await instance.get('/admin/feedbacks/statistics?strictPopulate=false');
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching feedback statistics:', error);
    const err = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: err?.response?.data?.error || 'Không thể lấy thống kê feedback',
      data: {} as FeedbackStatistics
    };
  }
};

// Lấy chi tiết một feedback theo ID
export const getFeedbackById = async (id: string): Promise<FeedbackDetailResponse> => {
  try {
    // Thêm tham số strictPopulate=false để tránh lỗi populate
    const response = await instance.get(`/admin/feedbacks/${id}?strictPopulate=false`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching feedback detail:', error);
    const err = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: err?.response?.data?.error || 'Không thể lấy chi tiết feedback'
    };
  }
};

// Cập nhật feedback (phản hồi, trạng thái, đánh dấu nổi bật)
export const updateFeedback = async (id: string, data: {
  status?: string;
  admin_reply?: string;
  is_featured?: boolean;
  moderation_notes?: string;
}): Promise<FeedbackDetailResponse> => {
  try {
    // Thêm tham số strictPopulate=false vào URL
    const response = await instance.put(`/admin/feedbacks/${id}?strictPopulate=false`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating feedback:', error);
    const err = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: err?.response?.data?.error || 'Không thể cập nhật feedback'
    };
  }
};

// Xóa một feedback
export const deleteFeedback = async (id: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // Thêm tham số strictPopulate=false vào URL
    const response = await instance.delete(`/admin/feedbacks/${id}?strictPopulate=false`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error deleting feedback:', error);
    const err = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: err?.response?.data?.error || 'Không thể xóa feedback'
    };
  }
}; 

// Lấy danh sách feedback của một dịch vụ
export const getFeedbacksByService = async (serviceId: string, request: FeedbackServiceRequest): Promise<FeedbackServiceResponse> => {
  const response = await instance.get(`/services/${serviceId}/feedback`, { params: request });
  return response.data;
};