import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Modal, Descriptions, Select, message } from 'antd';
import apiClient from '../../../service/instance';

interface Booking {
  _id: string;
  user_id: {
    full_name: string;
    email: string;
  };
  consultant_schedule_id: {
    date: string;
    time_slot: string;
  };
  status: string;
}

interface BookingDetail {
  _id: string;
  user_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  service_id: string;
  consultant_schedule_id: {
    _id: string;
    consultant_user_id: {
      _id: string;
      full_name: string;
      email: string;
    };
    date: string;
    time_slot: string;
    schedule_type: string;
    is_booked: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  user_subscription_id: string;
  status: string;
  question: string;
  created_at: string;
  updated_at: string;
  __v: number;
  cancellation_reason: string | null;
  cancelled_by: string | null;
}

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang tư vấn' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const ConsultantConsultations: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, []);

  const fetchList = () => {
    setLoading(true);
    apiClient.get('/consultants/bookings')
      .then(res => {
        setData(res.data.data || []);
        setError(null);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu lịch tư vấn.');
      })
      .finally(() => setLoading(false));
  };

  const showDetail = (id: string) => {
    setDetailLoading(true);
    setModalVisible(true);
    apiClient.get(`/consultants/bookings/${id}`)
      .then(res => {
        setBookingDetail(res.data.data);
      })
      .catch(() => {
        setBookingDetail(null);
      })
      .finally(() => setDetailLoading(false));
  };

  const handleStatusChange = (value: string) => {
    if (!bookingDetail) return;
    setStatusUpdating(true);
    apiClient.put(`/consultants/bookings/${bookingDetail._id}`, { status: value })
      .then(() => {
        message.success('Cập nhật trạng thái thành công!');
        // Reload lại chi tiết booking
        return apiClient.get(`/consultants/bookings/${bookingDetail._id}`);
      })
      .then(res => {
        setBookingDetail(res.data.data);
        fetchList(); // reload lại danh sách
      })
      .catch(() => {
        message.error('Cập nhật trạng thái thất bại!');
      })
      .finally(() => setStatusUpdating(false));
  };

  const columns = [
    {
      title: 'Tên khách hàng',
      key: 'customerName',
      render: (_: unknown, record: Booking) => record.user_id.full_name,
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

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#08979c', marginBottom: 24, letterSpacing: 1 }}>
        Hàng đợi tư vấn
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
            onClick: () => showDetail(record._id)
          })}
        />
      )}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="Chi tiết lịch tư vấn"
        width={600}
      >
        {detailLoading ? <Spin /> : bookingDetail ? (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Tên khách hàng">{bookingDetail.user_id.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email khách hàng">{bookingDetail.user_id.email}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {new Date(bookingDetail.consultant_schedule_id.date).toLocaleDateString('vi-VN')} ({bookingDetail.consultant_schedule_id.time_slot})
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Select
                value={bookingDetail.status}
                onChange={handleStatusChange}
                style={{ minWidth: 160 }}
                loading={statusUpdating}
                disabled={statusUpdating}
              >
                {statusOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                ))}
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Câu hỏi tư vấn">{bookingDetail.question}</Descriptions.Item>
          </Descriptions>
        ) : <Alert type="error" message="Không thể tải chi tiết lịch hẹn." showIcon />}
      </Modal>
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

export default ConsultantConsultations; 