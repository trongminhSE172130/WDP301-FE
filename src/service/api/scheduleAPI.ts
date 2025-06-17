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
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  note?: string;
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
    console.log('=== GET SCHEDULES API DEBUG ===');
    console.log('Params:', params);
    
    const response = await apiClient.get('/schedules', { params });
    console.log('Schedules API Response:', response.data);
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
    const response = await apiClient.get(`/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

/**
 * Tạo lịch trình mới
 */
export const createSchedule = async (scheduleData: CreateScheduleRequest): Promise<{ success: boolean; data: Schedule }> => {
  try {
    console.log('=== CREATE SCHEDULE API DEBUG ===');
    console.log('Schedule data being sent:', scheduleData);
    
    const response = await apiClient.post('/schedules', scheduleData);
    console.log('Create schedule response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

/**
 * Cập nhật lịch trình
 */
export const updateSchedule = async (id: string, scheduleData: Partial<CreateScheduleRequest>): Promise<{ success: boolean; data: Schedule }> => {
  try {
    console.log('=== UPDATE SCHEDULE API DEBUG ===');
    console.log('Schedule ID:', id);
    console.log('Update data:', scheduleData);
    
    const response = await apiClient.put(`/schedules/${id}`, scheduleData);
    console.log('Update schedule response:', response.data);
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
    const response = await apiClient.delete(`/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

/**
 * Lấy lịch trình của tư vấn viên hiện tại
 */
export const getMySchedules = async (params?: ScheduleSearchParams): Promise<ScheduleResponse> => {
  try {
    console.log('=== GET MY SCHEDULES API DEBUG ===');
    console.log('Params:', params);
    
    const response = await apiClient.get('/schedules/my-schedules', { params });
    console.log('My schedules response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching my schedules:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái lịch trình
 */
export const updateScheduleStatus = async (id: string, status: 'available' | 'booked' | 'completed' | 'cancelled'): Promise<{ success: boolean; data: Schedule }> => {
  try {
    const response = await apiClient.patch(`/schedules/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating schedule status:', error);
    throw error;
  }
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getMySchedules,
  updateScheduleStatus,
}; 