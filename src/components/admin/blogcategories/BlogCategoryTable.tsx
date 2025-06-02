import React from 'react';
import { Table, Button, Tag, Input, Tooltip, Badge, Dropdown } from 'antd';
import { 
  EditOutlined, DeleteOutlined, SearchOutlined, 
  EyeOutlined, MoreOutlined
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (text: string | number) => <span>{text}</span>,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BlogCategoryData) => (
        <a onClick={() => onView(record)}>{text}</a>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'blogsCount',
      key: 'blogsCount',
      width: 120,
      render: (count: number) => (
        <Badge count={count} showZero color={count > 0 ? 'blue' : 'default'} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
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
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: unknown, record: BlogCategoryData) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                icon: <EyeOutlined />,
                label: 'Xem chi tiết',
                onClick: () => onView(record),
              },
              {
                key: '2',
                icon: <EditOutlined />,
                label: 'Chỉnh sửa',
                onClick: () => onEdit(record),
              },
              {
                key: '3',
                icon: <DeleteOutlined />,
                label: 'Xóa',
                danger: true,
                onClick: () => onDelete(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
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