import apiClient from '../instance';
import type { Schedule, FilterParams } from '../../components/admin/schedule/ScheduleTypes';

// Interface cho response API
export interface ScheduleResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Schedule[];
}

// Interface cho create/update schedule
export interface CreateScheduleRequest {
  consultant_user_id: string;
  date: string;
  time_slot: string;
  schedule_type: 'advice' | 'consultation';
}

// Interface cho batch create schedules
export interface BatchCreateScheduleRequest {
  consultant_user_id: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  timeSlots: string[];
  schedule_type: 'advice' | 'consultation';
}

// Interface cho search parameters
export interface ScheduleSearchParams extends FilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Lấy danh sách lịch trình với filter và pagination
 */
export const getAllSchedules = async (params?: ScheduleSearchParams): Promise<ScheduleResponse> => {
  try {
    const response = await apiClient.get('/schedules', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một lịch trình theo ID
 */
export const getScheduleById = async (id: string): Promise<{ success: boolean; data: Schedule }> => {
  try {
    // Add populate parameter to get full consultant info
    const response = await apiClient.get(`/consultant-schedules/${id}?populate=consultant_user_id`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

/**
 * Tạo lịch trình mới (Endpoint gốc với consultant_user_id)
 */
export const createSchedule = async (scheduleData: CreateScheduleRequest): Promise<{ success: boolean; data: Schedule }> => {
  try {
    console.log('Creating schedule with data:', scheduleData);
    console.log('API endpoint: POST /consultant-schedules');
    console.log('Request headers will include auth token');
    
    const response = await apiClient.post('/consultant-schedules', scheduleData);
    console.log('Create schedule response:', response.data);
    console.log('Response status:', response.status);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating schedule:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error('Error status:', axiosError.response?.status);
      console.error('Error data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Cập nhật lịch trình
 */
export const updateSchedule = async (id: string, scheduleData: Partial<CreateScheduleRequest>): Promise<{ success: boolean; data: Schedule }> => {
  try {
    const response = await apiClient.put(`/consultant-schedules/${id}`, scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

/**
 * Xóa lịch trình
 */
export const deleteSchedule = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/consultant-schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

/**
 * Xóa nhiều lịch trình cùng lúc (bulk delete)
 * Sử dụng multiple DELETE requests thực hiện song song
 */
export const deleteSchedulesBulk = async (scheduleIds: string[]): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Bulk deleting schedules with IDs:', scheduleIds);
    
    // Delete individually with Promise.all for parallel execution
    const deletePromises = scheduleIds.map(id => 
      apiClient.delete(`/consultant-schedules/${id}`)
    );
    
    const results = await Promise.all(deletePromises);
    console.log('Individual delete results:', results.map(r => r.data));
    
    // Check if all deletes succeeded
    const allSucceeded = results.every(result => result.data.success);
    
    if (allSucceeded) {
      return {
        success: true,
        message: `Đã xóa thành công ${scheduleIds.length} lịch trình`
      };
    } else {
      // Count successful deletes
      const successCount = results.filter(result => result.data.success).length;
      throw new Error(`Chỉ xóa được ${successCount}/${scheduleIds.length} lịch trình`);
    }
  } catch (error: unknown) {
    console.error('Error bulk deleting schedules:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error('Error status:', axiosError.response?.status);
      console.error('Error data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Lấy lịch trình của tư vấn viên hiện tại
 */
export const getMySchedules = async (params?: ScheduleSearchParams): Promise<ScheduleResponse> => {
  try {
    const response = await apiClient.get('/consultant-schedules', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching my schedules:', error);
    throw error;
  }
};

/**
 * Tạo lịch trình mới cho admin
 */
export const createScheduleForAdmin = async (scheduleData: CreateScheduleRequest): Promise<{ success: boolean; data: Schedule }> => {
  try {
    console.log('Admin creating schedule with data:', scheduleData);
    const response = await apiClient.post('/admin/consultant-schedules', scheduleData);
    console.log('Admin create schedule response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating schedule for admin:', error);
    throw error;
  }
};

/**
 * Tạo lịch trình mới cho consultant (không cần consultant_user_id)
 */
export const createScheduleForConsultant = async (scheduleData: Omit<CreateScheduleRequest, 'consultant_user_id'>): Promise<{ success: boolean; data: Schedule }> => {
  try {
    console.log('Consultant creating schedule with data:', scheduleData);
    const response = await apiClient.post('/consultant-schedules', scheduleData);
    console.log('Consultant create schedule response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating schedule for consultant:', error);
    throw error;
  }
};

/**
 * Tạo nhiều lịch trình cùng lúc (batch create)
 */
export const createSchedulesBatch = async (batchData: BatchCreateScheduleRequest): Promise<{ success: boolean; data: Schedule[] }> => {
  try {
    console.log('Creating batch schedules with data:', batchData);
    const response = await apiClient.post('/consultant-schedules/batch', batchData);
    console.log('Batch create response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating batch schedules:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error('Error status:', axiosError.response?.status);
      console.error('Error data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Cập nhật trạng thái lịch trình
 */
export const updateScheduleStatus = async (id: string, isBooked: boolean): Promise<{ success: boolean; data: Schedule }> => {
  try {
    const response = await apiClient.patch(`/consultant-schedules/${id}/status`, { is_booked: isBooked });
    return response.data;
  } catch (error) {
    console.error('Error updating schedule status:', error);
    throw error;
  }
};

/**
 * Lấy lịch trình của một tư vấn viên cụ thể
 */
export const getSchedulesByConsultantId = async (consultantId: string, params?: ScheduleSearchParams): Promise<ScheduleResponse> => {
  try {
    console.log('Fetching schedules for consultant:', consultantId);
    const searchParams = {
      ...params,
      consultant: consultantId // Sử dụng field 'consultant' theo API
    };
    const response = await apiClient.get('/consultant-schedules', { params: searchParams });
    console.log('Consultant schedules response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultant schedules:', error);
    throw error;
  }
};

export default {
  getAllSchedules,
  getScheduleById,
  getSchedulesByConsultantId,
  createSchedule,
  createScheduleForAdmin,
  createScheduleForConsultant,
  createSchedulesBatch,
  updateSchedule,
  deleteSchedule,
  deleteSchedulesBulk,
  getMySchedules,
  updateScheduleStatus,
}; 