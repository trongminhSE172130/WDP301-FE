import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, message, Typography, Divider, Spin } from 'antd';
import BookingSelector from './BookingSelector';
import DynamicFormRenderer from './DynamicFormRenderer';
import apiClient from '../../../service/instance';

const { Paragraph } = Typography;

const steps = [
  { title: 'Chọn lịch hẹn', description: 'Chọn một lịch hẹn xét nghiệm để bắt đầu.' },
  { title: 'Điền phiếu đặt lịch', description: 'Nhập thông tin phiếu đặt lịch cho khách hàng.' },
  { title: 'Điền phiếu kết quả', description: 'Nhập kết quả xét nghiệm cho khách hàng.' },
  { title: 'Hoàn tất', description: 'Xác nhận và hoàn tất quy trình.' },
];

const ConsultantFormsPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingFormData, setBookingFormData] = useState<any>({});
  const [resultFormData, setResultFormData] = useState<any>({});

  // Lấy danh sách lịch hẹn xét nghiệm khi vào trang
  useEffect(() => {
    setLoading(true);
    apiClient.get('/bookings')
      .then(res => {
        if (res.data && res.data.success) {
          // Chuyển đổi dữ liệu cho BookingSelector
          const bookingsData = (res.data.data || []).map((b: any) => ({
            _id: b._id,
            user: b.user_id.full_name,
            phone: b.user_id.phone,
            service: b.service_id.title,
            time: `${new Date(b.consultant_schedule_id.date).toLocaleDateString('vi-VN')} (${b.consultant_schedule_id.time_slot})`,
            raw: b, // giữ lại object gốc nếu cần dùng sau này
          }));
          setBookings(bookingsData);
        } else {
          setBookings([]);
        }
      })
      .catch(() => {
        message.error('Không thể tải danh sách lịch hẹn xét nghiệm.');
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const next = () => setCurrent((c) => c + 1);
  const prev = () => setCurrent((c) => c - 1);

  // Giả lập submit booking_form
  const handleSubmitBookingForm = (data: any) => {
    setBookingFormData(data);
    message.success('Đã lưu phiếu đặt lịch!');
    next();
  };
  // Giả lập submit result_form
  const handleSubmitResultForm = (data: any) => {
    setResultFormData(data);
    message.success('Đã lưu phiếu kết quả!');
    next();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Card
        style={{  borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: 0 }}
        bodyStyle={{ padding: 36, paddingTop: 28 }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#08979c', marginBottom: 24, letterSpacing: 1 }}>
          Biểu mẫu
        </h2>
        <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: 32, fontSize: 16 }}>
          Quản lý và nhập liệu các biểu mẫu xét nghiệm cho khách hàng.
        </Paragraph>
        <Steps
          current={current}
          items={steps.map(s => ({ title: s.title, description: <span style={{ color: '#888', fontSize: 13 }}>{s.description}</span> }))}
          style={{ marginBottom: 36 }}
          responsive
        />
        <Divider style={{ margin: '16px 0 32px 0' }} />
        {current === 0 && (
          loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
          ) : (
            <BookingSelector
              bookings={bookings}
              value={selectedBooking}
              onChange={setSelectedBooking}
              onNext={selectedBooking ? next : undefined}
            />
          )
        )}
        {current === 1 && (
          <DynamicFormRenderer
            form={{ form_name: '', sections: [] }} // placeholder, sẽ thay bằng API ở bước sau
            initialValues={bookingFormData}
            onSubmit={handleSubmitBookingForm}
            onBack={prev}
          />
        )}
        {current === 2 && (
          <DynamicFormRenderer
            form={{ form_name: '', sections: [] }} // placeholder, sẽ thay bằng API ở bước sau
            initialValues={resultFormData}
            onSubmit={handleSubmitResultForm}
            onBack={prev}
          />
        )}
        {current === 3 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Typography.Title level={3} style={{ color: '#52c41a', marginBottom: 12 }}>Hoàn tất quy trình!</Typography.Title>
            <Paragraph style={{ fontSize: 16 }}>Đã cập nhật trạng thái thành công.</Paragraph>
            <Button type="primary" onClick={() => setCurrent(0)} style={{ marginTop: 16 }}>Làm lại</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConsultantFormsPage; 