import React, { useState, useEffect } from 'react';
import { Modal, Card, Descriptions, Tag, Space, Typography, Spin, Alert, Row, Col, Avatar, List } from 'antd';
import { UserOutlined, CalendarOutlined, MedicineBoxOutlined, FileTextOutlined, ExperimentOutlined } from '@ant-design/icons';
import { getBookingById, type BookingResult } from '../../../service/api/bookingAPI';
import type { Booking } from './BookingTypes';

const { Title, Text } = Typography;

interface BookingDetailModalProps {
  visible: boolean;
  bookingId: string | null;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  visible,
  bookingId,
  onClose
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && bookingId) {
      fetchBookingDetail();
    }
  }, [visible, bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      if (bookingId) {
        const response = await getBookingById(bookingId);
        if (response.success) {
          setBooking(response.data);
          setResult(response.result);
        }
      }
    } catch (error) {
      console.error('Error fetching booking detail:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatAge = (dobString?: string) => {
    if (!dobString) return 'Chưa cập nhật';
    const dob = new Date(dobString);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return `${age} tuổi`;
  };

  return (
    <Modal
      title="Chi tiết lịch hẹn"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : !booking ? (
        <Alert
          message="Không tìm thấy thông tin lịch hẹn"
          type="error"
          showIcon
        />
      ) : (
        <div className="space-y-6">
          {/* Header với thông tin cơ bản */}
          <Card bordered={false} className="bg-gray-50">
            <Row gutter={16} align="middle">
              <Col>
                <Avatar 
                  size={64} 
                  icon={<UserOutlined />} 
                  className="bg-blue-500"
                />
              </Col>
              <Col flex={1}>
                <Title level={4} className="mb-1">{booking.patientName}</Title>
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{booking.patientPhone}</Text>
                  {booking.patientEmail && (
                    <Text type="secondary">{booking.patientEmail}</Text>
                  )}
                  <Text type="secondary">
                    {booking.patientGender === 'female' ? 'Nữ' : 'Nam'} - {formatAge(booking.patientDob)}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Tag color={getStatusColor(booking.status)} className="text-sm px-3 py-1">
                  {getStatusText(booking.status)}
                </Tag>
              </Col>
            </Row>
          </Card>

          {/* Thông tin chi tiết */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <UserOutlined className="text-blue-500" />
                    <span>Thông tin bệnh nhân</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Họ tên">
                    {booking.patientName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {booking.patientPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {booking.patientEmail || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {booking.patientGender === 'female' ? 'Nữ' : 'Nam'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {booking.patientDob ? formatDate(booking.patientDob) : 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tuổi">
                    {formatAge(booking.patientDob)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <CalendarOutlined className="text-green-500" />
                    <span>Thông tin lịch hẹn</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Ngày hẹn">
                    {formatDate(booking.appointmentDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ hẹn">
                    {booking.appointmentTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt lịch">
                    {formatDate(booking.bookingDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    {booking.updatedAt ? formatDate(booking.updatedAt) : 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái gói">
                    <Tag color={booking.subscriptionStatus === 'active' ? 'green' : 'orange'}>
                      {booking.subscriptionStatus === 'active' ? 'Đang hoạt động' : booking.subscriptionStatus}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          {/* Thông tin dịch vụ và tư vấn viên */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <MedicineBoxOutlined className="text-purple-500" />
                    <span>Dịch vụ & Tư vấn viên</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Dịch vụ">
                    {booking.service}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả dịch vụ">
                    {booking.serviceDescription || booking.reason}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian">
                    {booking.serviceDuration || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại mẫu">
                    {booking.sampleType || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian có kết quả">
                    {booking.resultTime || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tư vấn viên">
                    {booking.consultantName || 'Chưa phân công'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email tư vấn viên">
                    {booking.consultantEmail || 'Chưa cập nhật'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <ExperimentOutlined className="text-orange-500" />
                    <span>Chi tiết xét nghiệm</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                {booking.testParameters && booking.testParameters.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <Text strong>Các chỉ số xét nghiệm:</Text>
                      <List
                        size="small"
                        className="mt-2"
                        dataSource={booking.testParameters}
                        renderItem={(parameter) => (
                          <List.Item className="py-1">
                            <Text className="text-sm">• {parameter}</Text>
                          </List.Item>
                        )}
                      />
                    </div>
                    {booking.testPreparation && (
                      <div>
                        <Text strong>Chuẩn bị:</Text>
                        <div className="mt-1">
                          <Text className="text-sm">{booking.testPreparation}</Text>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Text type="secondary" italic>Không có thông tin chi tiết xét nghiệm</Text>
                )}
              </Card>
            </Col>
          </Row>

          {/* Ghi chú và kết quả */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <FileTextOutlined className="text-indigo-500" />
                    <span>Ghi chú</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                <div className="min-h-[100px]">
                  {booking.notes ? (
                    <Text>{booking.notes}</Text>
                  ) : (
                    <Text type="secondary" italic>Không có ghi chú</Text>
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <ExperimentOutlined className="text-teal-500" />
                    <span>Kết quả</span>
                  </Space>
                } 
                bordered={false}
                className="h-full"
              >
                <div className="min-h-[100px]">
                  {result ? (
                    <div>
                      <Tag color="green" className="mb-2">Có kết quả</Tag>
                      <Text type="secondary" className="block text-xs">
                        Kết quả đã được cập nhật vào hệ thống
                      </Text>
                    </div>
                  ) : (
                    <div>
                      <Tag color="orange" className="mb-2">Chưa có kết quả</Tag>
                      <Text type="secondary" italic className="block text-xs">
                        Kết quả sẽ được cập nhật khi sẵn sàng
                      </Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default BookingDetailModal; 