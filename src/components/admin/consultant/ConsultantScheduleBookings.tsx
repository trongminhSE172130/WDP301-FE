import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Modal, Descriptions, Tag, message } from 'antd';
import apiClient from '../../../service/instance';

interface Booking {
  _id: string;
  user_id: {
    full_name: string;
    email: string;
    phone: string;
    gender?: string;
    dob?: string;
  };
  service_id: {
    title: string;
    description?: string;
    duration?: string;
    sample_type?: string;
    test_details?: any;
  };
  consultant_schedule_id: {
    date: string;
    time_slot: string;
    consultant_user_id?: { full_name: string };
  };
  status: string;
}

// Modal hiển thị chi tiết booking
const BookingDetailModal = ({ visible, loading, booking, onClose }: any) => {
  if (!booking) return null;
  const user = booking.user_id;
  const service = booking.service_id;
  const schedule = booking.consultant_schedule_id;
  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết lịch hẹn" width={800}>
      {loading ? <Spin /> : (
        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{
            minWidth: 150,
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: 'nowrap',
            background: '#fafafa'
          }}
          contentStyle={{
            fontSize: 15,
            verticalAlign: 'middle'
          }}
        >
          <Descriptions.Item label="Khách hàng">
            <b>{user.full_name}</b> {user.gender ? `(${user.gender === 'female' ? 'Nữ' : 'Nam'})` : ''}<br/>
            <span>Email: {user.email}</span><br/>
            <span>SĐT: {user.phone}</span><br/>
            <span>Ngày sinh: {user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : ''}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Dịch vụ">
            <b>{service.title}</b><br/>
            {service.description && <span>{service.description}<br/></span>}
            {service.duration && <span>Thời lượng: {service.duration}<br/></span>}
            {service.sample_type && <span>Loại mẫu: {service.sample_type}</span>}
          </Descriptions.Item>
          <Descriptions.Item label="Lịch tư vấn">
            <span>Ngày: {schedule.date ? new Date(schedule.date).toLocaleDateString('vi-VN') : ''}</span><br/>
            <span>Khung giờ: {schedule.time_slot}</span><br/>
            <span>Tư vấn viên: {schedule.consultant_user_id?.full_name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={booking.status === 'pending' ? 'orange' : booking.status === 'completed' ? 'green' : 'blue'}>
              {booking.status}
            </Tag>
          </Descriptions.Item>
          {service.test_details && (
            <Descriptions.Item label="Thông tin xét nghiệm">
              <b>Chỉ số:</b> {service.test_details.parameters?.join(', ')}<br/>
              <b>Chuẩn bị:</b> {service.test_details.preparation}<br/>
              <b>Thời gian trả kết quả:</b> {service.test_details.result_time}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

const ConsultantScheduleBookings: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State cho modal chi tiết booking
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<any>(null);
  const [loadingBookingDetail, setLoadingBookingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/bookings')
      .then(res => {
        setData(res.data.data || []);
        setError(null);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu lịch hẹn xét nghiệm.');
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: 'Tên khách hàng',
      key: 'customerName',
      render: (_: unknown, record: Booking) => record.user_id.full_name,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      render: (_: unknown, record: Booking) => record.user_id.phone,
    },
    {
      title: 'Dịch vụ',
      key: 'service',
      render: (_: unknown, record: Booking) => record.service_id.title,
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: unknown, record: Booking) => {
        const date = new Date(record.consultant_schedule_id.date);
        const dateStr = date.toLocaleDateString('vi-VN');
        return `${dateStr} (${record.consultant_schedule_id.time_slot})`;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '#595959';
        let bg = '#fff';
        let border = '#d9d9d9';
        switch (status) {
          case 'confirmed':
            color = '#389e0d'; bg = '#f6ffed'; border = '#b7eb8f'; break;
          case 'pending':
            color = '#d48806'; bg = '#fffbe6'; border = '#ffe58f'; break;
          case 'in_progress':
            color = '#096dd9'; bg = '#e6f7ff'; border = '#91d5ff'; break;
          case 'completed':
            color = '#8c8c8c'; bg = '#fafafa'; border = '#d9d9d9'; break;
          case 'cancelled':
            color = '#cf1322'; bg = '#fff1f0'; border = '#ffa39e'; break;
          default:
            color = '#595959'; bg = '#fff'; border = '#d9d9d9'; break;
        }
        return (
          <button
            style={{
              color,
              background: bg,
              border: `1.5px solid ${border}`,
              borderRadius: 16,
              padding: '2px 16px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'default',
              outline: 'none',
              minWidth: 90,
              textTransform: 'capitalize',
            }}
            disabled
          >
            {status.replace('_', ' ')}
          </button>
        );
      },
    },
  ];

  // Xem chi tiết booking
  const handleShowBookingDetail = (bookingId: string) => {
    setShowBookingDetail(true);
    setLoadingBookingDetail(true);
    apiClient.get(`/bookings/${bookingId}`)
      .then(res => {
        if (res.data && res.data.success) {
          setBookingDetail(res.data.data.booking);
        } else {
          setBookingDetail(null);
        }
      })
      .catch(() => {
        message.error('Không thể tải chi tiết lịch hẹn.');
        setBookingDetail(null);
      })
      .finally(() => setLoadingBookingDetail(false));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#08979c', marginBottom: 24, letterSpacing: 1 }}>
        Lịch hẹn xét nghiệm
      </h2>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      {loading ? <Spin /> : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8 }}
          bordered
          style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          className="custom-table"
          onRow={record => ({
            onClick: () => handleShowBookingDetail(record._id),
          })}
        />
      )}
      <BookingDetailModal
        visible={showBookingDetail}
        loading={loadingBookingDetail}
        booking={bookingDetail}
        onClose={() => setShowBookingDetail(false)}
      />
      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: #e6fffb;
          font-weight: 600;
          font-size: 16px;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #f0fdfa;
        }
        .custom-table .ant-table {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default ConsultantScheduleBookings; 