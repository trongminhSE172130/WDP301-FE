import React from 'react';
import { Table, Button, Space, Tooltip, Typography, Switch, Rate } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Feedback } from '../../../service/api/feedbackAPI';

const { Text } = Typography;

interface FeedbackTableProps {
  feedbacks: Feedback[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onViewDetail: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewDetail,
  onDelete,
  onToggleFeatured
}) => {
  // Định nghĩa các cột cho bảng
  const columns: ColumnsType<Feedback> = [
    {
      title: 'Người dùng',
      dataIndex: 'user_id',
      key: 'user',
      render: (user_id) => (
        typeof user_id === 'object' ? (
          <div>
            <div>{user_id.full_name}</div>
            <Text type="secondary" className="text-xs">{user_id.email}</Text>
          </div>
        ) : 'Không xác định'
      )
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service_id',
      key: 'service',
      render: (service_id) => (
        typeof service_id === 'object' ? service_id.title : 'Không xác định'
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'default';
        let text = 'Chờ xử lý';
        
        switch(status) {
          case 'approved':
            color = 'green';
            text = 'Đã duyệt';
            break;
          case 'rejected':
            color = 'red';
            text = 'Từ chối';
            break;
          case 'hidden':
            color = 'gray';
            text = 'Ẩn';
            break;
          default:
            color = 'gold';
            text = 'Chờ xử lý';
        }
        
        return <span className={`px-2 py-1 rounded text-xs text-white bg-${color}-500`}>{text}</span>;
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <Tooltip title={comment}>
          <div className="truncate max-w-[200px]">{comment}</div>
        </Tooltip>
      )
    },
    {
      title: 'Nổi bật',
      dataIndex: 'is_featured',
      key: 'is_featured',
      render: (is_featured, record) => (
        <Switch 
          checked={!!is_featured} 
          size="small" 
          onChange={() => onToggleFeatured(record._id, !!is_featured)}
        />
      )
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
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => onViewDetail(record)}
          >
            {record.admin_reply ? 'Xem phản hồi' : 'Phản hồi'}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => onDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={feedbacks} 
      rowKey="_id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} mục`
      }}
    />
  );
};

export default FeedbackTable; 