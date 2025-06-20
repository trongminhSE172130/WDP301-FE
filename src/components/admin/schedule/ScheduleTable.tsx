import React, { useState } from 'react';
import { Table, Space, Button, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';
import type { ColumnsType } from 'antd/es/table';
import ScheduleDetailModal from './ScheduleDetailModal';

interface ScheduleTableProps {
  data: Schedule[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  data, 
  loading = false,
  onEdit,
  onDelete
}) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleView = (id: string) => {
    setSelectedScheduleId(id);
    setDetailModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const renderStatus = (isBooked: boolean) => {
    const color = isBooked ? 'blue' : 'green';
    const text = isBooked ? 'Đã đặt' : 'Còn trống';
    const icon = isBooked ? <CheckCircleOutlined /> : <ClockCircleOutlined />;

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const renderScheduleType = (type: string) => {
    const color = type === 'advice' ? 'cyan' : 'purple';
    const text = type === 'advice' ? 'Tư vấn' : 'Khám bệnh';
    
    return (
      <Tag color={color}>
        {text}
      </Tag>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
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
            <div className="font-semibold text-gray-800">{formatDate(record.date)}</div>
            <div className="text-sm text-gray-500">{record.time_slot}</div>
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Tư vấn viên',
      key: 'consultant',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-800">{record.consultant_user_id.full_name}</div>
          <div className="text-sm text-gray-500">{record.consultant_user_id.email}</div>
        </div>
      ),
    },
    {
      title: 'Loại lịch',
      dataIndex: 'schedule_type',
      key: 'schedule_type',
      width: 120,
      render: (type) => renderScheduleType(type),
      filters: [
        { text: 'Tư vấn', value: 'advice' },
        { text: 'Khám bệnh', value: 'consultation' },
      ],
      onFilter: (value, record) => record.schedule_type === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_booked',
      key: 'is_booked',
      width: 120,
      render: (isBooked) => renderStatus(isBooked),
      filters: [
        { text: 'Còn trống', value: false },
        { text: 'Đã đặt', value: true },
      ],
      onFilter: (value, record) => record.is_booked === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (createdAt) => (
        <span className="text-gray-600">{formatDate(createdAt)}</span>
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
              onClick={() => handleView(record._id)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record._id)}
              className="text-green-600 hover:text-green-800"
            />
          </Tooltip>
          
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa lịch trình này?"
            onConfirm={() => handleDelete(record._id)}
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
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
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

      {/* Schedule Detail Modal */}
      <ScheduleDetailModal
        visible={detailModalVisible}
        scheduleId={selectedScheduleId}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedScheduleId(null);
        }}
        onEdit={(schedule) => {
          if (onEdit) {
            onEdit(schedule._id);
          }
        }}
      />
    </>
  );
};

export default ScheduleTable; 