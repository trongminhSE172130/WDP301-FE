import apiClient from '../instance';

export interface OverviewData {
  total_users: number;
  total_consultants: number;
  total_bookings: number;
  total_revenue: number;
  today_bookings: number;
  today_revenue: number;
  active_subscriptions: number;
  pending_bookings: number;
}

export interface OverviewResponse {
  success: boolean;
  data: {
    overview: OverviewData;
    timestamp: string;
  };
}

// Booking Statistics Interfaces
export interface BookingStatusBreakdown {
  _id: string;
  count: number;
}

export interface BookingDailyTrend {
  _id: string;
  count: number;
  completed: number;
  cancelled: number;
}

export interface ServicePopularity {
  _id: string;
  service_name: string;
  bookings: number;
}

export interface ConsultantWorkload {
  _id: string;
  consultant_name: string;
  total_bookings: number;
  completed_bookings: number;
}

export interface BookingStatsResponse {
  success: boolean;
  data: {
    booking_stats: {
      status_breakdown: BookingStatusBreakdown[];
      daily_trend: BookingDailyTrend[];
      service_popularity: ServicePopularity[];
      consultant_workload: ConsultantWorkload[];
      time_range: string;
    }
  };
}

// Revenue Statistics Interfaces
export interface RevenueDailyTrend {
  _id: string;
  revenue: number;
  transactions: number;
}

export interface RevenueStatsData {
  date: string;
  total_revenue: number;
}

export interface RevenueStatsResponse {
  success: boolean;
  data: {
    revenue_stats: {
      summary: {
        _id: null;
        total: number;
        count: number;
        avg_transaction: number;
      };
      daily_trend: RevenueDailyTrend[];
      payment_methods: Array<{
        _id: string;
        count: number;
        total_amount: number;
      }>;
      subscription_plans: Array<{
        _id: string;
        plan_name: string;
        revenue: number;
        subscriptions: number;
      }>;
      time_range: string;
    };
  };
}

// Service Performance Interfaces
export interface ServiceRating {
  _id: string;
  title: string;
  total_reviews: number;
  avg_rating: number | null;
}

export interface ServiceBooking {
  _id: string;
  service_name: string;
  total_bookings: number;
  completed_bookings: number;
  completion_rate: number;
}

export interface OverallFeedback {
  _id: null;
  total_feedbacks: number;
  avg_overall_rating: number;
  avg_service_quality: number;
  avg_consultant_rating: number;
  avg_result_accuracy: number;
}

export interface ServiceStatsData {
  service_name: string;
  booking_count: number;
}

export interface ServiceStatsResponse {
  success: boolean;
  data: {
    service_performance: {
      service_ratings: ServiceRating[];
      service_bookings: ServiceBooking[];
      top_rated_services: ServiceRating[];
      overall_feedback: OverallFeedback;
    };
  };
}

export const dashboardAPI = {
  // Lấy thống kê tổng quan dashboard
  getOverview: async (): Promise<OverviewResponse> => {
    const response = await apiClient.get<OverviewResponse>('/dashboard/overview');
    return response.data;
  },

  // Lấy thống kê đặt lịch
  getBookingStats: async (timeRange: string = '30d'): Promise<BookingStatsResponse> => {
    const response = await apiClient.get<BookingStatsResponse>(`/dashboard/bookings?timeRange=${timeRange}`);
    return response.data;
  },

  // Lấy thống kê doanh thu
  getRevenueStats: async (timeRange: string = '30d'): Promise<RevenueStatsResponse> => {
    const response = await apiClient.get<RevenueStatsResponse>(`/dashboard/revenue?timeRange=${timeRange}`);
    return response.data;
  },

  // Lấy thống kê hiệu suất dịch vụ
  getServiceStats: async (timeRange: string = '30d'): Promise<ServiceStatsResponse> => {
    const response = await apiClient.get<ServiceStatsResponse>(`/dashboard/services?timeRange=${timeRange}`);
    return response.data;
  },
};

export default dashboardAPI;
