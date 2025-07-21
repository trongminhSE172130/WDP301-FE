import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BlogCategoryTable from '../../components/admin/blogcategories/BlogCategoryTable';
import BlogCategoryAdd from '../../components/admin/blogcategories/BlogCategoryAdd';
import BlogCategoryEdit from '../../components/admin/blogcategories/BlogCategoryEdit';
import type { BlogCategoryData } from '../../components/admin/blogcategories/BlogCategoryTypes';
import { 
  getBlogCategories,
  deleteBlogCategory
} from '../../service/api/blogAPI';
import type { BlogCategory } from '../../service/api/blogAPI';

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const BlogCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<BlogCategoryData[]>([]);

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
  }, []);

  // Lọc danh mục theo từ khóa tìm kiếm (thực hiện ở client)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    
    // Cập nhật lại thông tin phân trang
    setPagination(prev => ({
      ...prev,
      total: filteredCategories.length
    }));
  }, [searchQuery, categories, filteredCategories.length]);

  // Chuyển đổi dữ liệu API sang định dạng component
  const mapApiDataToComponentData = (apiData: BlogCategory[]): BlogCategoryData[] => {
    return apiData.map(item => ({
      id: item._id,
      name: item.name,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  };

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getBlogCategories();

      if (response && response.data) {
        const mappedData = mapApiDataToComponentData(response.data);
        setCategories(mappedData);
        setFilteredCategories(mappedData);
        setPagination(prev => ({
          ...prev,
          total: response.count || 0
        }));
      } else {
        setCategories([]);
        setFilteredCategories([]);
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
    // Đơn giản hóa - chỉ sử dụng dữ liệu đã có
    setCurrentCategory(category);
    setIsViewModalVisible(true);
  };

  // Function to handle delete category
  const handleDeleteCategory = async (categoryId: string | number) => {
    try {
      await deleteBlogCategory(categoryId.toString());
      message.success('Xóa danh mục thành công');
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      message.error('Xóa danh mục thất bại');
      console.error(error);
    }
  };

  // Function to handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Phân trang dữ liệu ở client side
  const getPaginatedData = () => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCategories.slice(startIndex, endIndex);
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
        categories={getPaginatedData()}
        loading={loading}
        onEdit={showEditModal}
        onDelete={handleDeleteCategory}
        onView={showViewModal}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredCategories.length,
          onChange: handlePaginationChange
        }}
      />

      <BlogCategoryAdd
        isOpen={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          fetchCategories();
          setIsAddModalVisible(false);
        }}
      />

      <BlogCategoryEdit
        isOpen={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={() => {
          fetchCategories();
          setIsEditModalVisible(false);
        }}
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