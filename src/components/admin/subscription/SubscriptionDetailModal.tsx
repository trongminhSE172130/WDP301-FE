import React from 'react';
import { Modal, Descriptions, Tag, Typography } from 'antd';
import type { SubscriptionPlan } from './SubscriptionTable';

const { Title } = Typography;

interface SubscriptionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  subscription: SubscriptionPlan | null;
}

const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  visible,
  onClose,
  subscription
}) => {
  if (!subscription) return null;

  // Hàm format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Hàm format thời hạn
  const formatDuration = (days: number, months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} năm${remainingMonths > 0 ? ` ${remainingMonths} tháng` : ''}`;
    } else if (months > 0) {
      return `${months} tháng`;
    } else {
      return `${days} ngày`;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <Title level={4} className="mb-0">Chi tiết gói đăng ký</Title>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="subscription-detail-modal"
    >
      <div className="py-4">
        <Descriptions
          column={2}
          bordered
          size="middle"
          labelStyle={{ 
            backgroundColor: '#f5f5f5', 
            fontWeight: 'bold',
            width: '30%' 
          }}
        >
          <Descriptions.Item label="Tên gói đăng ký" span={2}>
            <span className="text-lg font-semibold text-blue-600">
              {subscription.name}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            <div className="text-gray-700 leading-relaxed">
              {subscription.description}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Giá tiền">
            <span className="text-xl font-bold text-green-600">
              {formatPrice(subscription.price)}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Thời hạn">
            <Tag color="blue" className="text-sm px-3 py-1">
              {formatDuration(subscription.duration_days, subscription.duration_months)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Số ngày">
            <span className="font-medium">
              {subscription.duration_days} ngày
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Số tháng">
            <span className="font-medium">
              {subscription.duration_months} tháng
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" span={2}>
            <Tag 
              color={subscription.is_active ? 'green' : 'default'} 
              className="text-sm px-3 py-1"
            >
              {subscription.is_active ? '🟢 Đang hoạt động' : '⚫ Tạm dừng'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            <div className="text-gray-600">
              {formatDate(subscription.created_at)}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Cập nhật lần cuối">
            <div className="text-gray-600">
              {formatDate(subscription.updated_at)}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default SubscriptionDetailModal; 