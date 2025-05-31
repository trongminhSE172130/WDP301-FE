import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Modal, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  loading?: boolean;
  title?: string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  data, 
  onEdit, 
  onDelete, 
  loading = false,
  title = "Danh sách người dùng"
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser.id);
      setDeleteModalVisible(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        let text = 'Người dùng';
        
        if (role === 'admin') {
          color = 'red';
          text = 'Quản trị viên';
        } else if (role === 'staff') {
          color = 'green';
          text = 'Nhân viên';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'active' ? 'green' : 'red';
        const text = status === 'active' ? 'Hoạt động' : 'Không hoạt động';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => onEdit(record)}
            className="border border-blue-500 hover:bg-blue-50"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined className="text-red-500" />} 
            onClick={() => handleDelete(record)}
            className="border border-red-500 hover:bg-red-50"
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
          rowKey="id"
          loading={loading}
          className="w-full"
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
        <p>Bạn có chắc chắn muốn xóa người dùng {selectedUser?.name}?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default UserTable; 