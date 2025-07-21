import instance from '../instance';

export interface FeedbackUser {
  _id: string;
  full_name: string;
  email: string;
}

export interface FeedbackService {
  _id: string;
  title: string;
  image_url: string;
}

export interface FeedbackBooking {
  _id: string;
  scheduled_date: string;
  time_slot: string;
}

export interface Feedback {
  _id: string;
  user_id: FeedbackUser | string;
  service_id: FeedbackService | string;
  booking_id: FeedbackBooking | string;
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
  admin_reply_by?: string;
  is_featured?: boolean;
  moderation_notes?: string;
  status?: string;
}

export interface FeedbackListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Feedback[];
}

export interface FeedbackDetailResponse {
  success: boolean;
  data: Feedback;
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
  const response = await instance.get('/admin/feedbacks', { params: filters });
  return response.data;
};

// Lấy thống kê feedback
export const getFeedbackStatistics = async (): Promise<FeedbackStatisticsResponse> => {
  const response = await instance.get('/admin/feedbacks/statistics');
  return response.data;
};

// Lấy chi tiết một feedback theo ID
export const getFeedbackById = async (id: string): Promise<FeedbackDetailResponse> => {
  const response = await instance.get(`/admin/feedbacks/${id}`);
  return response.data;
};

// Cập nhật feedback (phản hồi, trạng thái, đánh dấu nổi bật)
export const updateFeedback = async (id: string, data: {
  status?: string;
  admin_reply?: string;
  is_featured?: boolean;
  moderation_notes?: string;
}): Promise<FeedbackDetailResponse> => {
  const response = await instance.put(`/admin/feedbacks/${id}`, data);
  return response.data;
};

// Xóa một feedback
export const deleteFeedback = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await instance.delete(`/admin/feedbacks/${id}`);
  return response.data;
}; 