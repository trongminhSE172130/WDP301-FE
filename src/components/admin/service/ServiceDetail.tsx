import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Image, List, Typography, Spin, message } from 'antd';
import type { Service } from './ServiceTypes';
import { getServiceById, type ServiceDetailResponse } from '../../../service/api/serviceAPI';

const { Title, Text } = Typography;

interface ServiceDetailProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string | null;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ visible, onClose, serviceId }) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && serviceId) {
      fetchServiceDetail(serviceId);
    }
  }, [visible, serviceId]);

  const fetchServiceDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await getServiceById(id) as ServiceDetailResponse;
      if (response.success) {
        setService(response.data.service);
      } else {
        message.error('Không thể tải chi tiết dịch vụ');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết dịch vụ:', error);
      message.error('Có lỗi xảy ra khi tải chi tiết dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setService(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!visible) return null;

  return (
    <Modal
      title="Chi tiết dịch vụ"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Đang tải chi tiết dịch vụ...</div>
        </div>
      ) : service ? (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Hình ảnh và thông tin cơ bản */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            {service.image_url ? (
              <Image
                width={200}
                height={150}
                src={service.image_url}
                alt={service.title}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div style={{ 
                width: 200, 
                height: 150, 
                backgroundColor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                color: '#999',
                margin: '0 auto'
              }}>
                Không có hình ảnh
              </div>
            )}
            <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
              {service.title}
            </Title>
          </div>

          {/* Thông tin chi tiết */}
          <Descriptions title="Thông tin dịch vụ" bordered column={2}>
            <Descriptions.Item label="Loại dịch vụ" span={2}>
              <Tag color="blue">{service.service_type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian thực hiện">
              {service.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Loại mẫu">
              {service.sample_type}
            </Descriptions.Item>
            <Descriptions.Item label="Đối tượng áp dụng" span={2}>
              {service.target_audience}
            </Descriptions.Item>
            <Descriptions.Item label="Đánh giá">
              {service.rating ? `${service.rating}/5` : 'Chưa có đánh giá'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={service.is_active ? 'green' : 'red'}>
                {service.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(service.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {formatDate(service.updated_at)}
            </Descriptions.Item>
          </Descriptions>

          {/* Mô tả */}
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Mô tả dịch vụ</Title>
            <Text>{service.description}</Text>
          </div>

          {/* Tổng quan */}
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Tổng quan</Title>
            <Text>{service.overview_section}</Text>
          </div>

          {/* Chi tiết xét nghiệm */}
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Chi tiết xét nghiệm</Title>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Các chỉ số xét nghiệm:</Text>
              <List
                size="small"
                bordered
                dataSource={service.test_details.parameters}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                style={{ marginTop: '8px' }}
              />
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Chuẩn bị trước xét nghiệm">
                {service.test_details.preparation}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian có kết quả">
                {service.test_details.result_time}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text type="secondary">Không thể tải thông tin dịch vụ</Text>
        </div>
      )}
    </Modal>
  );
};

export default ServiceDetail; 