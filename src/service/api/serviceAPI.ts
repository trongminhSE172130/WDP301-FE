import apiClient from '../instance';
import type { Service } from '../../components/admin/service/ServiceTypes';

export interface ServiceAPIResponse {
  success: boolean;
  count: number;
  data: Service[];
}

export interface ServiceCreateRequest {
  title: string;
  description: string;
  duration: string;
  sample_type: string;
  test_details: {
    parameters: string[];
    preparation: string;
    result_time: string;
  };
  target_audience: string;
  overview_section: string;
  is_active: boolean;
  image_url?: string;
  service_type_id: string;
}

export interface ServiceUpdateRequest extends ServiceCreateRequest {
  _id: string;
}

// Lấy danh sách tất cả dịch vụ
export const getAllServices = async (): Promise<ServiceAPIResponse> => {
  try {
    const response = await apiClient.get('/services');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    throw error;
  }
};

// Tạo dịch vụ mới
export const createService = async (serviceData: ServiceCreateRequest): Promise<Service> => {
  try {
    const response = await apiClient.post('/services', serviceData);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi tạo dịch vụ:', error);
    throw error;
  }
};

// Cập nhật dịch vụ
export const updateService = async (id: string, serviceData: ServiceCreateRequest): Promise<Service> => {
  try {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật dịch vụ:', error);
    throw error;
  }
};

// Xóa dịch vụ
export const deleteService = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number } };
      if (axiosError.response?.status === 403) {
        throw new Error('Bạn không có quyền xóa dịch vụ này. Vui lòng liên hệ quản trị viên.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    }
    
    throw error;
  }
};

// Response format cho chi tiết dịch vụ
export interface ServiceDetailResponse {
  success: boolean;
  data: {
    service: Service;
    tests: unknown[];
    feedbacks: unknown[];
  };
}

// Lấy chi tiết dịch vụ theo ID
export const getServiceById = async (id: string): Promise<ServiceDetailResponse> => {
  try {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết dịch vụ:', error);
    throw error;
  }
};

// =========================
// SERVICE TYPES APIs
// =========================

export interface ServiceType {
  _id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: {
    _id: string;
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  display_name: string;
  __v: number;
}

export interface ServiceTypeAPIResponse {
  success: boolean;
  count: number;
  data: ServiceType[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Lấy danh sách loại dịch vụ
 * GET /service-types
 */
export const getServiceTypes = async (): Promise<ServiceTypeAPIResponse> => {
  try {
    const response = await apiClient.get('/service-types');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại dịch vụ:', error);
    throw error;
  }
};

/**
 * Thêm loại dịch vụ mới
 * POST /service-types
 */
export const addServiceType = async (data: { 
  name: string; 
  description?: string; 
  is_active?: boolean 
}): Promise<ApiResponse<ServiceType>> => {
  try {
    const response = await apiClient.post('/service-types', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm loại dịch vụ:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết loại dịch vụ
 * GET /service-types/{id}
 */
export const getServiceTypeDetail = async (id: string): Promise<ApiResponse<ServiceType>> => {
  try {
    const response = await apiClient.get(`/service-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết loại dịch vụ:', error);
    throw error;
  }
};

/**
 * Cập nhật loại dịch vụ
 * PUT /service-types/{id}
 */
export const updateServiceType = async (id: string, data: { 
  name?: string; 
  description?: string; 
  is_active?: boolean 
}): Promise<ApiResponse<ServiceType>> => {
  try {
    const response = await apiClient.put(`/service-types/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật loại dịch vụ:', error);
    throw error;
  }
};

/**
 * Xóa loại dịch vụ
 * DELETE /service-types/{id}
 */
export const deleteServiceType = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.delete(`/service-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa loại dịch vụ:', error);
    throw error;
  }
};

// =========================
// IMAGE UPLOAD API
// =========================

/**
 * Upload ảnh cho service
 * POST /upload/single
 */
export const uploadServiceImage = async (file: File): Promise<ApiResponse<{
  url: string;
  fileName: string;
  filePath: string;
  originalName: string;
  size: string;
  contentType: string;
  uploadedAt: string;
  uploadedBy: string;
}>> => {
  // Thử các field names khác nhau
  const fieldNames = ['image', 'file', 'thumbnail', 'upload'];
  
  for (const fieldName of fieldNames) {
    const formData = new FormData();
    formData.append(fieldName, file);
    formData.append('folder', 'services'); // Folder riêng cho services

    try {
      const response = await apiClient.post('/upload/single', formData, {
        headers: {
          'Content-Type': undefined, // Để browser tự set với boundary
        },
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: unknown;
          headers?: unknown;
        };
        request?: unknown;
        message?: string;
      };
      
      // Nếu không phải lỗi 400 (field name issue), break và throw error
      if (apiError.response?.status && apiError.response.status !== 400) {
        throw error;
      }
      
      // Nếu là field cuối cùng, throw error
      if (fieldName === fieldNames[fieldNames.length - 1]) {
        throw error;
      }
    }
  }
  
  throw new Error('Không thể upload với bất kỳ field name nào');
}; 