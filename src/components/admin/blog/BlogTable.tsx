import React from 'react';
import { Table, Button, Space, Popconfirm, Image, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// Định nghĩa các kiểu dữ liệu
interface BlogData {
  id: string | number;
  title: string;
  content: string;
  image: string;
  blogCategoryId: number | string;
  categoryName: string;
  userId: number | string;
  fullName: string;
}

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

interface BlogTableProps {
  blogs: BlogData[];
  loading: boolean;
  onEdit: (blog: BlogData) => void;
  onDelete: (id: string | number) => void;
  onView: (blog: BlogData) => void;
  onSearch: (value: string) => void;
  searchQuery: string;
  pagination: PaginationProps;
}

const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  loading,
  onEdit,
  onDelete,
  onView,
  onSearch,
  searchQuery,
  pagination
}) => {
  const columns: ColumnsType<BlogData> = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Image
          src={image}
          width={60}
          height={40}
          style={{ objectFit: 'cover' }}
          preview={false}
        />
      ),
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: BlogData, b: BlogData) => a.title.localeCompare(b.title),
      render: (title: string) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{title}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Tác giả',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: BlogData) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this blog?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
      width: 150,
      align: 'center',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Search
          placeholder="Tìm kiếm blog..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={onSearch}
          defaultValue={searchQuery}
          loading={loading}
          className="max-w-md"
        />
      </div>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        className="bg-white rounded-lg shadow"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: pagination.onChange,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total: number) => `Tổng ${total} bài viết`
        }}
      />
    </div>
  );
};

export default BlogTable;