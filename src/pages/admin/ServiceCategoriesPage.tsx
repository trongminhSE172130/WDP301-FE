import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ServiceCategoryTable from '../../components/admin/servicecategories/ServiceCategoryTable';
import ServiceCategoryAdd from '../../components/admin/servicecategories/ServiceCategoryAdd';
import ServiceCategoryEdit from '../../components/admin/servicecategories/ServiceCategoryEdit';
import type { ServiceTypeData } from '../../components/admin/servicecategories/ServiceCategoryTypes';
import { 
  getServiceTypes,
  deleteServiceType,
  getServiceTypeDetail
} from '../../service/api/serviceAPI';
import type { ServiceType } from '../../service/api/serviceAPI';

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const ServiceCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<ServiceTypeData[]>([]);

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
  const [currentCategory, setCurrentCategory] = useState<ServiceTypeData | null>(null);
  const [viewModalLoading, setViewModalLoading] = useState<boolean>(false);

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
  const mapApiDataToComponentData = (apiData: ServiceType[]): ServiceTypeData[] => {
    return apiData.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description,
      display_name: item.display_name,
      is_active: item.is_active,
      created_by: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  };

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getServiceTypes();

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
      message.error('Không thể tải loại dịch vụ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to show edit modal
  const showEditModal = (category: ServiceTypeData) => {
    setCurrentCategory(category);
    setIsEditModalVisible(true);
  };

  // Function to show view modal
  const showViewModal = async (category: ServiceTypeData) => {
    setIsViewModalVisible(true);
    setViewModalLoading(true);
    setCurrentCategory(null);
    
    try {
      // Gọi API để lấy chi tiết loại dịch vụ
      const response = await getServiceTypeDetail(category.id.toString());
      
      if (response && response.data) {
        const detailData: ServiceTypeData = {
          id: response.data._id,
          name: response.data.name,
          description: response.data.description,
          display_name: response.data.display_name,
          is_active: response.data.is_active,
          created_by: response.data.created_by,
          createdAt: response.data.created_at,
          updatedAt: response.data.updated_at
        };
        setCurrentCategory(detailData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết loại dịch vụ:', error);
      message.error('Không thể tải chi tiết loại dịch vụ');
      setIsViewModalVisible(false);
    } finally {
      setViewModalLoading(false);
    }
  };

  // Function to handle delete category
  const handleDeleteCategory = async (categoryId: string | number) => {
    try {
      await deleteServiceType(categoryId.toString());
      message.success('Xóa loại dịch vụ thành công');
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      message.error('Xóa loại dịch vụ thất bại');
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
        <h2 className="text-2xl font-bold">Quản lý Loại Dịch vụ</h2>
        <div>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            className="h-9 rounded"
            icon={<PlusOutlined />}
          >
            Thêm loại dịch vụ mới
          </Button>
        </div>
      </div>

      <ServiceCategoryTable
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

      <ServiceCategoryAdd
        isOpen={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          fetchCategories();
          setIsAddModalVisible(false);
        }}
      />

      <ServiceCategoryEdit
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
        title="Chi tiết loại dịch vụ"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setCurrentCategory(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalVisible(false);
            setCurrentCategory(null);
          }}>
            Đóng
          </Button>
        ]}
        width={700}
        loading={viewModalLoading}
      >
        {viewModalLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Đang tải thông tin chi tiết...</p>
            </div>
          </div>
        ) : currentCategory ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentCategory.display_name || currentCategory.name}</h2>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Tên hệ thống:</span>
                <span className="ml-2">{currentCategory.name}</span>
              </div>
              
              {currentCategory.description && (
                <div>
                  <span className="font-medium text-gray-700">Mô tả:</span>
                  <p className="ml-2 mt-1 text-gray-600">{currentCategory.description}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  currentCategory.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentCategory.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              
              {currentCategory.created_by && (
                <div>
                  <span className="font-medium text-gray-700">Người tạo:</span>
                  <span className="ml-2">{currentCategory.created_by.full_name} ({currentCategory.created_by.email})</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t text-xs text-gray-500">
              <p>Ngày tạo: {new Date(currentCategory.createdAt || '').toLocaleString('vi-VN')}</p>
              <p>Cập nhật: {new Date(currentCategory.updatedAt || '').toLocaleString('vi-VN')}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin chi tiết
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceCategoriesPage;
