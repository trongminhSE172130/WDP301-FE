import apiClient from '../instance';

export interface ConsultantResponse {
  _id: string;
  full_name: string;
  email: string;
  degree: string;
  specialty: string;
  experience_years: number;
  bio: string;
  is_available_for_advice: boolean;
  is_available_for_analysis: boolean;
  services: string[];
}

export interface ConsultantsListResponse {
  success: boolean;
  count: number;
  data: ConsultantResponse[];
}

export interface ConsultantDetailResponse {
  success: boolean;
  data: ConsultantResponse;
}

export interface CreateConsultantRequest {
  full_name: string;
  email: string;
  password: string;
  degree: string;
  specialty: string;
  experience_years: number;
  bio: string;
  is_available_for_advice?: boolean;
  is_available_for_analysis?: boolean;
  services?: string[];
}

export interface UpdateConsultantRequest {
  degree: string;
  specialty: string;
  experience_years: number;
  bio: string;
}

// Consultation Booking Types
export interface ConsultationUser {
  _id: string;
  full_name: string;
  email: string;
}

export interface ConsultantSchedule {
  _id: string;
  consultant_user_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  date: string;
  time_slot: string;
  schedule_type: 'advice' | 'analysis';
  is_booked: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ConsultationBooking {
  _id: string;
  user_id: ConsultationUser;
  service_id: string;
  consultant_schedule_id: ConsultantSchedule;
  user_subscription_id: string;
  meeting_status: 'not_created' | 'pending_setup' | 'created' | 'started' | 'ended' | 'cancelled';
  meeting_type: 'google_meet' | 'jitsi' | 'phone';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled_by_user' | 'cancelled_by_consultant';
  question: string;
  created_at: string;
  updated_at: string;
  __v: number;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  meeting_link: string | null;
  meeting_created_at?: string;
  meeting_id?: string;
  calendar_event_id?: string;
  meeting_end_time?: string;
  meeting_start_time?: string;
}

export interface ConsultationHistoryResponse {
  success: boolean;
  count: number;
  data: ConsultationBooking[];
}

export interface ConsultationDetailResponse {
  success: boolean;
  data: ConsultationBooking;
}


// Get all consultants
export const getAllConsultants = async (): Promise<ConsultantsListResponse> => {
  const response = await apiClient.get('/consultants');
  return response.data;
};

// Get consultant by ID
export const getConsultantById = async (id: string): Promise<ConsultantDetailResponse> => {
  const response = await apiClient.get(`/consultants/${id}`);
  return response.data;
};

// Register new consultant (using auth endpoint)
export const registerConsultant = async (data: CreateConsultantRequest): Promise<ConsultantDetailResponse> => {
  const response = await apiClient.post('/auth/register-consultant', data);
  return response.data;
};

// Create new consultant (legacy endpoint - keep for compatibility)
export const createConsultant = async (data: CreateConsultantRequest): Promise<ConsultantDetailResponse> => {
  return registerConsultant(data);
};

// Update consultant
export const updateConsultant = async (id: string, data: UpdateConsultantRequest): Promise<ConsultantDetailResponse> => {
  const response = await apiClient.put(`/consultants/${id}`, data);
  return response.data;
};

// Delete consultant
export const deleteConsultant = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/consultants/${id}`);
  return response.data;
};

// Assign services to consultant
export const assignServices = async (consultantId: string, serviceIds: string[]): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.put(`/admin/consultants/${consultantId}/services`, { service_ids: serviceIds });
  return response.data;
};

// Get consultation history for current user
export const getConsultationHistory = async (): Promise<ConsultationHistoryResponse> => {
  const response = await apiClient.get('/consultants/bookings');
  return response.data;
};
export const getConsultationHistoryById = async (id: string): Promise<ConsultationDetailResponse> => {
  const response = await apiClient.get(`/consultants/bookings/${id}`);
  return response.data;
};

export default {
  getAllConsultants,
  getConsultantById,
  registerConsultant,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  getConsultationHistory,
};

