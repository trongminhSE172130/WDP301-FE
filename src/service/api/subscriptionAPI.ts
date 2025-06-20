import instance from '../instance';

// Interface cho Subscription Plan từ API
export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  duration_months: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

// Response interface cho API
export interface SubscriptionPlansResponse {
  success: boolean;
  count: number;
  data: SubscriptionPlan[];
}

// Parameters cho việc lấy danh sách subscription plans
export interface GetSubscriptionPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

// Lấy danh sách gói đăng ký
export const getAllSubscriptionPlans = async (params?: GetSubscriptionPlansParams): Promise<SubscriptionPlansResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const url = `/subscriptions/plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await instance.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

// Tạo gói đăng ký mới
export const createSubscriptionPlan = async (planData: Omit<SubscriptionPlan, '_id' | 'created_at' | 'updated_at' | '__v'>): Promise<SubscriptionPlansResponse> => {
  try {
    const response = await instance.post('/subscriptions/plans', planData);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    throw error;
  }
};

// Cập nhật gói đăng ký
export const updateSubscriptionPlan = async (planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlansResponse> => {
  try {
    const response = await instance.put(`/subscriptions/plans/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};

// Xóa gói đăng ký
export const deleteSubscriptionPlan = async (planId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await instance.delete(`/subscriptions/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    throw error;
  }
};

// Kích hoạt/vô hiệu hóa gói đăng ký
export const toggleSubscriptionPlanStatus = async (planId: string, is_active: boolean): Promise<SubscriptionPlansResponse> => {
  try {
    const response = await instance.patch(`/subscriptions/plans/${planId}/status`, { is_active });
    return response.data;
  } catch (error) {
    console.error('Error toggling subscription plan status:', error);
    throw error;
  }
}; 