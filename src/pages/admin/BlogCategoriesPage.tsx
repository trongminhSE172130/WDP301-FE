import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BlogCategoryTable from '../../components/admin/blogcategories/BlogCategoryTable';
import BlogCategoryAdd from '../../components/admin/blogcategories/BlogCategoryAdd';
import BlogCategoryEdit from '../../components/admin/blogcategories/BlogCategoryEdit';
import { blogCategoriesData } from '../../components/admin/blogcategories/BlogCategoryData';
import type { BlogCategoryData } from '../../components/admin/blogcategories/BlogCategoryTypes';

// Interface cho API response
interface ApiResponse<T> {
  data: {
    data: T;
    metaData?: {
      currentPage: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

// Interface cho API blog categories
interface BlogCategoryAPIType {
  GetCategories: (page: number, pageSize: number) => Promise<ApiResponse<BlogCategoryData[]>>;
  searchCategory: (query: string, page?: number, pageSize?: number) => Promise<ApiResponse<BlogCategoryData[]>>;
  DeleteCategory: (categoryId: string | number) => Promise<{ success: boolean }>;
  UpdateCategory: (categoryData: Partial<BlogCategoryData>) => Promise<{ success: boolean }>;
  AddCategory: (categoryData: Partial<BlogCategoryData>) => Promise<{ success: boolean }>;
}

// Mock BlogCategoryAPI service
const BlogCategoryAPI: BlogCategoryAPIType = {
  GetCategories: async (page: number, pageSize: number) => {
    // Mock implementation - sử dụng dữ liệu từ BlogCategoryData.ts
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const data = blogCategoriesData.slice(start, end);
    
    return Promise.resolve({
      data: {
        data: data,
        metaData: {
          currentPage: page,
          pageSize: pageSize,
          totalCount: blogCategoriesData.length
        }
      }
    });
  },
  searchCategory: async (query: string, page?: number, pageSize?: number) => {
    // Mock implementation với tìm kiếm
    const searchResults = blogCategoriesData.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase()) || 
      category.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const actualPage = page || 1;
    const actualPageSize = pageSize || 10;
    const start = (actualPage - 1) * actualPageSize;
    const end = actualPage * actualPageSize;
    
    return Promise.resolve({
      data: {
        data: searchResults.slice(start, end),
        metaData: {
          currentPage: actualPage,
          pageSize: actualPageSize,
          totalCount: searchResults.length
        }
      }
    });
  },
  DeleteCategory: async () => {
    return Promise.resolve({ success: true });
  },
  UpdateCategory: async () => {
    return Promise.resolve({ success: true });
  },
  AddCategory: async () => {
    return Promise.resolve({ success: true });
  }
};

const BlogCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add pagination states
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // States for modal visibility
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategoryData | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await BlogCategoryAPI.searchCategory(searchQuery, pagination.current, pagination.pageSize);
      } else {
        response = await BlogCategoryAPI.GetCategories(pagination.current, pagination.pageSize);
      }

      if (response && response.data) {
        setCategories(response.data.data || []);

        // Update total count for pagination using the metaData structure
        if (response.data.metaData) {
          setPagination(prev => ({
            ...prev,
            total: response.data.metaData?.totalCount || 0,
            current: response.data.metaData?.currentPage || 1
          }));
        }
      } else {
        setCategories([]);
        console.error("Unexpected API response structure:", response);
      }
    } catch (error) {
      message.error('Không thể tải danh mục');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to show edit modal
  const showEditModal = (category: BlogCategoryData) => {
    setCurrentCategory(category);
    setIsEditModalVisible(true);
  };

  // Function to show view modal
  const showViewModal = (category: BlogCategoryData) => {
    setCurrentCategory(category);
    setIsViewModalVisible(true);
  };

  // Function to handle delete category
  const handleDeleteCategory = async (categoryId: string | number) => {
    try {
      await BlogCategoryAPI.DeleteCategory(categoryId);
      message.success('Xóa danh mục thành công');
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      message.error('Xóa danh mục thất bại');
      console.error(error);
    }
  };

  // Function to handle search
  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    
    fetchCategories();
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Danh mục Blog</h2>
        <div>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            className="h-9 rounded"
            icon={<PlusOutlined />}
          >
            Thêm danh mục mới
          </Button>
        </div>
      </div>

      <BlogCategoryTable
        categories={categories}
        loading={loading}
        onEdit={showEditModal}
        onDelete={handleDeleteCategory}
        onView={showViewModal}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePaginationChange
        }}
      />

      <BlogCategoryAdd
        isOpen={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchCategories}
      />

      <BlogCategoryEdit
        isOpen={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={fetchCategories}
        category={currentCategory}
      />

      {/* View Category Modal */}
      <Modal
        title="Chi tiết danh mục"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {currentCategory && (
          <div>
            <h2 className="text-xl font-bold mb-2">{currentCategory.name}</h2>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded text-xs ${
                currentCategory.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentCategory.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
              <span className="ml-3 text-sm text-gray-600">
                Bài viết: <strong>{currentCategory.blogsCount || 0}</strong>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả:</h3>
              <p className="text-gray-800 whitespace-pre-line">{currentCategory.description}</p>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Ngày tạo: {new Date(currentCategory.createdAt || '').toLocaleString('vi-VN')}</p>
              <p>Cập nhật: {new Date(currentCategory.updatedAt || '').toLocaleString('vi-VN')}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogCategoriesPage; 