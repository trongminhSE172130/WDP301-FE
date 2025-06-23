import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import apiClient from '../../../service/instance';

interface Booking {
  _id: string;
  user_id: {
    full_name: string;
    email: string;
    phone: string;
  };
  service_id: {
    title: string;
  };
  consultant_schedule_id: {
    date: string;
    time_slot: string;
  };
  status: string;
}

const ConsultantScheduleBookings: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        />
      )}
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