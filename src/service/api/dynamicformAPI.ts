import apiClient from '../instance';
import type { DynamicFormResponse, DynamicForm, FormSubmissionData, DynamicFormCreate } from '../../types/dynamicForm';

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
export const createDynamicForm = async (formData: DynamicFormCreate): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    // Kiểm tra xem form đã tồn tại chưa trước khi gửi request
    const existingForms = await getExistingFormsForService(formData.service_id);
    
    if (existingForms.success) {
      // Kiểm tra trùng lặp form_type
      if (formData.form_type === 'booking_form' && existingForms.data.booking_form) {
        return {
          success: false,
          data: {
            _id: '',
            service_id: '',
            form_type: '',
            form_name: '',
            form_description: '',
            sections: [],
            is_active: false,
            created_at: '',
            updated_at: '',
            __v: 0,
            error: 'Dịch vụ này đã có Form đặt lịch. Mỗi dịch vụ chỉ được có 1 Form đặt lịch và 1 Form kết quả.'
          }
        };
      }
      
      if (formData.form_type === 'result_form' && existingForms.data.result_form) {
        return {
          success: false,
          data: {
            _id: '',
            service_id: '',
            form_type: '',
            form_name: '',
            form_description: '',
            sections: [],
            is_active: false,
            created_at: '',
            updated_at: '',
            __v: 0,
            error: 'Dịch vụ này đã có Form kết quả. Mỗi dịch vụ chỉ được có 1 Form đặt lịch và 1 Form kết quả.'
          }
        };
      }
    }
    
    console.log('=== API CALL DEBUG ===');
    console.log('URL:', '/dynamic-forms/schemas');
    console.log('FormData being sent:', JSON.stringify(formData, null, 2));
    console.log('FormData service_id:', formData.service_id);
    console.log('FormData service_id type:', typeof formData.service_id);
    
    const response = await apiClient.post('/dynamic-forms/schemas', formData);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating dynamic form:', error);
    
    // Log chi tiết error từ API
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown; config?: unknown } };
      console.error('API Error Details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.response?.config,
      });
      
      // Kiểm tra lỗi duplicate key
      if (axiosError.response?.status === 400 && 
          axiosError.response?.data && 
          typeof axiosError.response.data === 'object' &&
          'error' in axiosError.response.data &&
          typeof axiosError.response.data.error === 'string' &&
          axiosError.response.data.error.includes('duplicate key error')) {
        
        return {
          success: false,
          data: {
            _id: '',
            service_id: '',
            form_type: '',
            form_name: '',
            form_description: '',
            sections: [],
            is_active: false,
            created_at: '',
            updated_at: '',
            __v: 0,
            error: 'Dịch vụ này đã có form với loại này. Mỗi dịch vụ chỉ được có 1 Form đặt lịch và 1 Form kết quả.'
          }
        };
      }
    }
    
    throw error;
  }
};

/**
 * Cập nhật dynamic form
 */
export const updateDynamicForm = async (formId: string, formData: Partial<DynamicForm>): Promise<{ success: boolean; data: DynamicForm }> => {
  try {
    console.log('=== UPDATE API CALL DEBUG ===');
    console.log('URL:', `/dynamic-forms/schemas/${formId}`);
    console.log('Form ID:', formId);
    console.log('Update data being sent:', JSON.stringify(formData, null, 2));
    
    const response = await apiClient.put(`/dynamic-forms/schemas/${formId}`, formData);
    console.log('UPDATE API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating dynamic form:', error);
    
    // Log chi tiết error từ API
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown; config?: unknown } };
      console.error('UPDATE API Error Details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.response?.config,
      });
    }
    
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
    console.log('=== GET SERVICES DEBUG ===');
    console.log('URL:', '/services');
    
    const response = await apiClient.get('/services');
    console.log('Services API Response:', response.data);
    console.log('Services data structure:', {
      success: response.data.success,
      dataType: typeof response.data.data,
      dataLength: Array.isArray(response.data.data) ? response.data.data.length : 'not array',
      firstService: Array.isArray(response.data.data) && response.data.data.length > 0 ? response.data.data[0] : 'no data'
    });
    
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

/**
 * Kiểm tra các form đã tồn tại cho một service type
 * Sử dụng API getAllDynamicForms với filter service_id
 */
export const getExistingFormsForService = async (serviceId: string): Promise<{ success: boolean; data: { booking_form?: DynamicForm; result_form?: DynamicForm } }> => {
  try {
    console.log('=== GET EXISTING FORMS DEBUG ===');
    console.log('Service ID:', serviceId);
    
    // Sử dụng API getAllDynamicForms với filter service_id
    const allFormsResponse = await getAllDynamicForms({ 
      service_id: serviceId,
      is_active: true // Chỉ lấy forms đang active
    });
    
    console.log('All forms response:', allFormsResponse);
    
    if (allFormsResponse.success && allFormsResponse.data) {
      const existingForms: { booking_form?: DynamicForm; result_form?: DynamicForm } = {};
      
      allFormsResponse.data.forEach(form => {
        console.log('Processing form:', { id: form._id, type: form.form_type, name: form.form_name });
        
        if (form.form_type === 'booking_form') {
          existingForms.booking_form = form;
        } else if (form.form_type === 'result_form') {
          existingForms.result_form = form;
        }
      });
      
      console.log('Existing forms found:', existingForms);
      
      return {
        success: true,
        data: existingForms
      };
    }
    
    console.log('No forms found or API call failed');
    return { success: true, data: {} };
  } catch (error) {
    console.error('Error fetching existing forms for service:', error);
    // Trả về empty data thay vì throw error để không break UI
    return { success: true, data: {} };
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
  getExistingFormsForService,
};
