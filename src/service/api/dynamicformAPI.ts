import axios from 'axios';
import type { DynamicFormResponse, DynamicForm, FormSubmissionData } from '../../types/dynamicForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://genhealth.wizlab.io.vn/api';

// Axios instance với cấu hình chung
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý lỗi unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Interface cho search parameters
export interface DynamicFormSearchParams {
  service_id?: string;
  form_type?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  keyword?: string;
}

// Interface cho response pagination
export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

// Interface cho form submission
export interface FormSubmission {
  _id: string;
  form_id: string;
  submission_data: FormSubmissionData;
  submitted_by?: {
    _id: string;
    full_name: string;
    email: string;
  };
  submitted_at: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

// Interface cho service
export interface Service {
  _id: string;
  title: string;
  description: string;
  category?: string;
  is_active: boolean;
}

/**
 * Lấy danh sách tất cả dynamic forms
 */
export const getAllDynamicForms = async (params?: DynamicFormSearchParams): Promise<DynamicFormResponse> => {
  try {
    const response = await apiClient.get('/dynamic-forms/schemas', {
      params: {
        ...params,
        // Convert boolean to string for API
        is_active: params?.is_active !== undefined ? params.is_active.toString() : undefined,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dynamic forms:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một dynamic form theo ID
 */
export const getDynamicFormById = async (formId: string): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.get(`/dynamic-forms/schemas/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dynamic form:', error);
    throw error;
  }
};

/**
 * Lấy form schema theo serviceId và formType
 */
export const getDynamicFormSchema = async (serviceId: string, formType: string): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.get(`/dynamic-forms/schemas/${serviceId}/${formType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dynamic form schema:', error);
    throw error;
  }
};

/**
 * Tạo dynamic form mới
 */
export const createDynamicForm = async (formData: Partial<DynamicForm>): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.post('/dynamic-forms/schemas', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating dynamic form:', error);
    throw error;
  }
};

/**
 * Cập nhật dynamic form
 */
export const updateDynamicForm = async (formId: string, formData: Partial<DynamicForm>): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.put(`/dynamic-forms/schemas/${formId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating dynamic form:', error);
    throw error;
  }
};

/**
 * Xóa dynamic form
 */
export const deleteDynamicForm = async (formId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/dynamic-forms/schemas/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dynamic form:', error);
    throw error;
  }
};

/**
 * Submit form data (người dùng điền form)
 */
export const submitDynamicForm = async (formId: string, submissionData: FormSubmissionData): Promise<{ success: boolean; data: FormSubmission }> => {
  try {
    const response = await apiClient.post(`/dynamic-forms/submissions`, {
      form_id: formId,
      submission_data: submissionData,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

/**
 * Lấy danh sách submissions của một form
 */
export const getFormSubmissions = async (formId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<FormSubmission>> => {
  try {
    const response = await apiClient.get(`/dynamic-forms/schemas/${formId}/submissions`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    throw error;
  }
};

/**
 * Lấy danh sách services để tạo form
 */
export const getAvailableServices = async (): Promise<{ success: boolean; data: Service[] }> => {
  try {
    const response = await apiClient.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Toggle trạng thái active/inactive của form
 */
export const toggleFormStatus = async (formId: string): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.patch(`/dynamic-forms/schemas/${formId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling form status:', error);
    throw error;
  }
};

/**
 * Duplicate một form
 */
export const duplicateDynamicForm = async (formId: string): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    const response = await apiClient.post(`/dynamic-forms/schemas/${formId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating form:', error);
    throw error;
  }
};

export default {
  getAllDynamicForms,
  getDynamicFormById,
  getDynamicFormSchema,
  createDynamicForm,
  updateDynamicForm,
  deleteDynamicForm,
  submitDynamicForm,
  getFormSubmissions,
  getAvailableServices,
  toggleFormStatus,
  duplicateDynamicForm,
};
