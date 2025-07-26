import React from 'react';
import {
  Table,
  Tag,
  Typography,
  Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { NotificationItem } from '../../../service/api/notificationAPI';

const { Text } = Typography;

interface PushNotificationTableProps {
  notifications: NotificationItem[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  };
  onTableChange: (page: number, pageSize?: number) => void;
}

const PushNotificationTable: React.FC<PushNotificationTableProps> = ({
  notifications,
  loading,
  pagination,
  onTableChange
}) => {
  const columns: ColumnsType<NotificationItem> = [
    {
      title: 'Tiêu đề',
      dataIndex: ['notification', 'title'],
      key: 'title',
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Nội dung',
      dataIndex: ['notification', 'body'],
      key: 'body',
      width: 300,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 250 }}>
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'Loại gửi',
      dataIndex: 'send_type',
      key: 'send_type',
      width: 120,
      render: (sendType: string) => {
        const typeConfig = {
          role: { color: 'blue', text: 'Cho tất cả người dùng' },
          user: { color: 'green', text: 'Cá nhân' }
        };
        const config = typeConfig[sendType as keyof typeof typeConfig] || { color: 'default', text: sendType };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'sent_at',
      key: 'sent_at',
      width: 180,
      render: (time: string) => (
        <Text type="secondary">
          {dayjs(time).format('DD/MM/YYYY HH:mm')}
        </Text>
      )
    },
    {
      title: 'Người gửi',
      dataIndex: ['sent_by', 'full_name'],
      key: 'sent_by',
      width: 150
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={notifications}
      loading={loading}
      rowKey="_id"
      scroll={{ x: 1100 }}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} mục`,
        onChange: onTableChange,
        onShowSizeChange: onTableChange
      }}
    />
  );
};

export default PushNotificationTable; 