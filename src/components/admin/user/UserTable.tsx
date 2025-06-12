import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Modal, Typography } from 'antd';
import { DeleteOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import UserDetailModal from './UserDetailModal';
import type { ColumnsType } from 'antd/es/table';
import type { Pagination } from '../../../service/api/userAPI';

const { Text } = Typography;

// Sử dụng interface từ API
export type User = {
  _id: string;
  full_name: string;
  email: string;
  role: 'user' | 'consultant' | 'admin';
  phone?: string;
  gender?: 'male' | 'female';
  created_at: string;
  statistics: {
    total_bookings: number;
    active_subscriptions: number;
  };
}

interface UserTableProps {
  data: User[];
  onDelete: (userId: string) => void;
  loading?: boolean;
  title?: string;
  pagination?: Pagination;
  onPageChange?: (page: number, pageSize?: number) => void;
  currentPageSize?: number;
}

const UserTable: React.FC<UserTableProps> = ({ 
  data, 
  onDelete, 
  loading = false,
  title = "Danh sách người dùng",
  pagination,
  onPageChange,
  currentPageSize = 10
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUserId(user._id);
    setDetailModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser._id);
      setDeleteModalVisible(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text) => (
        <Space>
          <UserOutlined className="text-gray-400" />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'Chưa cập nhật'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        let text = 'Người dùng';
        
        if (role === 'admin') {
          color = 'red';
          text = 'Quản trị viên';
        } else if (role === 'consultant') {
          color = 'green';
          text = 'Tư vấn viên';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        if (gender === 'male') return 'Nam';
        if (gender === 'female') return 'Nữ';
        return 'Chưa cập nhật';
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined className="text-green-500" />} 
            onClick={() => handleViewDetail(record)}
            className="border border-green-500 hover:bg-green-50"
            title="Xem chi tiết"
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
          pagination={pagination ? {
            current: pagination.currentPage,
            total: pagination.totalUsers,
            pageSize: currentPageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} người dùng`,
            onChange: onPageChange,
            onShowSizeChange: onPageChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          } : false}
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
        <p>Bạn có chắc chắn muốn xóa người dùng {selectedUser?.full_name}?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <UserDetailModal
        visible={detailModalVisible}
        userId={selectedUserId}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default UserTable; 