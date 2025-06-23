import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Form, DatePicker, Select, Button } from 'antd';
import apiClient from '../../../service/instance';
import dayjs from 'dayjs';

interface Schedule {
  _id: string;
  consultant_user_id: {
    full_name: string;
    email: string;
  };
  date: string;
  time_slot: string;
  schedule_type: string;
  is_booked: boolean;
}

const { Option } = Select;

const ConsultantAvailability: React.FC = () => {
  const [data, setData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    date: undefined as string | undefined,
    available: undefined as boolean | undefined,
    type: undefined as string | undefined,
    future: undefined as boolean | undefined,
  });

  // Lấy consultant_id từ localStorage
  let consultantId = '';
  let userObj: any = null;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        userObj = JSON.parse(userStr);
        consultantId = userObj.id;
      } catch { /* ignore */ }
    }
  }
  console.log('User object in localStorage:', userObj);
  console.log('Consultant ID lấy từ localStorage:', consultantId);

  const fetchData = () => {
    setLoading(true);
    const params: any = { consultant: consultantId };
    if (filters.date) params.date = filters.date;
    if (filters.available !== undefined) params.available = filters.available;
    if (filters.type) params.type = filters.type;
    if (filters.future !== undefined) params.future = filters.future;
    console.log('Params gửi lên:', params);
    apiClient.get('/consultant-schedules', { params })
      .then(res => {
        setData(res.data.data || []);
        setError(null);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu lịch làm việc.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (values: any) => {
    setFilters({
      date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : undefined,
      available: values.available,
      type: values.type,
      future: values.future,
    });
    setTimeout(fetchData, 0); // fetch ngay sau khi setFilters
  };

  const columns = [
    {
      title: 'Tên tư vấn viên',
      key: 'consultantName',
      render: (_: unknown, record: Schedule) => record.consultant_user_id.full_name,
    },
    {
      title: 'Email',
      key: 'consultantEmail',
      render: (_: unknown, record: Schedule) => record.consultant_user_id.email,
    },
    {
      title: 'Ngày',
      key: 'date',
      render: (_: unknown, record: Schedule) => {
        const date = new Date(record.date);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Khung giờ',
      key: 'time_slot',
      render: (_: unknown, record: Schedule) => record.time_slot,
    },
    {
      title: 'Loại lịch',
      key: 'schedule_type',
      render: (_: unknown, record: Schedule) => record.schedule_type === 'advice' ? 'Tư vấn' : record.schedule_type,
    },
    {
      title: 'Trạng thái',
      key: 'is_booked',
      render: (_: unknown, record: Schedule) => {
        const isBooked = record.is_booked;
        const color = isBooked ? '#cf1322' : '#389e0d';
        const bg = isBooked ? '#fff1f0' : '#f6ffed';
        const border = isBooked ? '#ffa39e' : '#b7eb8f';
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
              textTransform: 'none',
            }}
            disabled
          >
            {isBooked ? 'Đã đặt' : 'Còn trống'}
          </button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#08979c', marginBottom: 24, letterSpacing: 1 }}>
        Lịch làm việc tư vấn viên
      </h2>
      <Form
        layout="inline"
        onFinish={handleFilter}
        style={{ marginBottom: 24, gap: 12, flexWrap: 'wrap' }}
      >
        <Form.Item name="date" label="Ngày">
          <DatePicker format="YYYY-MM-DD" allowClear />
        </Form.Item>
        <Form.Item name="available" label="Trạng thái">
          <Select allowClear style={{ width: 120 }} placeholder="Tất cả">
            <Option value={true}>Còn trống</Option>
            <Option value={false}>Đã đặt</Option>
          </Select>
        </Form.Item>
        <Form.Item name="type" label="Loại lịch">
          <Select allowClear style={{ width: 120 }} placeholder="Tất cả">
            <Option value="advice">Tư vấn</Option>
            <Option value="analysis">Phân tích</Option>
          </Select>
        </Form.Item>
        <Form.Item name="future" label="Tương lai">
          <Select allowClear style={{ width: 120 }} placeholder="Tất cả">
            <Option value={true}>Chỉ tương lai</Option>
            <Option value={false}>Tất cả</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Lọc</Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      {loading ? <Spin /> : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
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

export default ConsultantAvailability; 