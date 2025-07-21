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
  // Render status tag
  const renderStatus = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', text: 'Bản nháp' },
      sent: { color: 'success', text: 'Đã gửi' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Render role/target info
  const renderTarget = (record: NotificationItem) => {
    if (record.target_info.role) {
      return <Tag color="blue">{record.target_info.role}</Tag>;
    }
    if (record.target_info.user_id) {
      return (
        <Tooltip title={`Gửi cho: ${record.target_info.user_id.full_name} (${record.target_info.user_id.email})`}>
          <Tag color="green">Người dùng cụ thể</Tag>
        </Tooltip>
      );
    }
    return <Tag color="default">Không xác định</Tag>;
  };

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
      title: 'Đối tượng',
      key: 'target',
      width: 150,
      render: (_, record) => renderTarget(record)
    },
    {
      title: 'Loại gửi',
      dataIndex: 'send_type',
      key: 'send_type',
      width: 120,
      render: (sendType: string) => {
        const typeConfig = {
          role: { color: 'blue', text: 'Theo vai trò' },
          user: { color: 'green', text: 'Cá nhân' }
        };
        const config = typeConfig[sendType as keyof typeof typeConfig] || { color: 'default', text: sendType };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderStatus
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
      scroll={{ x: 1300 }}
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