import React from 'react';
import { Table, Button, Input, Space } from 'antd';
import { 
  EditOutlined, DeleteOutlined, SearchOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import type { ServiceTypeData } from './ServiceCategoryTypes';

interface ServiceCategoryTableProps {
  categories: ServiceTypeData[];
  loading: boolean;
  onEdit: (category: ServiceTypeData) => void;
  onDelete: (categoryId: string | number) => void;
  onView: (category: ServiceTypeData) => void;
  onSearch: (value: string) => void;
  searchQuery: string;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ServiceCategoryTable: React.FC<ServiceCategoryTableProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onView,
  onSearch,
  searchQuery,
  pagination,
}) => {
  const columns = [
    {
      title: 'Tên loại dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ServiceTypeData) => (
        <a onClick={() => onView(record)}>{text}</a>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <span>{text || '--'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      render: (is_active: boolean) => (
        <span className={`px-2 py-1 rounded text-xs ${
          is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {is_active ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      render: (date: string) => (
        <span>{new Date(date).toLocaleString('vi-VN')}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: unknown, record: ServiceTypeData) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView(record)}
            type="text"
            style={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            type="primary"
            style={{ borderRadius: '4px' }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record.id)}
            danger
            style={{ borderRadius: '4px' }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm loại dịch vụ..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} loại dịch vụ`,
        }}
      />
    </div>
  );
};

export default ServiceCategoryTable; 