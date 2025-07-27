import apiClient from "../instance";

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
  _id: string;
  booking_id: string;
  service_id: string;
  form_schema_id: string;
  form_type: string;
  form_data: {
    [key: string]: any; // Dynamic form data
    doctor_comment?: string;
  };
  submitted_by: {
    _id: string;
    full_name: string;
    email: string;
  };
  is_validated: boolean;
  validation_errors: any[];
  review_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  created_at: string;
  updated_at: string;
  __v: number;
  review_notes?: string;
  reviewed_at?: string;
  reviewed_by?: {
    _id: string;
    full_name: string;
    email: string;
  };
  id: string;
}

export interface BookingHistoryResponse {
  success: boolean;
  count: number;
  completed_count: number;
  with_results_count: number;
  data: BookingHistoryItem[];
}

export interface BookingHistoryItem {
  booking: BookingFromAPI;
  has_result: boolean;
  can_feedback: boolean;
  result_form_info: ResultFormInfo | null;
}

export interface ResultFormInfo {
  _id: string;
  review_status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: {
    _id: string;
    full_name: string;
    email: string;
  };
  reviewed_at?: string;
  submitted_at: string;
}

// Update the existing BookingFromAPI interface to include new fields
export interface BookingFromAPI {
  _id: string;
  user_id: BookingUser | null;
  service_id: BookingService;
  consultant_schedule_id: BookingSchedule | null;
  user_subscription_id: string | BookingSubscription;
  scheduled_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'processing';
  created_at: string;
  updated_at: string;
  __v: number;
  result_status: 'pending' | 'approved' | 'rejected';
  has_approved_result: boolean;
  can_view_result: boolean;
  has_feedback: boolean;
  can_give_feedback: boolean;
}

// Interface for detailed booking response
export interface BookingDetailResponse {
  success: boolean;
  data: {
    booking: BookingFromAPI;
    result: BookingResult | null; // Detailed result structure
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
export interface BookingHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  service_id?: string;
  from_date?: string;
  to_date?: string;
  consultant?: string;
  sort_by: 'created_at' | 'scheduled_date'| 'updated_at'| "none";
  sort_order?: 'asc' | 'desc'| 'none';
}

// Transform API data to frontend format
export const transformBookingData = (apiBooking: BookingFromAPI) => {
  const subscriptionStatus = typeof apiBooking.user_subscription_id === 'object' 
    ? apiBooking.user_subscription_id.status 
    : 'unknown';

  return {
    _id: apiBooking._id,
    patientName: apiBooking.user_id ? apiBooking.user_id.full_name : 'Không có thông tin',
    patientPhone: apiBooking.user_id ? apiBooking.user_id.phone : '',
    patientEmail: apiBooking.user_id ? apiBooking.user_id.email : '',
    gender: apiBooking.user_id && apiBooking.user_id.gender === 'female' ? 'Female' : 'Male' as 'Male' | 'Female',
    appointmentDate: apiBooking.scheduled_date,
    appointmentTime: apiBooking.time_slot,
    service: apiBooking.service_id ? apiBooking.service_id.title : '',
    consultant: apiBooking.consultant_schedule_id ? apiBooking.consultant_schedule_id.consultant_user_id._id : '',
    consultantName: apiBooking.consultant_schedule_id ? apiBooking.consultant_schedule_id.consultant_user_id.full_name : 'Chưa phân công',
    reason: apiBooking.service_id ? apiBooking.service_id.description : '',
    status: apiBooking.status,
    bookingDate: apiBooking.created_at,
    notes: apiBooking.service_id ? `Thời gian: ${apiBooking.service_id.duration} | Loại mẫu: ${apiBooking.service_id.sample_type}` : '',
    // Additional fields for detail view
    serviceDescription: apiBooking.service_id ? apiBooking.service_id.description : '',
    serviceDuration: apiBooking.service_id ? apiBooking.service_id.duration : '',
    sampleType: apiBooking.service_id ? apiBooking.service_id.sample_type : '',
    consultantEmail: apiBooking.consultant_schedule_id ? apiBooking.consultant_schedule_id.consultant_user_id.email : '',
    subscriptionId: typeof apiBooking.user_subscription_id === 'string' 
      ? apiBooking.user_subscription_id 
      : apiBooking.user_subscription_id._id,
    subscriptionStatus,
    // New detailed fields
    patientGender: apiBooking.user_id ? apiBooking.user_id.gender : '',
    patientDob: apiBooking.user_id ? apiBooking.user_id.dob : '',
    testParameters: apiBooking.service_id && apiBooking.service_id.test_details ? apiBooking.service_id.test_details.parameters || [] : [],
    testPreparation: apiBooking.service_id && apiBooking.service_id.test_details ? apiBooking.service_id.test_details.preparation : '',
    resultTime: apiBooking.service_id && apiBooking.service_id.test_details ? apiBooking.service_id.test_details.result_time : '',
    updatedAt: apiBooking.updated_at
  };
};

// Transform BookingHistoryItem to frontend format
export const transformBookingHistoryData = (item: BookingHistoryItem) => {
  const baseData = transformBookingData(item.booking);
  
  return {
    ...baseData,
    // Additional fields from BookingHistoryItem
    hasResult: item.has_result,
    canFeedback: item.can_feedback,
    canViewResult: item.has_result, // Can view result if has result
    resultStatus: item.result_form_info?.review_status || 'pending' as 'pending' | 'approved' | 'rejected',
    resultFormInfo: item.result_form_info ? {
      id: item.result_form_info._id,
      reviewStatus: item.result_form_info.review_status,
      reviewedBy: item.result_form_info.reviewed_by?.full_name || '',
      reviewedAt: item.result_form_info.reviewed_at || '',
      submittedAt: item.result_form_info.submitted_at
    } : null,
    // Ensure required fields have default values
    patientGender: baseData.patientGender || '',
    patientDob: baseData.patientDob || '',
    testParameters: baseData.testParameters || [],
    testPreparation: baseData.testPreparation || '',
    resultTime: baseData.resultTime || ''
  };
};

/**
 * Helper function to format test result data for display
 */
export const formatTestResultData = (result: BookingResult) => {
  const { form_data, ...otherData } = result;
  
  // Extract test parameters and doctor comment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { doctor_comment, _metadata, ...testValues } = form_data;
  
  // Format test values for display
  const formattedTestValues = Object.entries(testValues).map(([key, value]) => ({
    parameter: key,
    value: value,
    displayName: formatParameterName(key)
  }));
  
  return {
    ...otherData,
    testValues: formattedTestValues,
    doctorComment: doctor_comment || '',
    reviewInfo: {
      status: result.review_status,
      reviewedBy: result.reviewed_by?.full_name || '',
      reviewedAt: result.reviewed_at || '',
      reviewNotes: result.review_notes || '',
      submittedBy: result.submitted_by.full_name,
      submittedAt: result.submitted_at
    }
  };
};

/**
 * Helper function to format parameter names for better display
 */
export const formatParameterName = (paramName: string): string => {
  const parameterNames: { [key: string]: string } = {
    'FSH': 'FSH (Follicle Stimulating Hormone)',
    'LH': 'LH (Luteinizing Hormone)', 
    'Estradiol': 'Estradiol (E2)',
    'Progesterone': 'Progesterone',
    'Prolactin': 'Prolactin',
    'TSH': 'TSH (Thyroid Stimulating Hormone)',
    'AMH': 'AMH (Anti-Müllerian Hormone)',
    'Testosterone': 'Testosterone',
    'DHEA-S': 'DHEA-S'
  };
  
  return parameterNames[paramName] || paramName;
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
  resultFormInfo?: {
    id: string;
    reviewStatus: 'pending' | 'approved' | 'rejected';
    reviewedBy: string;
    reviewedAt: string;
    submittedAt: string;
    reviewNotes?: string;
    submittedBy: string;
    isValidated: boolean;
    formData: any;
    doctorComment?: string;
  } | null;
}> => {
  try {
    const response = await apiClient.get<BookingDetailResponse>(`/bookings/${id}`);
    
    if (response.data.success) {
      const transformedBooking = transformBookingData(response.data.data.booking);
      const result = response.data.data.result;
      
      return {
        success: true,
        data: transformedBooking,
        result,
        resultFormInfo: result ? {
          id: result._id,
          reviewStatus: result.review_status,
          reviewedBy: result.reviewed_by?.full_name || '',
          reviewedAt: result.reviewed_at || '',
          submittedAt: result.submitted_at,
          reviewNotes: result.review_notes || '',
          submittedBy: result.submitted_by.full_name,
          isValidated: result.is_validated,
          formData: result.form_data,
          doctorComment: result.form_data.doctor_comment || ''
        } : null
      };
    }
    
    throw new Error('API response unsuccessful');
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    throw error;
  }
};

/**
 * Lấy raw chi tiết một booking theo ID (không transform) - cho modal
 */
export const getBookingDetailRaw = async (id: string): Promise<{
  success: boolean;
  data: {
    booking: BookingFromAPI;
    result: BookingResult | null;
  };
}> => {
  try {
    const response = await apiClient.get<BookingDetailResponse>(`/bookings/${id}`);
    
    if (response.data.success) {
      return {
        success: true,
        data: {
          booking: response.data.data.booking,
          result: response.data.data.result
        }
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
export const BookingHistory = async (params?: BookingHistoryParams): Promise<{
  success: boolean;
  data: ReturnType<typeof transformBookingHistoryData>[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    completedCount: number;
    withResultsCount: number;
  };
}> => {
  try {
    const response = await apiClient.get<BookingHistoryResponse>('/bookings/results-from-forms', { params });
    
    if (response.data.success) {
      const transformedData = response.data.data.map(transformBookingHistoryData);
      
      // Since the new API doesn't provide pagination info, we'll calculate based on current data
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
        },
        stats: {
          completedCount: response.data.completed_count,
          withResultsCount: response.data.with_results_count
        }
      };
    }
    
    throw new Error('API response unsuccessful');
  } catch (error) {
    console.error('Error fetching booking history:', error);
    throw error;
  }
}

export default {
  getAllBookings,
  getBookingById,
  getBookingDetailRaw,
  deleteBooking,
  updateBookingStatus,
  BookingHistory,
  transformBookingData,
  transformBookingHistoryData,
  formatTestResultData,
  formatParameterName
};
