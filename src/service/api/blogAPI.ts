import apiClient from '../instance';

export interface BlogCategory {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category_id: {
    _id: string;
    name: string;
  };
  thumbnail_url: string;
  admin_user_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  status: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
}

export interface BlogApiResponse<T> {
  success: boolean;
  data: T;
  pagination: PaginationResponse;
}

/**
 * Lấy danh sách bài viết blog
 * GET /blogs
 */
export const getBlogs = async (
  page: number = 1, 
  limit: number = 10, 
  category?: string, 
  search?: string, 
  sort?: string, 
  status?: string
): Promise<BlogApiResponse<Blog[]>> => {
  let url = `/blogs?page=${page}&limit=${limit}`;
  
  if (category) url += `&category=${category}`;
  if (search) url += `&search=${search}`;
  if (sort) url += `&sort=${sort}`;
  if (status) url += `&status=${status}`;
  
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Lấy chi tiết bài viết blog
 * GET /blogs/{id}
 */
export const getBlogDetail = async (id: string): Promise<ApiResponse<Blog>> => {
  const response = await apiClient.get(`/blogs/${id}`);
  return response.data;
};

/**
 * Thêm bài viết blog mới
 * POST /blogs
 */
export const addBlog = async (data: {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category_id: string;
  thumbnail_url: string;
  status: string;
}): Promise<ApiResponse<Blog>> => {
  const response = await apiClient.post('/blogs', data);
  return response.data;
};

/**
 * Cập nhật bài viết blog
 * PUT /blogs/{id}
 */
export const updateBlog = async (
  id: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    category_id?: string;
    thumbnail_url?: string;
    status?: string;
  }
): Promise<ApiResponse<Blog>> => {
  const response = await apiClient.put(`/blogs/${id}`, data);
  return response.data;
};

/**
 * Xóa bài viết blog
 * DELETE /blogs/{id}
 */
export const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};

/**
 * Lấy danh sách danh mục blog
 * GET /blogs/categories
 */
export const getBlogCategories = async (): Promise<ApiResponse<BlogCategory[]>> => {
  const response = await apiClient.get('/blogs/categories');
  return response.data;
};

/**
 * Thêm danh mục blog mới
 * POST /blogs/categories
 */
export const addBlogCategory = async (data: { name: string }): Promise<ApiResponse<BlogCategory>> => {
  const response = await apiClient.post('/blogs/categories', data);
  return response.data;
};

/**
 * Lấy thông tin chi tiết danh mục blog
 * GET /blogs/categories/{id}
 */
export const getBlogCategoryDetail = async (id: string): Promise<ApiResponse<BlogCategory>> => {
  const response = await apiClient.get(`/blogs/categories/${id}`);
  return response.data;
};

/**
 * Cập nhật danh mục blog
 * PUT /blogs/categories/{id}
 */
export const updateBlogCategory = async (id: string, data: { name: string }): Promise<ApiResponse<BlogCategory>> => {
  const response = await apiClient.put(`/blogs/categories/${id}`, data);
  return response.data;
};

/**
 * Xóa danh mục blog
 * DELETE /blogs/categories/{id}
 */
export const deleteBlogCategory = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete(`/blogs/categories/${id}`);
  return response.data;
};

/**
 * Upload thumbnail cho blog
 * POST /upload/single
 */
export const uploadBlogThumbnail = async (file: File): Promise<ApiResponse<{
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

/**
 * Cập nhật trạng thái blog
 * PUT /blogs/{id}/status
 */
export const updateBlogStatus = async (
  id: string,
  status: 'draft' | 'published'
): Promise<ApiResponse<Blog>> => {
  const response = await apiClient.put(`/blogs/${id}/status`, { status });
  return response.data;
};
