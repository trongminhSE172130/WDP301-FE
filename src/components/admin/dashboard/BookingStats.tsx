import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BookingStatusBreakdown, BookingDailyTrend, ServicePopularity, ConsultantWorkload } from '../../../service/api/dashboardAPI';

interface BookingStatsProps {
  statusBreakdown: BookingStatusBreakdown[];
  dailyTrend: BookingDailyTrend[];
  servicePopularity: ServicePopularity[];
  consultantWorkload: ConsultantWorkload[];
}

const BookingStats: React.FC<BookingStatsProps> = ({
  statusBreakdown,
  dailyTrend,
  servicePopularity,
  consultantWorkload,
}) => {
  // Tính tổng số booking để làm tỷ lệ phần trăm
  const totalBookings = statusBreakdown.reduce((sum, item) => sum + item.count, 0);

  // Format data cho biểu đồ daily trend
  const formattedDailyTrend = dailyTrend.map(item => ({
    date: item._id,
    'Tổng booking': item.count,
    'Hoàn thành': item.completed,
    'Đã hủy': item.cancelled,
  }));

  return (
    <div className="booking-stats">
      <Row gutter={[16, 16]}>
        {/* Trạng thái Booking */}
        <Col span={12}>
          <Card title="Trạng thái Booking">
            {statusBreakdown.map(status => (
              <div key={status._id} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="capitalize">{status._id}</span>
                  <span>{status.count}</span>
                </div>
                <Progress 
                  percent={Math.round((status.count / totalBookings) * 100)} 
                  showInfo={false}
                  status={
                    status._id === 'completed' ? 'success' :
                    status._id === 'pending' ? 'normal' :
                    'active'
                  }
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Xu hướng Booking */}
        <Col span={12}>
          <Card title="Xu hướng Booking">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={formattedDailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tổng booking" fill="#8884d8" />
                  <Bar dataKey="Hoàn thành" fill="#82ca9d" />
                  <Bar dataKey="Đã hủy" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Dịch vụ phổ biến */}
        <Col span={12}>
          <Card title="Dịch vụ phổ biến">
            {servicePopularity.map(service => (
              <div key={service._id} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{service.service_name}</span>
                  <span>{service.bookings} bookings</span>
                </div>
                <Progress 
                  percent={Math.round((service.bookings / totalBookings) * 100)}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Khối lượng công việc tư vấn viên */}
        <Col span={12}>
          <Card title="Khối lượng công việc tư vấn viên">
            {consultantWorkload.map(consultant => (
              <div key={consultant._id} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{consultant.consultant_name}</span>
                  <span>{consultant.completed_bookings}/{consultant.total_bookings}</span>
                </div>
                <Progress 
                  percent={Math.round((consultant.completed_bookings / consultant.total_bookings) * 100)}
                  showInfo={true}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookingStats; 