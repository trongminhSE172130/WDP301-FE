import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import {
  UserOutlined,
  MoneyCollectOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import AppointmentTable from '../../components/admin/dashboard/AppointmentTable';
import type { Appointment } from '../../components/admin/dashboard/AppointmentTable';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  // Fake data for dashboard statistics
  const stats = [
    { id: 1, title: 'Tổng số người dùng', value: 1245, increase: 12, icon: <UserOutlined /> },
    { id: 2, title: 'Doanh thu tháng này', value: 235800000, prefix: '₫', increase: 8.2, icon: <MoneyCollectOutlined /> },
    { id: 3, title: 'Đơn hàng mới', value: 43, increase: 2.3, icon: <ShoppingOutlined /> },
  ];

  // Appointment data
  const appointmentData: Appointment[] = [
    { id: 1, patient: 'Nguyễn Thị H', service: 'Khám tổng quát', status: 'confirmed', time: '09:00 - 15/07/2023' },
    { id: 2, patient: 'Trần Văn K', service: 'Tư vấn dinh dưỡng', status: 'pending', time: '10:30 - 15/07/2023' },
    { id: 3, patient: 'Lê Thị M', service: 'Siêu âm', status: 'confirmed', time: '13:45 - 15/07/2023' },
    { id: 4, patient: 'Phạm Văn N', service: 'Xét nghiệm máu', status: 'cancelled', time: '15:00 - 15/07/2023' },
  ];

  return (
    <div className="w-full">
      <Title level={2}>Bảng điều khiển</Title>
      <Divider />
      
      {/* Stats Cards */}
      <StatsCard stats={stats} />

      {/* Upcoming Appointments */}
      <Row className="w-full mt-6">
        <Col span={24}>
          <AppointmentTable data={appointmentData} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 