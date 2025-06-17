import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';
import type { ColumnsType } from 'antd/es/table';

interface ScheduleTableProps {
  data: Schedule[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  data, 
  loading = false,
  onEdit,
  onView,
  onDelete
}) => {
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const renderStatus = (status: string) => {
    let color = '';
    let text = '';
    let icon = null;

    switch (status) {
      case 'available':
        color = 'green';
        text = 'Còn trống';
        icon = <ClockCircleOutlined />;
        break;
      case 'booked':
        color = 'blue';
        text = 'Đã đặt';
        icon = <CheckCircleOutlined />;
        break;
      case 'completed':
        color = 'cyan';
        text = 'Đã hoàn thành';
        icon = <CheckCircleOutlined />;
        break;
      case 'cancelled':
        color = 'red';
        text = 'Đã hủy';
        icon = <ClockCircleOutlined />;
        break;
      default:
        color = 'default';
        text = status;
    }

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const columns: ColumnsType<Schedule> = [
    {
      title: 'Lịch trình',
      key: 'schedule',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CalendarOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-800">{record.title}</div>
            <div className="text-sm text-gray-500">{record.date} • {record.startTime} - {record.endTime}</div>
          </div>
        </div>
      ),
      width: 300,
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 200,
      render: (doctor) => (
        <span className="text-gray-700">{doctor}</span>
      ),
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      width: 150,
      render: (specialty) => (
        <Tag color="cyan">{specialty}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => renderStatus(status),
      filters: [
        { text: 'Còn trống', value: 'available' },
        { text: 'Đã đặt', value: 'booked' },
        { text: 'Đã hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      ellipsis: true,
      render: (note) => (
        <span className="text-gray-600">{note || 'Không có ghi chú'}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              className="text-green-600 hover:text-green-800"
            />
          </Tooltip>
          
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa lịch trình này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-800"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} lịch trình`,
      }}
      scroll={{ x: 1200 }}
      className="schedule-table"
    />
  );
};

export default ScheduleTable; 