import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Modal, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import BookingDetailModal from './BookingDetailModal';
import type { ColumnsType } from 'antd/es/table';
import type { Booking, BookingPagination } from './BookingTypes';

const { Text } = Typography;

interface BookingTableProps {
  data: Booking[];
  onDelete: (bookingId: string) => void;
  loading?: boolean;
  title?: string;
  pagination?: BookingPagination;
  onPageChange?: (page: number, pageSize?: number) => void;
  currentPageSize?: number;
}

const BookingTable: React.FC<BookingTableProps> = ({ 
  data, 
  onDelete, 
  loading = false,
  title = "Danh sách lịch hẹn",
  pagination,
  onPageChange,
  currentPageSize = 10
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteModalVisible(true);
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBookingId(booking._id);
    setDetailModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      onDelete(selectedBooking._id);
      setDeleteModalVisible(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'completed':
        return 'purple';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <UserOutlined className="text-gray-400" />
            <Text strong>{text}</Text>
          </Space>
          <Text type="secondary" className="text-xs">{record.patientPhone}</Text>
        </Space>
      )
    },
    {
      title: 'Tư vấn viên',
      dataIndex: 'consultantName',
      key: 'consultantName',
      render: (text) => text || 'Chưa phân công'
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (text) => (
        <Text className="text-sm">{text}</Text>
      )
    },
    {
      title: 'Ngày & Giờ hẹn',
      key: 'appointment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <CalendarOutlined className="text-blue-500" />
            <Text>{new Date(record.appointmentDate).toLocaleDateString('vi-VN')}</Text>
          </Space>
          <Text type="secondary" className="text-xs">{record.appointmentTime}</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined className="text-green-500" />} 
            onClick={() => handleViewDetail(record)}
            className="border border-green-500 hover:bg-green-50"
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined className="text-red-500" />} 
            onClick={() => handleDelete(record)}
            className="border border-red-500 hover:bg-red-50"
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Card title={title} bordered={false} className="w-full">
        <Table 
          dataSource={data} 
          columns={columns} 
          rowKey="_id"
          loading={loading}
          className="w-full"
          pagination={pagination ? {
            current: pagination.currentPage,
            total: pagination.totalBookings,
            pageSize: currentPageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} lịch hẹn`,
            onChange: onPageChange,
            onShowSizeChange: onPageChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          } : false}
        />
      </Card>
      
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa lịch hẹn của bệnh nhân {selectedBooking?.patientName}?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <BookingDetailModal
        visible={detailModalVisible}
        bookingId={selectedBookingId}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedBookingId(null);
        }}
      />
    </div>
  );
};

export default BookingTable; 