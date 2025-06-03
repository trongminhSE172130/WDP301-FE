import React from 'react';
import { Table, Button, Space, Popconfirm, Image, Input, Select, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BlogData } from './BlogTypes';

const { Search } = Input;
const { Option } = Select;

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
  onDelete: (id: string) => void;
  onView: (blog: BlogData) => void;
  onSearch: (value: string) => void;
  onCategoryFilter?: (value: string) => void;
  onStatusFilter?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onStatusChange?: (id: string, checked: boolean) => void;
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
  onCategoryFilter,
  onStatusFilter,
  onSortChange,
  onStatusChange,
  searchQuery,
  pagination
}) => {
  const columns: ColumnsType<BlogData> = [
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail_url',
      key: 'thumbnail_url',
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
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: BlogData) => (
        onStatusChange ? (
          <Switch
            checkedChildren="Đã xuất bản"
            unCheckedChildren="Bản nháp"
            checked={status === 'published'}
            onChange={(checked) => onStatusChange(record.id, checked)}
          />
        ) : (
          <Tag color={status === 'published' ? 'green' : 'orange'}>
            {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
          </Tag>
        )
      )
    },
    {
      title: 'Lượt xem',
      dataIndex: 'view_count',
      key: 'view_count',
      sorter: (a: BlogData, b: BlogData) => a.view_count - b.view_count,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
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
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
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
      <div className="mb-4 flex flex-wrap gap-4">
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
        
        {onCategoryFilter && (
          <Select
            placeholder="Lọc theo danh mục"
            allowClear
            style={{ width: 200 }}
            onChange={onCategoryFilter}
          >
            <Option value="">Tất cả danh mục</Option>
            {/* Danh sách danh mục sẽ được thêm sau */}
          </Select>
        )}
        
        {onStatusFilter && (
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: 160 }}
            onChange={onStatusFilter}
          >
            <Option value="">Tất cả</Option>
            <Option value="published">Đã xuất bản</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>
        )}
        
        {onSortChange && (
          <Select
            placeholder="Sắp xếp"
            style={{ width: 180 }}
            onChange={onSortChange}
            defaultValue="created_at-desc"
          >
            <Option value="created_at-desc">Mới nhất</Option>
            <Option value="created_at-asc">Cũ nhất</Option>
            <Option value="view_count-desc">Lượt xem (cao-thấp)</Option>
            <Option value="view_count-asc">Lượt xem (thấp-cao)</Option>
          </Select>
        )}
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