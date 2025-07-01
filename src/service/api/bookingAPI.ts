import apiClient from '../instance';

// Interface cho API response từ backend
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

export interface BookingResult {
  // Define result structure if known, or use unknown for now
  [key: string]: unknown;
}

export interface BookingFromAPI {
  _id: string;
  user_id: BookingUser;
  service_id: BookingService;
  consultant_schedule_id: BookingSchedule;
  user_subscription_id: string | BookingSubscription;
  scheduled_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  __v: number;
}

// Interface for detailed booking response
export interface BookingDetailResponse {
  success: boolean;
  data: {
    booking: BookingFromAPI;
    result: BookingResult | null; // Result can be null or contain result data
  };
}

export interface BookingResponse {
  success: boolean;
  count: number;
  data: BookingFromAPI[];
}

export interface BookingPagination {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
  consultant?: string;
}

// Transform API data to frontend format
export const transformBookingData = (apiBooking: BookingFromAPI) => {
  const subscriptionStatus = typeof apiBooking.user_subscription_id === 'object' 
    ? apiBooking.user_subscription_id.status 
    : 'unknown';

  return {
    _id: apiBooking._id,
    patientName: apiBooking.user_id.full_name,
    patientPhone: apiBooking.user_id.phone,
    patientEmail: apiBooking.user_id.email,
    gender: (apiBooking.user_id.gender === 'female' ? 'Female' : 'Male') as 'Male' | 'Female',
    appointmentDate: apiBooking.scheduled_date,
    appointmentTime: apiBooking.time_slot,
    service: apiBooking.service_id.title,
    consultant: apiBooking.consultant_schedule_id.consultant_user_id._id,
    consultantName: apiBooking.consultant_schedule_id.consultant_user_id.full_name,
    reason: apiBooking.service_id.description,
    status: apiBooking.status,
    bookingDate: apiBooking.created_at,
    notes: `Thời gian: ${apiBooking.service_id.duration} | Loại mẫu: ${apiBooking.service_id.sample_type}`,
    // Additional fields for detail view
    serviceDescription: apiBooking.service_id.description,
    serviceDuration: apiBooking.service_id.duration,
    sampleType: apiBooking.service_id.sample_type,
    consultantEmail: apiBooking.consultant_schedule_id.consultant_user_id.email,
    subscriptionId: typeof apiBooking.user_subscription_id === 'string' 
      ? apiBooking.user_subscription_id 
      : apiBooking.user_subscription_id._id,
    subscriptionStatus,
    // New detailed fields
    patientGender: apiBooking.user_id.gender,
    patientDob: apiBooking.user_id.dob,
    testParameters: apiBooking.service_id.test_details?.parameters || [],
    testPreparation: apiBooking.service_id.test_details?.preparation,
    resultTime: apiBooking.service_id.test_details?.result_time,
    updatedAt: apiBooking.updated_at
  };
};

/**
 * Lấy danh sách bookings từ API
 */
export const getAllBookings = async (params?: GetBookingsParams): Promise<{
  success: boolean;
  data: ReturnType<typeof transformBookingData>[];
  pagination: BookingPagination;
}> => {
  try {
    const response = await apiClient.get('/bookings', { params });
    
    if (response.data.success) {
      const transformedData = response.data.data.map(transformBookingData);
      
      // Calculate pagination (assuming API doesn't provide pagination info)
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const totalBookings = response.data.count;
      const totalPages = Math.ceil(totalBookings / limit);
      
      return {
        success: true,
        data: transformedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalBookings,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    }
    
    throw new Error('API response unsuccessful');
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một booking theo ID với endpoint detail
 */
export const getBookingById = async (id: string): Promise<{
  success: boolean;
  data: ReturnType<typeof transformBookingData>;
  result: BookingResult | null;
}> => {
  try {
    const response = await apiClient.get(`/bookings/${id}`);
    
    if (response.data.success) {
      return {
        success: true,
        data: transformBookingData(response.data.data.booking),
        result: response.data.data.result
      };
    }
    
    throw new Error('API response unsuccessful');
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    throw error;
  }
};

/**
 * Xóa booking
 */
export const deleteBooking = async (id: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái booking
 */
export const updateBookingStatus = async (id: string, status: string): Promise<{
  success: boolean;
  data: ReturnType<typeof transformBookingData>;
}> => {
  try {
    const response = await apiClient.patch(`/bookings/${id}/status`, { status });
    
    if (response.data.success) {
      return {
        success: true,
        data: transformBookingData(response.data.data)
      };
    }
    
    throw new Error('API response unsuccessful');
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export default {
  getAllBookings,
  getBookingById,
  deleteBooking,
  updateBookingStatus,
  transformBookingData
};
