import React from 'react';
import { Table, Button, Input, Space } from 'antd';
import { 
  EditOutlined, DeleteOutlined, SearchOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import type { BlogCategoryData } from './BlogCategoryTypes';

interface BlogCategoryTableProps {
  categories: BlogCategoryData[];
  loading: boolean;
  onEdit: (category: BlogCategoryData) => void;
  onDelete: (categoryId: string | number) => void;
  onView: (category: BlogCategoryData) => void;
  onSearch: (value: string) => void;
  searchQuery: string;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const BlogCategoryTable: React.FC<BlogCategoryTableProps> = ({
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
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BlogCategoryData) => (
        <a onClick={() => onView(record)}>{text}</a>
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
      render: (_: unknown, record: BlogCategoryData) => (
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
          placeholder="Tìm kiếm danh mục..."
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
          showTotal: (total) => `Tổng ${total} danh mục`,
        }}
      />
    </div>
  );
};

export default BlogCategoryTable; 