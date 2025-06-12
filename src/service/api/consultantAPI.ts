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
