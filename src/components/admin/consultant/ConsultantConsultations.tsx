import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Modal, Descriptions, message, Button, Tag, Space, Tooltip } from 'antd';
import { RightOutlined, CloseOutlined } from '@ant-design/icons';
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
  meeting_link: string | null;
}

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang xử lí' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const statusFlow = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
];

function getNextStatus(current: string) {
  const idx = statusFlow.indexOf(current);
  if (idx === -1 || idx === statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
}

const ConsultantConsultations: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [updateMeetingModalVisible, setUpdateMeetingModalVisible] = useState(false);
  const [newMeetingLink, setNewMeetingLink] = useState('');
  const [updatingMeeting, setUpdatingMeeting] = useState(false);

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

    let cancellation_reason = "";
    if (value === "cancelled") {
      cancellation_reason = "Hủy bởi tư vấn viên";
    }

    apiClient.put(`/consultants/bookings/${bookingDetail._id}`, {
      status: value,
      cancellation_reason
    })
      .then(() => {
        message.success('Cập nhật trạng thái thành công!');
        return apiClient.get(`/consultants/bookings/${bookingDetail._id}`);
      })
      .then(res => {
        setBookingDetail(res.data.data);
        fetchList();
      })
      .catch((err) => {
        if (err.response) {
          console.error('Lỗi cập nhật trạng thái:', err.response.data);
          message.error('Cập nhật trạng thái thất bại! ' + (err.response.data?.message || ''));
        } else {
          console.error('Lỗi cập nhật trạng thái:', err);
          message.error('Cập nhật trạng thái thất bại!');
        }
      })
      .finally(() => setStatusUpdating(false));
  };

  const handleUpdateMeetingLink = () => {
    if (!bookingDetail) return;
    setUpdatingMeeting(true);
    apiClient.put(`/consultants/bookings/${bookingDetail._id}/meeting-link`, {
      meeting_link: newMeetingLink
    })
      .then((res) => {
        const { data, message: apiMessage } = res.data;
        setBookingDetail(prev => prev ? { ...prev, meeting_link: data.meeting_link } : prev);
        message.success(apiMessage || 'Cập nhật link tư vấn thành công!');
        setUpdateMeetingModalVisible(false);
        setNewMeetingLink('');
      })
      .catch(() => {
        message.error('Cập nhật link tư vấn thất bại!');
      })
      .finally(() => setUpdatingMeeting(false));
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
        width={800}
      >
        {detailLoading ? <Spin /> : bookingDetail ? (
          <Descriptions
            column={1}
            bordered
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
            <Descriptions.Item label="Tên khách hàng">{bookingDetail.user_id.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email khách hàng">{bookingDetail.user_id.email}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {new Date(bookingDetail.consultant_schedule_id.date).toLocaleDateString('vi-VN')} ({bookingDetail.consultant_schedule_id.time_slot})
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Space>
                <Tag
                  color={
                    bookingDetail.status === 'pending' ? 'orange'
                    : bookingDetail.status === 'in_progress' ? 'blue'
                    : bookingDetail.status === 'confirmed' ? 'cyan'
                    : bookingDetail.status === 'completed' ? 'green'
                    : bookingDetail.status === 'cancelled' ? 'red'
                    : 'default'
                  }
                  style={{ fontSize: 16, fontWeight: 600, padding: '4px 18px', borderRadius: 20 }}
                >
                  {statusOptions.find(opt => opt.value === bookingDetail.status)?.label}
                </Tag>
                {getNextStatus(bookingDetail.status) && (
                  <Tooltip title={`Chuyển sang: ${statusOptions.find(opt => opt.value === getNextStatus(bookingDetail.status))?.label}`}>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<RightOutlined />}
                      loading={statusUpdating}
                      onClick={() => handleStatusChange(getNextStatus(bookingDetail.status)!)}
                      disabled={statusUpdating}
                    >
                      {statusOptions.find(opt => opt.value === getNextStatus(bookingDetail.status))?.label}
                    </Button>
                  </Tooltip>
                )}
                {(bookingDetail.status === 'pending' || bookingDetail.status === 'in_progress') && (
                  <Tooltip title="Hủy lịch">
                    <Button
                      danger
                      shape="round"
                      icon={<CloseOutlined />}
                      loading={statusUpdating}
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={statusUpdating}
                    >
                      Hủy lịch
                    </Button>
                  </Tooltip>
                )}
              </Space>
            </Descriptions.Item>
            {(bookingDetail.status === 'confirmed' || bookingDetail.status === 'completed' || bookingDetail.status === 'in_progress') && (
              <Descriptions.Item label="Link cuộc họp">
                {bookingDetail.meeting_link ? (
                  <a href={bookingDetail.meeting_link} target="_blank" rel="noopener noreferrer">
                    {bookingDetail.meeting_link}
                  </a>
                ) : (
                  <>
                    <span style={{ color: '#d48806', marginRight: 12 }}>Lịch tư vấn chưa được cập nhật</span>
                    <Button type="primary" size="small" onClick={() => setUpdateMeetingModalVisible(true)}>
                      Cập nhật lịch tư vấn
                    </Button>
                  </>
                )}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Câu hỏi tư vấn">{bookingDetail.question}</Descriptions.Item>
          </Descriptions>
        ) : <Alert type="error" message="Không thể tải chi tiết lịch hẹn." showIcon />}
      </Modal>
      <Modal
        open={updateMeetingModalVisible}
        onCancel={() => { setUpdateMeetingModalVisible(false); setNewMeetingLink(''); }}
        onOk={handleUpdateMeetingLink}
        title="Cập nhật link tư vấn"
        okText="Cập nhật"
        confirmLoading={updatingMeeting}
      >
        <div style={{ marginBottom: 8 }}>
          <label>Nhập link tư vấn mới:</label>
          <input
            type="text"
            value={newMeetingLink}
            onChange={e => setNewMeetingLink(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #d9d9d9' }}
            placeholder="https://..."
          />
        </div>
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