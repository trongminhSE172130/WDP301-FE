import React, { useState, useEffect } from 'react';
import { Layout, Typography, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ServiceTable from '../../components/admin/service/ServiceTable';
import ServiceForm from '../../components/admin/service/ServiceForm';
import { getAllServices, createService, updateService, deleteService } from '../../service/api/serviceAPI';
import type { Service } from '../../components/admin/service/ServiceTypes';

const { Content } = Layout;
const { Title } = Typography;

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  // Add pagination states
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Tải danh sách dịch vụ khi component mount
  useEffect(() => {
    loadServices();
    
    // Lấy thông tin user role từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserRole(userData.role || '');
      } catch (error) {
        // Lỗi khi phân tích dữ liệu người dùng
      }
    }
  }, []);

  // Cập nhật filteredServices khi services thay đổi
  useEffect(() => {
    setFilteredServices(services);
    setPagination(prev => ({
      ...prev,
      total: services.length
    }));
  }, [services]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await getAllServices();
      if (response.success) {
        setServices(response.data);
      } else {
        message.error('Không thể tải danh sách dịch vụ');
      }
    } catch (error) {
      console.error('Lỗi khi tải dịch vụ:', error);
      message.error('Có lỗi xảy ra khi tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    let filtered = [...services];

    if (value) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(value.toLowerCase())
      );
    }

    setFilteredServices(filtered);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filtered.length
    }));
  };

  const handleServiceTypeFilter = (value: string) => {
    let filtered = [...services];

    // Apply search filter first
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply service type filter
    if (value) {
      filtered = filtered.filter(service => service.service_type === value);
    }

    setFilteredServices(filtered);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filtered.length
    }));
  };

  const handleStatusFilter = (value: string) => {
    let filtered = [...services];

    // Apply search filter first
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (value !== '') {
      const isActive = value === 'true';
      filtered = filtered.filter(service => service.is_active === isActive);
    }

    setFilteredServices(filtered);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filtered.length
    }));
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    const sorted = [...filteredServices];

    sorted.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (field) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredServices(sorted);
  };

  const handleAdd = () => {
    setSelectedService(undefined);
    setModalVisible(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      message.success('Xóa dịch vụ thành công');
      loadServices(); // Tải lại danh sách
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa dịch vụ';
      message.error(errorMessage);
    }
  };

  const handleStatusChange = async (serviceId: string, checked: boolean) => {
    try {
      const service = services.find(s => s._id === serviceId);
      if (service) {
        const { _id: _, created_at: __, updated_at: ___, __v: ____, ...serviceData } = service;
        const updatedData = {
          ...serviceData,
          is_active: checked
        };

        await updateService(serviceId, updatedData);
        message.success(`${checked ? 'Kích hoạt' : 'Tạm dừng'} dịch vụ thành công`);
        loadServices();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleFormSubmit = async (values: Omit<Service, '_id' | 'created_at' | 'updated_at' | '__v'>) => {
    setConfirmLoading(true);
    try {
      if (selectedService) {
        // Cập nhật dịch vụ
        await updateService(selectedService._id, values);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        // Tạo dịch vụ mới
        await createService(values);
        message.success('Thêm dịch vụ mới thành công');
      }
      setModalVisible(false);
      loadServices(); // Tải lại danh sách
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      message.error('Có lỗi xảy ra khi lưu dịch vụ');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleFormCancel = () => {
    setModalVisible(false);
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Get paginated data
  const getPaginatedData = () => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredServices.slice(startIndex, endIndex);
  };

  return (
    <Content style={{ padding: '20px' }}>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ marginBottom: 0 }}>Quản lý dịch vụ</Title>
        <Button
          type="primary"
          onClick={handleAdd}
          className="h-9 rounded"
          icon={<PlusOutlined />}
        >
          Thêm dịch vụ mới
        </Button>
      </div>
      
      <ServiceTable 
        services={getPaginatedData()}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onServiceTypeFilter={handleServiceTypeFilter}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        userRole={userRole}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePaginationChange
        }}
      />
      
      <ServiceForm
        visible={modalVisible}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialValues={selectedService}
        title={selectedService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
        confirmLoading={confirmLoading}
      />
    </Content>
  );
};

export default ServicePage; 