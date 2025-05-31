import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import ServiceFilter from '../../components/admin/service/ServiceFilter';
import ServiceTable from '../../components/admin/service/ServiceTable';
import ServiceForm from '../../components/admin/service/ServiceForm';
import { servicesData } from '../../components/admin/service/ServiceData';
import type { Service } from '../../components/admin/service/ServiceTypes';
import type { ServiceFilterValues } from '../../components/admin/service/ServiceFilter';

const { Content } = Layout;
const { Title } = Typography;

const ServicePage: React.FC = () => {
  const [services] = useState<Service[]>(servicesData);
  const [loading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleSearch = (values: ServiceFilterValues) => {
    console.log('Tìm kiếm:', values);
    // Implement search logic here
  };

  const handleAdd = () => {
    setSelectedService(undefined);
    setModalVisible(true);
  };

  const handleEdit = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setModalVisible(true);
    }
  };

  const handleFormSubmit = (values: Omit<Service, 'id'>) => {
    setConfirmLoading(true);
    console.log('Form submitted:', values);
    
    // Simulate API call
    setTimeout(() => {
      setConfirmLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const handleFormCancel = () => {
    setModalVisible(false);
  };

  return (
    <Content style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Quản lý dịch vụ</Title>
      
      <ServiceFilter onSearch={handleSearch} onAdd={handleAdd} />
      
      <ServiceTable 
        data={services} 
        loading={loading}
        onEdit={handleEdit} 
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