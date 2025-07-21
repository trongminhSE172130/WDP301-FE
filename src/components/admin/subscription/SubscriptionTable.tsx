import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Modal, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

// Interface cho Subscription Plan từ API
export type SubscriptionPlan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  duration_months: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface SubscriptionTableProps {
  data: SubscriptionPlan[];
  onDelete: (subscriptionId: string) => void;
  onEdit?: (plan: SubscriptionPlan) => void;
  onViewDetail?: (plan: SubscriptionPlan) => void;
  loading?: boolean;
  title?: string;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ 
  data, 
  onDelete, 
  onEdit,
  onViewDetail,
  loading = false,
  title = "Danh sách gói đăng ký"
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleDelete = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedPlan) {
      onDelete(selectedPlan._id);
      setDeleteModalVisible(false);
    }
  };



  // Hàm format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Hàm format thời hạn
  const formatDuration = (days: number, months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12);
      return `${years} năm`;
    } else if (months > 0) {
      return `${months} tháng`;
    } else {
      return `${days} ngày`;
    }
  };

  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Text strong className="text-blue-600">{text}</Text>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Text className="text-gray-600">{text}</Text>
      ),
      width: 300
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong className="text-green-600">
          {formatPrice(price)}
        </Text>
      ),
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Thời hạn',
      key: 'duration',
      render: (_, record) => (
        <Tag color="blue">
          {formatDuration(record.duration_days, record.duration_months)}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Tag color={is_active ? 'green' : 'default'}>
          {is_active ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined className="text-green-500" />} 
            onClick={() => onViewDetail && onViewDetail(record)}
            className="border border-green-500 hover:bg-green-50"
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => onEdit && onEdit(record)}
            className="border border-blue-500 hover:bg-blue-50"
            title="Chỉnh sửa"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined className="text-red-500" />} 
            onClick={() => handleDelete(record)}
            className="border border-red-500 hover:bg-red-50"
            title="Xóa"
          />
        </Space>
      ),
      width: 150
    },
  ];

  return (
    <div className="w-full">
      <Card title={title} bordered={false} className="w-full">
        <Table 
          dataSource={data} 
          columns={columns} 
          rowKey="_id"
          loading={loading}
          className="w-full"
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>
      
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa gói đăng ký "{selectedPlan?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default SubscriptionTable; 