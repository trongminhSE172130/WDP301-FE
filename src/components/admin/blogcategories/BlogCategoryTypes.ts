export interface BlogCategoryData {
  id: string | number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  blogsCount?: number; // Số lượng bài viết thuộc danh mục
  createdAt?: string;
  updatedAt?: string;
} 