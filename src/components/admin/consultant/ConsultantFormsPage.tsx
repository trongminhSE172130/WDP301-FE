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
  const [bookingFormSchema, setBookingFormSchema] = useState<any | null>(null);
  const [bookingFormSchemaLoading, setBookingFormSchemaLoading] = useState(false);
  const [resultFormSchema, setResultFormSchema] = useState<any | null>(null);
  const [resultFormSchemaLoading, setResultFormSchemaLoading] = useState(false);

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

  // Lấy schema booking_form khi sang bước 2 và đã chọn booking
  useEffect(() => {
    if (current === 1 && selectedBooking) {
      setBookingFormSchemaLoading(true);
      setBookingFormSchema(null);
      const serviceId = selectedBooking.raw.service_id._id || selectedBooking.raw.service_id;
      const formType = 'booking_form';
      apiClient.get(`/dynamic-forms/schemas/${serviceId}/${formType}`)
        .then(res => {
          if (res.data && res.data.success) {
            setBookingFormSchema(res.data.data);
          } else {
            setBookingFormSchema(null);
          }
        })
        .catch(() => {
          setBookingFormSchema(null);
          message.error('Không thể tải biểu mẫu đặt lịch!');
        })
        .finally(() => setBookingFormSchemaLoading(false));
    }
  }, [current, selectedBooking]);

  // Lấy schema result_form khi sang bước 3 và đã chọn booking
  useEffect(() => {
    if (current === 2 && selectedBooking) {
      setResultFormSchemaLoading(true);
      setResultFormSchema(null);
      const serviceId = selectedBooking.raw.service_id._id || selectedBooking.raw.service_id;
      const formType = 'result_form';
      apiClient.get(`/dynamic-forms/schemas/${serviceId}/${formType}`)
      
        .then(res => {
          if (res.data && res.data.success) {
            
            setResultFormSchema(res.data.data);
          } else {
            setResultFormSchema(null);
          }
        })
        .catch(() => {
          setResultFormSchema(null);
          message.error('Không thể tải biểu mẫu kết quả!');
        })
        .finally(() => setResultFormSchemaLoading(false));
    }
  }, [current, selectedBooking]);

  const next = () => setCurrent((c) => c + 1);
  const prev = () => setCurrent((c) => c - 1);

  // Submit booking_form
  const handleSubmitBookingForm = (formData: any) => {
    if (!selectedBooking || !bookingFormSchema) return;
    const serviceId = typeof selectedBooking.raw.service_id === 'string'
      ? selectedBooking.raw.service_id
      : selectedBooking.raw.service_id._id;
    // Build data theo section
    const sectionedData: Record<string, any> = {};
    bookingFormSchema.sections.forEach((section: any) => {
      sectionedData[section.section_name] = {};
      section.fields.forEach((field: any) => {
        sectionedData[section.section_name][field.field_name] = formData[field.field_name];
      });
    });
    const body = {
      form_type: 'booking_form',
      service_id: serviceId,
      booking_id: selectedBooking.raw._id,
      form_schema_id: bookingFormSchema._id,
      data: sectionedData
    };
    console.log('Submit booking_form body:', body);
    console.log('Submit booking_form data:', JSON.stringify(body.data, null, 2));
    setLoading(true);
    apiClient.post('/dynamic-forms/data', body)
      .then(res => {
        if (res.data && res.data.success) {
          setBookingFormData(res.data.data);
          message.success('Đã lưu phiếu đặt lịch!');
          next();
        } else {
          message.error('Không thể lưu phiếu đặt lịch.');
        }
      })
      .catch((err) => {
        message.error('Không thể lưu phiếu đặt lịch.');
        console.error('Submit booking_form error:', err?.response?.data || err);
      })
      .finally(() => setLoading(false));
  };
  // Submit result_form
  const handleSubmitResultForm = (formData: any) => {
    if (!selectedBooking || !resultFormSchema) return;
    const serviceId = typeof selectedBooking.raw.service_id === 'string'
      ? selectedBooking.raw.service_id
      : selectedBooking.raw.service_id._id;
    // Build data theo section
    const sectionedData: Record<string, any> = {};
    resultFormSchema.sections.forEach((section: any) => {
      sectionedData[section.section_name] = {};
      section.fields.forEach((field: any) => {
        let value = formData[field.field_name];
        if (value === undefined) {
          if (field.field_type === 'checkbox') value = [];
          else value = '';
        }
        sectionedData[section.section_name][field.field_name] = value;
      });
    });
    const body = {
      form_type: 'result_form',
      service_id: serviceId,
      booking_id: selectedBooking.raw._id,
      form_schema_id: resultFormSchema._id,
      data: sectionedData
    };
    setLoading(true);
    apiClient.post('/dynamic-forms/data', body)
      .then(res => {
        if (res.data && res.data.success) {
          setResultFormData(res.data.data);
          message.success('Đã lưu phiếu kết quả!');
          next();
        } else {
          message.error('Không thể lưu phiếu kết quả.');
        }
      })
      .catch((err) => {
        message.error('Không thể lưu phiếu kết quả.');
        console.error('Submit result_form error:', err?.response?.data || err);
      })
      .finally(() => setLoading(false));
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
          bookingFormSchemaLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
          ) : bookingFormSchema ? (
            <>
              <DynamicFormRenderer
                form={bookingFormSchema}
                initialValues={bookingFormData}
                onSubmit={handleSubmitBookingForm}
                onBack={prev}
              />
              <div style={{ textAlign: 'center', color: '#d4380d', padding: 40 }}>Không thể tải biểu mẫu đặt lịch.</div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#d4380d', padding: 40 }}>Không thể tải biểu mẫu đặt lịch.</div>
          )
        )}
        {current === 2 && (
          resultFormSchemaLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
          ) : resultFormSchema ? (
            <DynamicFormRenderer
              form={resultFormSchema}
              initialValues={resultFormData}
              onSubmit={handleSubmitResultForm}
              onBack={prev}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#d4380d', padding: 40 }}>
              Chưa có biểu mẫu kết quả cho dịch vụ này.
            </div>
          )
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